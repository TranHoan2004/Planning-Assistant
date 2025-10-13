from typing import Optional
from langgraph.managed.is_last_step import RemainingSteps

from langgraph_swarm import SwarmState

from agents.shared.models import (
    ItineraryResponse,
    Plan,
    HotelRecommendation,
    HotelSearchCriteria,
    MultiHotelSearchCriteria,
    MultiHotelRecommendation,
)


class AgentState(SwarmState):
    """The state of the agent"""

    plan: Optional[Plan]
    itinerary: Optional[ItineraryResponse]
    hotel_recommendation: Optional[HotelRecommendation]
    search_criteria: Optional[HotelSearchCriteria]
    multi_search_criteria: Optional[MultiHotelSearchCriteria]
    multi_hotel_recommendation: Optional[MultiHotelRecommendation]
    language: str
    summary: str
    remaining_steps: RemainingSteps
