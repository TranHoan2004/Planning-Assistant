from enum import Enum
from typing_extensions import TypedDict, Optional, List, Annotated
from pydantic import BaseModel, Field, field_validator
from datetime import date


class Currency(Enum):
    VND = "VND"
    USD = "USD"


class TimeInterval(BaseModel):
    """Travel duration at the start and end of the trip"""

    from_date: date = Field(..., description="Start date in YYYY-MM-DD format")
    to_date: date = Field(..., description="End date in YYYY-MM-DD format")

    @field_validator("to_date")
    @classmethod
    def validate_date_order(cls, v, info):
        if "from_date" in info.data and v <= info.data["from_date"]:
            raise ValueError("End date must be after start date")
        return v


class Budget(BaseModel):
    """Budget range for the trip"""

    min_value: float = Field(description="Min value of budget")
    max_value: float = Field(description="Max value of budget")
    currency: Currency = Field(default=Currency.VND, description="Currency")


class Place(TypedDict):
    """A place which can be departure or destination."""

    id: str
    name: str
    address: str
    latitude: float
    longitude: float
    rating: float
    description: Optional[str]


class Plan(BaseModel):
    """A plan represent user travel trip plan"""

    time_interval: TimeInterval = Field(description="Travel date range")
    budget: Budget = Field(description="Budget details")
    destinations: List[str] = Field(
        min_length=1, description="List of destinations in the user plan"
    )
    departure: Optional[str] = Field(default=None)
    user_preferences: Optional[str] = Field(
        default=None, description="User preferences for the trip"
    )

    @field_validator("destinations")
    @classmethod
    def validate_destinations(cls, v):
        if not v or all(not dest.strip() for dest in v):
            raise ValueError("At least one valid destination is required")
        return [dest.strip() for dest in v if dest.strip()]


class EstimatedCost(BaseModel):
    """Estimated cost for a day or total budget"""

    min: float = Field(description="Minimum estimated cost")
    max: float = Field(description="Maximum estimated cost")
    currency: Currency = Field(description="Currency of the cost")


class TripSummary(BaseModel):
    """Summary of the entire trip"""

    total_days: int = Field(description="Number of travel days")
    destinations: List[str] = Field(description="List of destinations covered")
    estimated_total_budget: EstimatedCost = Field(
        description="Estimated budget for the whole trip"
    )


class ItineraryDay(BaseModel):
    """Details for one day in the trip"""

    date_: date = Field(description="Date for this day's activities")
    location: str = Field(description="City or destination for the day")
    morning: str = Field(description="Morning activity description")
    afternoon: str = Field(description="Afternoon activity description")
    evening: str = Field(description="Evening activity description")
    meals: List[str] = Field(description="Suggested local dishes or restaurants")
    transportation: str = Field(description="Transportation used during this day")
    estimated_cost: EstimatedCost = Field(description="Estimated cost for this day")


class ItineraryResponse(BaseModel):
    """Full response with itinerary and notes"""

    trip_summary: TripSummary = Field(description="Overall summary of the trip")
    itinerary: List[ItineraryDay] = Field(description="Day-by-day itinerary")
    notes: Optional[str] = Field(
        description="Extra tips, cultural advice, or booking recommendations"
    )
