from typing import Optional

from langgraph.graph import MessagesState

from agents.shared.models import ItineraryResponse, Plan


class AgentState(MessagesState):
    """The state of the agent"""

    plan: Optional[Plan]
    itinerary: Optional[ItineraryResponse]
    language: str
    summary: str


class AgentInput(MessagesState):
    pass
