import asyncio

from loguru import logger
from shared.utils.serpapi import SerpAPI
from shared.domain.models import Place


class SearchPlacesTool:
    """This class provide search places functionality as a tool for LLM"""

    _serpapi: SerpAPI

    def __init__(self, api_key: str | None) -> None:
        self._serpapi = SerpAPI(api_key=api_key)

    async def search_for_places(
        self, queries: list[str], language: str, timeout_seconds: int = 30
    ) -> list[Place]:
        """
        Search for places based on queries, language, returns a list of places including their name, address, and coordinates.
        """
        if not queries:
            logger.warning("No queries provided")
            return []

        params = {
            "engine": "google_maps",
            "hl": language,
            "gl": "vn",
            "google_domain": "google.com.vn",
        }

        places: list[Place] = []
        tasks = []

        try:
            for _, query in enumerate(queries):
                task = asyncio.ensure_future(
                    self._serpapi.asearch(query=query, params=params)
                )
                tasks.append(task)

            try:
                responses = await asyncio.wait_for(
                    asyncio.gather(*tasks),
                    timeout=timeout_seconds,
                )
            except asyncio.TimeoutError:
                logger.error(f"Search Place timeout after {timeout_seconds} seconds")
                raise

            for response in responses:
                if response.get("local_results") is not None:
                    for data in response["local_results"]:
                        place: Place = {
                            "id": data["place_id"],
                            "name": data.get("title", ""),
                            "address": data.get("address", ""),
                            "description": data.get("description", ""),
                            "latitude": data["gps_coordinates"].get("latitude", 0),
                            "longitude": data["gps_coordinates"].get("longitude", 0),
                            "rating": data.get("rating", 0),
                        }
                        places.append(place)
                if response.get("place_results") is not None:
                    place: Place = {
                        "id": response["place_results"]["place_id"],
                        "name": response["place_results"].get("title", ""),
                        "address": response["place_results"].get("address", ""),
                        "description": response["place_results"].get("description", ""),
                        "latitude": response["place_results"]["gps_coordinates"].get(
                            "latitude", 0
                        ),
                        "longitude": response["place_results"]["gps_coordinates"].get(
                            "longitude", 0
                        ),
                        "rating": response["place_results"].get("rating", 0),
                    }
            return places
        except Exception as e:
            logger.error(f"Search Place error: {e}")
            raise
