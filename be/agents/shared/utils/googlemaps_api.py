from typing import List
import aiohttp
from typing import Optional
from loguru import logger


class GoogleMapsAPI:
    _api_key: Optional[str]
    _aiosession: Optional[aiohttp.ClientSession]

    def __init__(self, api_key: str | None) -> None:
        self._api_key = api_key
        self._aiosession = None

    def _init_session(self) -> aiohttp.ClientSession:
        if not self._aiosession:
            if self._api_key is None:
                raise ValueError("API key is required")

            logger.info("Initializing aiohttp session for Google Maps API")

            self._aiosession = aiohttp.ClientSession(
                headers={
                    "Content-Type": "application/json",
                    "X-Goog-Api-Key": self._api_key,
                },
                timeout=aiohttp.ClientTimeout(total=30),
            )

        return self._aiosession

    async def close(self) -> None:
        """Close the aiohttp session properly."""
        if self._aiosession:
            logger.info("Closing aiohttp session for Google Maps API")
            await self._aiosession.close()
            self._aiosession = None

    async def __aenter__(self):
        """Support async context manager."""
        self._init_session()
        return self

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """Support async context manager."""
        await self.close()

    async def search_attractions(
        self,
        text_query: str,
        language: str = "en",
        page_size: int = 20,
        region_code: str = "vn",
    ) -> List[dict]:
        if self._aiosession is None:
            self._aiosession = self._init_session()

        field_mask = "places.id,places.displayName,places.formattedAddress,places.rating,places.location,places.types,places.businessStatus"

        try:
            async with self._aiosession.post(
                url="https://places.googleapis.com/v1/places:searchText",
                json={
                    "textQuery": text_query,
                    "pageSize": page_size,
                    "languageCode": language,
                    "regionCode": region_code,
                },
                headers={"X-Goog-FieldMask": field_mask},
            ) as response:
                response.raise_for_status()
                data = await response.json()
                logger.debug(f"Data:\n{data}\n")

            attractions = []

            if "places" in data:
                for place in data["places"]:
                    attraction = {
                        "id": place.get("id"),
                        "name": place.get("displayName", {}).get("text", "Unknown"),
                        "address": place.get("formattedAddress", "N/A"),
                        "rating": place.get("rating", 0),
                        "latitude": place.get("location", {}).get("latitude"),
                        "longitude": place.get("location", {}).get("longitude"),
                        "types": place.get("types", []),
                        "status": place.get("businessStatus", "UNKNOWN"),
                    }
                    attractions.append(attraction)

            return attractions
        except aiohttp.ClientResponseError as e:
            logger.error(f"API error {e.status}: {e.message}")
            if e.status == 400:
                logger.error("Check your field mask and request parameters")
            return []
        except aiohttp.ClientError as e:
            logger.error(f"Network error: {str(e)}")
            return []
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return []

    async def search_restaurants(
        self,
        text_query: str,
        language: str = "en",
        page_size: int = 20,
        region_code: str = "vn",
    ) -> List[dict]:
        if self._aiosession is None:
            self._aiosession = self._init_session()

        field_mask = "places.id,places.displayName,places.formattedAddress,places.rating,places.location,places.types,places.businessStatus"

        try:
            async with self._aiosession.post(
                url="https://places.googleapis.com/v1/places:searchText",
                json={
                    "textQuery": text_query,
                    "pageSize": page_size,
                    "languageCode": language,
                    "regionCode": region_code,
                },
                headers={"X-Goog-FieldMask": field_mask},
            ) as response:
                response.raise_for_status()
                data = await response.json()
                logger.debug(f"Data:\n{data}\n")

            restaurants = []

            if "places" in data:
                for place in data["places"]:
                    # Prefer entries that look like restaurants by type, but still keep flexible
                    types = place.get("types", [])
                    is_restaurant_like = any(
                        t in types
                        for t in [
                            "restaurant",
                            "food",
                            "bakery",
                            "cafe",
                            "bar",
                        ]
                    )
                    restaurant = {
                        "id": place.get("id"),
                        "name": place.get("displayName", {}).get("text", "Unknown"),
                        "address": place.get("formattedAddress", "N/A"),
                        "rating": place.get("rating", 0),
                        "latitude": place.get("location", {}).get("latitude"),
                        "longitude": place.get("location", {}).get("longitude"),
                        "types": types,
                        "status": place.get("businessStatus", "UNKNOWN"),
                    }
                    # If types present and not restaurant-like, skip to keep results tighter
                    if types and not is_restaurant_like:
                        continue
                    restaurants.append(restaurant)

            return restaurants
        except aiohttp.ClientResponseError as e:
            logger.error(f"API error {e.status}: {e.message}")
            if e.status == 400:
                logger.error("Check your field mask and request parameters")
            return []
        except aiohttp.ClientError as e:
            logger.error(f"Network error: {str(e)}")
            return []
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return []
