import httpx
from typing import List, Optional, Dict, Any
from loguru import logger

from agents.shared.models import HotelDetails, DestinationInfo


class BookingComAPI:
    BASE_URL = "https://booking-com15.p.rapidapi.com/api/v1"

    def __init__(self, api_key: str):
        self.api_key = api_key
        self.headers = {
            "X-RapidAPI-Key": api_key,
            "X-RapidAPI-Host": "booking-com15.p.rapidapi.com",
        }

    async def search_destination(
        self, query: str, language: str = "en"
    ) -> Optional[DestinationInfo]:
        url = f"{self.BASE_URL}/hotels/searchDestination"
        params = {"query": query}

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    url, headers=self.headers, params=params, timeout=30.0
                )
                response.raise_for_status()
                data = response.json()

                if data.get("status") and data.get("data"):
                    destinations = data["data"]
                    if destinations:
                        dest = destinations[0]
                        return DestinationInfo(
                            destination_id=str(dest.get("dest_id", "")),
                            name=dest.get("name", query),
                            country=dest.get("country", ""),
                            latitude=float(dest.get("latitude", 0)),
                            longitude=float(dest.get("longitude", 0)),
                        )

                return None

        except Exception as e:
            logger.error(f"Error searching destination: {str(e)}")
            return None

    async def search_hotels(
        self,
        dest_id: str,
        check_in: str,
        check_out: str,
        adults: int = 2,
        children: int = 0,
        rooms: int = 1,
        language: str = "en",
        currency: str = "USD",
        page: int = 1,
    ) -> List[HotelDetails]:
        url = f"{self.BASE_URL}/hotels/searchHotels"

        params = {
            "dest_id": dest_id,
            "search_type": "CITY",
            "arrival_date": check_in,
            "departure_date": check_out,
            "adults": adults,
            "children_age": "0" if children > 0 else "",
            "room_qty": rooms,
            "page_number": page,
            "units": "metric",
            "temperature_unit": "c",
            "languagecode": language,
            "currency_code": currency,
        }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    url, headers=self.headers, params=params, timeout=30.0
                )
                response.raise_for_status()
                data = response.json()
                hotels = self._parse_hotels_response(data, currency)

            if not hotels and currency.upper() == "VND" and language != "vi":
                params["languagecode"] = "vi"
                async with httpx.AsyncClient() as client:
                    response = await client.get(
                        url, headers=self.headers, params=params, timeout=30.0
                    )
                    response.raise_for_status()
                    data = response.json()
                    hotels = self._parse_hotels_response(data, currency)

            return hotels

        except Exception as e:
            logger.error(f"Error searching hotels: {str(e)}")
            return []

    async def get_hotel_details(
        self,
        hotel_id: str,
        arrival_date: str,
        departure_date: str,
        language: str = "en",
    ) -> Optional[Dict[str, Any]]:
        url = f"{self.BASE_URL}/hotels/getHotelDetails"

        params = {
            "hotel_id": hotel_id,
            "arrival_date": arrival_date,
            "departure_date": departure_date,
            "languagecode": language,
        }

        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    url, headers=self.headers, params=params, timeout=30.0
                )
                response.raise_for_status()
                data = response.json()

                if data.get("status") and data.get("data"):
                    return data["data"]

                return None

        except Exception as e:
            logger.error(f"Error getting hotel details: {str(e)}")
            return None

    def _extract_amenities(self, property_data: Dict[str, Any]) -> List[str]:
        amenities = []

        facilities = property_data.get("facilities", [])
        for facility in facilities:
            if isinstance(facility, dict):
                amenities.append(facility.get("name", ""))
            elif isinstance(facility, str):
                amenities.append(facility)

        if property_data.get("hasPool"):
            amenities.append("Pool")
        if property_data.get("hasFreeWifi"):
            amenities.append("Free WiFi")
        if property_data.get("hasParking"):
            amenities.append("Parking")

        return [a for a in amenities if a]

    def _extract_photos(self, property_data: Dict[str, Any]) -> List[str]:
        photos = []
        photo_data = property_data.get("photoUrls", [])

        for photo in photo_data[:5]:
            if isinstance(photo, str):
                photos.append(photo)
            elif isinstance(photo, dict):
                photos.append(photo.get("url", ""))

        return [p for p in photos if p]

    def _extract_distance(self, property_data: Dict[str, Any]) -> Optional[float]:
        try:
            distance_str = property_data.get("distanceFromCenter", "")
            if isinstance(distance_str, str) and distance_str:
                number = distance_str.split()[0]
                return float(number)
            if isinstance(distance_str, (int, float)):
                return float(distance_str)
        except:
            pass
        return None

    def _parse_hotels_response(
        self, data: Dict[str, Any], currency: str
    ) -> List[HotelDetails]:
        hotels: List[HotelDetails] = []
        if data.get("status") and data.get("data"):
            hotel_data = data["data"]
            hotels_list = hotel_data.get("hotels", [])
            for hotel in hotels_list:
                try:
                    property_data = hotel.get("property", {})
                    price_info = property_data.get("priceBreakdown", {})
                    gross_price = price_info.get("grossPrice", {})
                    price = gross_price.get("value", 0)
                    hotel_obj = HotelDetails(
                        hotel_id=str(property_data.get("id", "")),
                        name=property_data.get("name", ""),
                        property_type=self._map_property_type(property_data),
                        rating=float(property_data.get("reviewScore", 0)),
                        review_score=float(property_data.get("reviewScore", 0)),
                        review_count=int(property_data.get("reviewCount", 0)),
                        price_per_night=float(price),
                        currency=gross_price.get("currency", currency),
                        latitude=float(property_data.get("latitude", 0)),
                        longitude=float(property_data.get("longitude", 0)),
                        address=self._extract_address(property_data),
                        amenities=self._extract_amenities(property_data),
                        photos=self._extract_photos(property_data),
                        distance_to_center=self._extract_distance(property_data),
                    )
                    hotels.append(hotel_obj)
                except Exception as e:
                    logger.warning(f"Error parsing hotel: {str(e)}")
                    continue
        return hotels

    def _map_property_type(self, property_data: Dict[str, Any]) -> str:
        code = property_data.get("propertyClass")
        type_code = property_data.get("propertyType")
        mapping = {
            0: "hotel",
            1: "apartment",
            2: "resort",
            3: "villa",
            4: "guest_house",
            5: "hostel",
        }
        if isinstance(type_code, int) and type_code in mapping:
            return mapping[type_code]
        if isinstance(code, int) and code in mapping:
            return mapping[code]
        if isinstance(type_code, str) and type_code:
            return type_code
        if isinstance(code, str) and code:
            return code
        return "hotel"

    def _extract_address(self, property_data: Dict[str, Any]) -> str:
        address = property_data.get("address")
        if isinstance(address, str) and address:
            return address
        return property_data.get("name", "")
