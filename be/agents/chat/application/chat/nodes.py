from datetime import datetime

from langchain_core.runnables import RunnableConfig
from langchain_core.messages import SystemMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

from agents.chat.application.state import AgentState
from agents.chat.infrastructure.llm import llm
from agents.chat.application.tools import search_tool, search_for_places
from agents.chat.application.chat.summarize import SummarizeTool


TRAVEL_ASSISTANT_TEMPLATE = """
You are a helpful travel planning assistant who helps users exploring destinations, searching for information, and create well-organized itineraries.

**Tools Usage:**
- If the user want to discover places to visit, call the search_for_places tool.
- If the user ask the general question or FAQ that you don't have the ability to answer due to your limited knowledge, call the tavily_search tool
for more information to answer the question (always refer the current date).
- If the user's intent is to plan a trip, call the plan_trip tool.

**Language Policy:**
- If the user explicitly states a preferred language (e.g., "Please reply in Vietnamese"), use that.
- Otherwise, detect the predominant language in the user's message (e.g., by token counting).
- If the user mixes multiple languages, respond in the predominant language used.
- If none apply, default to US English (en).

**Scope and Tone:**
- Politely decline questions outside travel scope.
- Use a warm, friendly tone and sprinkle in emojis where appropriate.

Current Date-Time: {current_datetime}
"""


async def chat_node(state: AgentState, config: RunnableConfig):
    """Handle user messages"""
    llm_with_tools = llm.bind_tools([search_for_places, search_tool])

    summary = state.get("summary", "")
    current_datetime = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    travel_assistant_prompt = TRAVEL_ASSISTANT_TEMPLATE.format(
        current_datetime=current_datetime
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
