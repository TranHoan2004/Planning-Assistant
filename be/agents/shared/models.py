from enum import Enum
from typing import TypedDict, Optional, List
from pydantic import BaseModel, ConfigDict, Field, field_validator
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
    types: Optional[List[str]]
    status: Optional[str]


class Hotel(TypedDict):
    """A information about a hotel."""

    type: str
    name: str
    property_token: str
    source: str
    latitude: float
    longtitude: float
    hotel_class: int
    overall_rating: float
    reviews: int
    price: str
    amaneties: list[str]


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


class PlaceRecommendation(BaseModel):
    """A recommended attraction for a day"""

    place_id: str = Field(description="Place ID of the recommended place")
    reason: str = Field(description="Reason for recommendation")


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
    attraction_recommendations: List[PlaceRecommendation] = Field(
        description="Recommended attractions for this day"
    )
    restaurant_recommendations: List[PlaceRecommendation] = Field(
        description="Recommended restaurants for this day"
    )


class ItineraryResponse(BaseModel):
    """Full response with itinerary and notes"""

    trip_summary: TripSummary = Field(description="Overall summary of the trip")
    itinerary: List[ItineraryDay] = Field(description="Day-by-day itinerary")
    notes: Optional[str] = Field(
        description="Extra tips, cultural advice, or booking recommendations"
    )


class HotelSearchCriteria(BaseModel):
    """Search criteria for hotel recommendations"""

    destination: str = Field(description="Destination city or location name")
    check_in: date = Field(description="Check-in date")
    check_out: date = Field(description="Check-out date")
    adults: int = Field(default=2, description="Number of adults")
    children: int = Field(default=0, description="Number of children")
    rooms: int = Field(default=1, description="Number of rooms")
    min_price: Optional[float] = Field(
        default=None, description="Minimum price per night"
    )
    max_price: Optional[float] = Field(
        default=None, description="Maximum price per night"
    )
    min_rating: Optional[float] = Field(
        default=None, description="Minimum rating (0-10)"
    )
    amenities: Optional[List[str]] = Field(
        default=None, description="Required amenities"
    )
    max_distance_to_center: Optional[float] = Field(
        default=None, description="Maximum distance to city center in km"
    )
    currency: Currency = Field(
        default=Currency.VND, description="Currency code for prices"
    )


class HotelDetails(BaseModel):
    """Detailed information about a hotel"""

    hotel_id: str = Field(description="Unique hotel identifier")
    name: str = Field(description="Hotel name")
    property_type: str = Field(description="Type of property (hotel, apartment, etc)")
    rating: float = Field(description="Hotel rating (0-10)")
    review_score: Optional[float] = Field(default=None, description="Review score")
    review_count: int = Field(default=0, description="Number of reviews")
    price_per_night: float = Field(description="Price per night")
    currency: str = Field(description="Currency code")
    latitude: float = Field(description="Latitude coordinate")
    longitude: float = Field(description="Longitude coordinate")
    address: str = Field(description="Hotel address")
    amenities: List[str] = Field(
        default_factory=list, description="Available amenities"
    )
    photos: List[str] = Field(default_factory=list, description="Hotel photos URLs")
    distance_to_center: Optional[float] = Field(
        default=None, description="Distance to city center in km"
    )


class HotelPick(BaseModel):
    hotel_id: str = Field(description="Unique hotel identifier")
    reasoning: str = Field(description="Reason for recommending this hotel")


class HotelRecommendation(BaseModel):
    recommended_hotels: List[HotelPick] = Field(
        description="Top recommended hotels with brief reasoning"
    )
    search_summary: Optional[str] = Field(
        default=None, description="Summary of search criteria and results"
    )
    booking_tips: Optional[str] = Field(
        default=None, description="Tips for booking these hotels"
    )
    model_config = ConfigDict(extra="allow")


class DestinationInfo(BaseModel):
    """Information about a travel destination"""

    destination_id: str = Field(description="Booking.com destination ID")
    name: str = Field(description="Destination name")
    country: str = Field(description="Country name")
    latitude: float = Field(description="Latitude")
    longitude: float = Field(description="Longitude")


class MultiHotelSearchCriteria(BaseModel):
    """Multiple segments of hotel searches for a multi-destination trip"""

    segments: List[HotelSearchCriteria] = Field(
        min_length=1, description="List of segment-specific hotel search criteria"
    )


class SegmentHotelRecommendation(BaseModel):
    """Recommendation for a single segment with its criteria and destination info"""

    criteria: HotelSearchCriteria = Field(description="Segment search criteria")
    destination_info: Optional[DestinationInfo] = Field(
        default=None, description="Resolved destination information"
    )
    recommendation: HotelRecommendation = Field(
        description="Ranked hotel recommendations for this segment"
    )


class MultiHotelRecommendation(BaseModel):
    """Aggregated recommendations for multiple segments"""

    segments: List[SegmentHotelRecommendation] = Field(
        description="Per-segment hotel recommendations"
    )
    summary: Optional[str] = Field(
        default=None, description="High-level summary across all segments"
    )
