from typing import Optional
from langgraph.prebuilt.chat_agent_executor import AgentState

from agents.shared.models import ItineraryResponse, Plan, HotelRecommendation


class ChatbotState(AgentState):
    plan: Optional[Plan]
    itinerary: Optional[ItineraryResponse]
    hotel_recommendation: Optional[HotelRecommendation]
    summary: str
    language: str
