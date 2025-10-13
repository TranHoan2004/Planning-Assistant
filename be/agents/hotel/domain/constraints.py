from datetime import date, timedelta
from typing import Optional
from pydantic import field_validator, model_validator

from agents.shared.models import HotelSearchCriteria


class ValidatedHotelSearchCriteria(HotelSearchCriteria):
    @field_validator("check_in")
    @classmethod
    def validate_check_in(cls, v: date) -> date:
        if v < date.today():
            raise ValueError("Check-in date cannot be in the past")
        return v

    @field_validator("check_out")
    @classmethod
    def validate_check_out(cls, v: date) -> date:
        if v < date.today():
            raise ValueError("Check-out date cannot be in the past")
        return v

    @model_validator(mode="after")
    def validate_date_range(self):
        if self.check_out <= self.check_in:
            raise ValueError("Check-out date must be after check-in date")

        nights = (self.check_out - self.check_in).days
        if nights > 30:
            raise ValueError("Maximum stay duration is 30 nights")

        return self

    @field_validator("adults")
    @classmethod
    def validate_adults(cls, v: int) -> int:
        if v < 1:
            raise ValueError("At least 1 adult is required")
        if v > 10:
            raise ValueError("Maximum 10 adults per search")
        return v

    @field_validator("children")
    @classmethod
    def validate_children(cls, v: int) -> int:
        if v < 0:
            raise ValueError("Children count cannot be negative")
        if v > 10:
            raise ValueError("Maximum 10 children per search")
        return v

    @field_validator("rooms")
    @classmethod
    def validate_rooms(cls, v: int) -> int:
        if v < 1:
            raise ValueError("At least 1 room is required")
        if v > 8:
            raise ValueError("Maximum 8 rooms per search")
        return v

    @field_validator("min_price")
    @classmethod
    def validate_min_price(cls, v: Optional[float]) -> Optional[float]:
        if v is not None and v < 0:
            raise ValueError("Minimum price cannot be negative")
        return v

    @field_validator("max_price")
    @classmethod
    def validate_max_price(cls, v: Optional[float]) -> Optional[float]:
        if v is not None and v < 0:
            raise ValueError("Maximum price cannot be negative")
        return v

    @model_validator(mode="after")
    def validate_price_range(self):
        if (
            self.min_price is not None
            and self.max_price is not None
            and self.max_price < self.min_price
        ):
            raise ValueError("Maximum price must be greater than minimum price")
        return self

    @field_validator("min_rating")
    @classmethod
    def validate_min_rating(cls, v: Optional[float]) -> Optional[float]:
        if v is not None and (v < 0 or v > 10):
            raise ValueError("Rating must be between 0 and 10")
        return v

    @field_validator("max_distance_to_center")
    @classmethod
    def validate_max_distance_to_center(cls, v: Optional[float]) -> Optional[float]:
        if v is not None and v < 0:
            raise ValueError("Distance to center cannot be negative")
        if v is not None and v > 50:
            raise ValueError("Distance to center should be within 50km")
        return v
