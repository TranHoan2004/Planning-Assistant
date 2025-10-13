from dataclasses import dataclass

from agents.shared.utils.googlemaps_api import GoogleMapsAPI
from agents.shared.utils.bookingcom_api import BookingComAPI


@dataclass
class ContextSchema:
    googlemaps_api: GoogleMapsAPI
    booking_api: BookingComAPI
