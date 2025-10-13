from typing import Optional
from langgraph.managed.is_last_step import RemainingSteps
from langgraph.prebuilt.chat_agent_executor import AgentState

from agents.shared.models import (
    HotelSearchCriteria,
    HotelRecommendation,
    MultiHotelSearchCriteria,
    MultiHotelRecommendation,
)


class HotelAgentState(AgentState):
    search_criteria: Optional[HotelSearchCriteria]
    hotel_recommendation: Optional[HotelRecommendation]
    multi_search_criteria: Optional[MultiHotelSearchCriteria]
    multi_hotel_recommendation: Optional[MultiHotelRecommendation]
    language: str
    context: Optional[dict]
    remaining_steps: RemainingSteps
