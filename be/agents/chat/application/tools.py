from langchain_tavily import TavilySearch
from langchain_core.tools import tool

from shared.domain.models import Place
from shared.tools.search_places import SearchPlacesTool
from agents.chat.infrastructure.config.config import settings


search_tool = TavilySearch(
    max_results=10,
    topic="general",
    tavily_api_key=settings.TAVILY_API_KEY,
)

search_places_tool = SearchPlacesTool(api_key=settings.SERPAPI_API_KEY)

@tool(parse_docstring=True)
async def search_for_places(queries: list[str], language: str = "en") -> list[Place]:
    """
    Search for places based on queries, language, returns a list of places including their name, address, and coordinates.

    Args:
        queries (list[str]): A list of queries to search for places.
        language (str, optional): The language to search in. Defaults to "en".

    Returns:
        list[Place]: A list of places.
    """

    return await search_places_tool.search_for_places(queries, language)
