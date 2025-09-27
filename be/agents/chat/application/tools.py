from typing import Literal
from typing_extensions import Annotated

from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import SystemMessage
from langchain_core.prompts import MessagesPlaceholder
from langgraph.prebuilt import InjectedState
from langchain_core.output_parsers import PydanticOutputParser
from langchain_tavily import TavilySearch
from langchain_core.tools import tool, InjectedToolCallId
from langgraph.types import Command
from langchain_core.messages import ToolMessage
from langgraph.prebuilt import interrupt

from agents.shared.tools.search_places import SearchPlacesTool
from agents.shared.infrastructure.config.settings import settings
from agents.shared.infrastructure.llm import llm
from agents.shared.models import Place, Plan


search_tool = TavilySearch(
    max_results=5,
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


@tool
async def plan_itinerary(
    language: str,
    state: Annotated[dict, InjectedState],
    tool_call_id: Annotated[str, InjectedToolCallId],
    approval: bool = False,
) -> Command[Literal["plan_agent", "chat_node"]]:
    """
    Extract the plan details from summary and messages then transfer to Plan Agent to create an itinerary.
    """
    parser = PydanticOutputParser(pydantic_object=Plan)

    system_prompt = """Extract a travel plan from the user's conversation.
**PAY ATTENTION** to budget range and user preferences.
Return ONLY valid JSON in `json` tags\n{format_instructions}
\n**DO NOT** add any explanation or additional text.
\nResponse in {language} language."""
    system_prompt = system_prompt.format(
        format_instructions=parser.get_format_instructions(), language=language
    )

    summary = "Summary of the conversation so far (if any):\n{summary}".format(
        summary=state.get("summary", "")
    )

    prompt = ChatPromptTemplate.from_messages(
        [
            SystemMessage(content=summary),
            SystemMessage(content=system_prompt),
            MessagesPlaceholder(variable_name="messages"),
        ]
    )

    chain = prompt | llm | parser

    plan: Plan = await chain.ainvoke({"messages": state["messages"]})

    return Command(
        goto="plan_agent",
        update={
            "plan": plan,
            "language": language,
            "messages": [
                ToolMessage(content="Transfer to Plan Agent", tool_call_id=tool_call_id)
            ],
        },
    )
