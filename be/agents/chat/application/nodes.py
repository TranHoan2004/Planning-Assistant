from datetime import datetime

from langchain_core.runnables import RunnableConfig
from langchain_core.messages import SystemMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

from agents.shared.state import AgentState
from agents.shared.infrastructure.llm import llm
from agents.chat.application.tools import search_tool, search_for_places
from agents.chat.application.summarize import SummarizeTool
from agents.chat.application.tools import plan_itinerary
from agents.chat.domain.prompt import TRAVEL_ASSISTANT_TEMPLATE


async def chat_node(state: AgentState, config: RunnableConfig):
    """Handle user messages"""
    llm_with_tools = llm.bind_tools([search_for_places, search_tool, plan_itinerary])

    summary = state.get("summary", "")
    current_datetime = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    travel_assistant_prompt = TRAVEL_ASSISTANT_TEMPLATE.format(
        current_datetime=current_datetime,
        search_for_places=search_for_places.name,
        tavily_search=search_tool.name,
        plan_itinerary=plan_itinerary.name,
    )

    if summary:
        travel_assistant_prompt += (
            f"\n\nSummary of previous conversation with user: \n\n{summary}"
        )

    prompt = ChatPromptTemplate.from_messages(
        [
            SystemMessage(content=travel_assistant_prompt),
            MessagesPlaceholder(variable_name="messages"),
        ]
    )

    chain = prompt | llm_with_tools

    response = await chain.ainvoke(input={"messages": state["messages"]}, config=config)

    return {"messages": [response]}


async def summarize_node(state: AgentState, config: RunnableConfig):
    """Handles summarizing the message conversation."""
    summarize_tool = SummarizeTool(llm)

    return await summarize_tool.summarize(state, config)
