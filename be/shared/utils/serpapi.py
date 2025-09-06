import aiohttp
from typing import Any


class SerpAPI:
    """
    SerpAPI async http client
    """

    BASE_DOMAIN = "https://serpapi.com"
    BASE_URL = f"{BASE_DOMAIN}/search.json"

    aiosession: aiohttp.ClientSession | None = None
    api_key: str | None = None

    def __init__(self, api_key: str | None) -> None:
        self.aiosession = None
        self.api_key = api_key

    async def asearch(self, query: str, params: dict[str, Any]):
        params["api_key"] = self.api_key
        params["no_cache"] = "true"
        params["q"] = query

        if not params["api_key"]:
            raise ValueError("API key is required")

        if not params["q"]:
            raise ValueError("Query is required")

        if not self.aiosession:
            async with aiohttp.ClientSession() as session:
                async with session.get(self.BASE_URL, params=params) as response:
                    res = await response.json()
        else:
            async with self.aiosession.get(self.BASE_URL, params=params) as response:
                res = await response.json()

        return res
