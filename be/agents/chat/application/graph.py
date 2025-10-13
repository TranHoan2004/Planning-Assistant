from datetime import datetime

from langgraph.prebuilt import create_react_agent

from agents.chat.domain.prompt import TRAVEL_ASSISTANT_TEMPLATE
from agents.shared.infrastructure.llm import llm
from agents.shared.runtime import ContextSchema
from agents.chat.application.nodes import summarize_node
from agents.chat.application.tools import search_tool, search_for_places
from agents.chat.application.tools import plan_itinerary
from agents.hotel.application.tools import recommend_hotels, recommend_hotels_multi
from agents.chat.application.state import ChatbotState


def make_prompt(state: ChatbotState):
    system_prompt = TRAVEL_ASSISTANT_TEMPLATE.format(
        tavily_search="tavily_search",
        search_for_places="search_for_places",
        plan_itinerary="plan_itinerary",
        recommend_hotels="recommend_hotels",
        current_datetime=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    )
    if state.get("summary"):
        system_prompt += (
            f"\n\nSummary of previous conversation with user: \n\n{state['summary']}"
        )
    return [
        {"role": "system", "content": system_prompt},
        *state["messages"],
    ]


chatbot = create_react_agent(
    model=llm,
    state_schema=ChatbotState,
    context_schema=ContextSchema,
    tools=[
        search_tool,
        search_for_places,
        plan_itinerary,
        recommend_hotels,
        recommend_hotels_multi,
    ],
    prompt=make_prompt,
    pre_model_hook=summarize_node,
    name="chatbot",
)
