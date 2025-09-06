from typing import TypedDict, Optional, List
from pydantic import BaseModel, Field

from agents.chat.domain.value_object import TimeInterval, Budget


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

    time_interval: TimeInterval
    budget: Budget
    destination: List[str] = Field(description="List of destinations in the user plan")
    departure: Optional[str] = Field(default=None)
