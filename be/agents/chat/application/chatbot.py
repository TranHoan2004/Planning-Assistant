from uuid import uuid4
from typing import Optional, TypedDict, Any
import json

from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from langchain_core.tools import tool
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import create_react_agent, tools_condition
from langchain_tavily import TavilySearch
from langgraph.types import Command, interrupt
from langgraph.graph import MessagesState
from langchain.output_parsers import PydanticOutputParser
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from typing import Optional
from langgraph.graph import StateGraph, START, END
from agents.chat.prompt.prompt import normal_prompt

from agents.chat.infrastructure.llm import llm
from agents.chat.domain.value_object import TravelInput, TimeInterval, Budget


# TODO: Parse the final user input into structered request then delegate the planning to plan agent
class InputConfig(TypedDict):
    session_id: Optional[str]
    user_id: str


class ReplyResult(TypedDict):
    data: str | list[str | dict[Any, Any]]
    session_id: str
    user_id: str


# can be expand in the future
_INTERRUPTIBLE_TOOLS = {}

search_tool = TavilySearch(
    max_results=5,
    topic="general",
)


@tool
def human_assistance(query: str) -> str:
    """Request assistance from a human."""
    human_response = interrupt({"query": query})
    return human_response["data"]


def halt_on_tools(state: MessagesState):
    last_msg = state["messages"][-1]
    if isinstance(last_msg, AIMessage) and getattr(last_msg, "tool_calls", None):
        for tc in last_msg.tool_calls:
            if tc.get("name") in _INTERRUPTIBLE_TOOLS:
                _ = interrupt({"awaiting": tc["name"], "args": tc.get("args", {})})
    return {}


# Initialize parser and structured LLM
parser = PydanticOutputParser(pydantic_object=TravelInput)
structured_llm = llm.with_structured_output(TravelInput, method="json_mode")
# TODO: improve system prompt


# Define the state of the travel graph
class TravelState(TypedDict, total=False):
    user_input: str
    travel_input: Optional[TravelInput]
    error: Optional[str]
    session_id: Optional[str]


# Node to get travel info
def get_travel_info(state: TravelState):
    try:
        # Convert TravelInput to dict if it exists
        existing_travel_input = state.get("travel_input")
        if isinstance(existing_travel_input, TravelInput):
            travel_input_dict = existing_travel_input.dict()
        else:
            travel_input_dict = existing_travel_input or {}

        current_state = {
            "travel_input": travel_input_dict,
            "session_id": state.get("session_id"),
            "user_id": state.get("user_id"),
        }

        response = structured_llm.invoke(
            normal_prompt.format_messages(
                input=state["user_input"],
                travel_state=json.dumps(current_state, ensure_ascii=False),
            )
        )
        # Merge with existing travel_input if it exists
        existing_travel_input = state.get("travel_input")
        if existing_travel_input:
            # Update only fields that are non-empty in the new response
            merged_travel_input = TravelInput(
                destination=response.destination or existing_travel_input.destination,
                time_interval=TimeInterval(
                    from_date=response.time_interval.from_date
                    or existing_travel_input.time_interval.from_date,
                    to_date=response.time_interval.to_date
                    or existing_travel_input.time_interval.to_date,
                ),
                budget=Budget(
                    value=response.budget.value or existing_travel_input.budget.value,
                    currency=response.budget.currency
                    or existing_travel_input.budget.currency,
                ),
                preferences=response.preferences or existing_travel_input.preferences,
                faq_response=response.faq_response
                if response.faq_response
                else "",
                missing_fields=existing_travel_input.missing_fields,
            )
        else:
            merged_travel_input = response
        state["travel_input"] = merged_travel_input
        return state
    except Exception as e:
        state["faq_response"] = "Something went wrong please try again later."
        state["error"] = str(e)
        state["travel_input"] = state.get("travel_input") or TravelInput()
        return state


# Node to check missing fields and ask for missing field
def check_missing_fields(state: TravelState):
    travel_input = state["travel_input"] or TravelInput()
    missing_fields = []
    # Check required fields
    if not travel_input.destination:
        missing_fields.append("destination")
    if not travel_input.time_interval.from_date:
        missing_fields.append("start date")
    if not travel_input.time_interval.to_date:
        missing_fields.append("return date")
    if not travel_input.budget.value or travel_input.budget.value <= 0:
        missing_fields.append("budget")

    travel_input.missing_fields = list(set(missing_fields))  # Remove duplicates
    state["travel_input"] = travel_input
    return state


# Initialize checkpointing
checkpointer = MemorySaver()

# Initialize graph
graph = StateGraph(TravelState)
graph.add_node("get_travel_info", get_travel_info)
graph.add_node("check_missing_fields", check_missing_fields)

# Add edges
graph.add_edge(START, "get_travel_info")
graph.add_edge("get_travel_info", "check_missing_fields")
graph.add_edge("check_missing_fields", END)

# Compile graph with checkpointer
travel_graph = graph.compile(checkpointer=checkpointer)


# Reply function not use steaming
async def reply(input: str, input_cfg: InputConfig):
    if input_cfg["session_id"] is not None:
        config = {"configurable": {"thread_id": input_cfg["session_id"]}}
    else:
        config = {"configurable": {"thread_id": str(uuid4())}}

    state = {
        "user_input": input,
        "user_id": input_cfg["user_id"],
        "session_id": config["configurable"]["thread_id"],
    }

    result = await travel_graph.ainvoke(state, config=config)

    return {
        "data": {
            "travel_input": result.get("travel_input").dict()
            if result.get("travel_input")
            else None,
            "session_id": result.get("session_id"),
            "user_id": input_cfg["user_id"],
            "error": result.get("error"),
        }
    }


# _memory = MemorySaver()
# chat_agent = create_react_agent(
#     name="chat_agent",
#     model=llm,
#     tools=[search_tool],
#     checkpointer=_memory,
#     prompt=_prompt,
#     post_model_hook=halt_on_tools,
# )


# async def reply(input: str, input_cfg: InputConfig):
#     if input_cfg["session_id"] is not None:
#         config = {"configurable": {"thread_id": input_cfg["session_id"]}}
#     else:
#         config = {"configurable": {"thread_id": str(uuid4())}}

#     async for event in chat_agent.astream_events(
#         {"messages": [HumanMessage(content=input)]},
#         config=config,  # type: ignore
#     ):
#         if event["event"] == "on_chat_model_stream":
#             chunk_content = _serialize_ai_messages(event["data"]["chunk"])  # type: ignore
#             result: ReplyResult = {
#                 "data": chunk_content,
#                 "session_id": config["configurable"]["thread_id"],
#                 "user_id": input_cfg["user_id"],
#             }
#             yield f"{json.dumps(result)} \n\n"
#         elif event["event"] == "on_chat_model_end":
#             yield f"end\n\n"


# def _serialize_ai_messages(chunk):
#     if isinstance(chunk, AIMessage):
#         return chunk.content
#     else:
#         raise TypeError(
#             f"Object of type {type(chunk).__name__} is not correctly formatted for serialization"
#         )
