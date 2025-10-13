from typing import Any, Dict, Optional

from langgraph.managed.is_last_step import RemainingSteps
from langgraph.prebuilt.chat_agent_executor import AgentState

from agents.shared.models import Plan, ItineraryResponse


class PlanAgentState(AgentState):
    plan: Optional[Plan]
    itinerary: Optional[ItineraryResponse]
    language: str
    context: Optional[Dict[str, Any]]
    remaining_steps: RemainingSteps
