from datetime import date
from typing import Optional, TypedDict
from pydantic import BaseModel, Field


class TimeInterval(BaseModel):
    from_date: str = Field(..., description="Start date in YYYY-MM-DD format")
    to_date: str = Field(..., description="End date in YYYY-MM-DD format")


class Budget(BaseModel):
    value: float = Field(..., description="Budget amount")
    currency: str = Field(default="VND", description="Currency only using VND")


class TravelInput(BaseModel):
    destination: str = Field(..., description="Travel destination")
    time_interval: TimeInterval = Field(..., description="Travel date range")
    budget: Budget = Field(..., description="Budget details")
    preferences: str = Field(..., description="User preferences for the trip")
    faq_response: str = Field(
        default="", description="Response for FAQ questions, if applicable"
    )
    missing_fields: list[str] = Field(
        default_factory=list, description="List of missing required fields"
    )


class TravelState(TypedDict, total=False):
    user_input: str  # The raw input prompt from the user
    travel_input: Optional[
        TravelInput
    ]  # Parsed travel plan, including destination, dates, budget, etc.
    error: Optional[str]  # Error message, if any occurred during processing
    session_id: Optional[str]  # Session ID to track the conversation context
