import json
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.runnables import RunnableConfig
from langchain_core.prompts import ChatPromptTemplate
from langgraph.config import get_stream_writer
from langgraph.runtime import Runtime
from loguru import logger
from pydantic import BaseModel, Field

from agents.plan.application.tools import transfer_to_chatbot
from agents.shared.runtime import ContextSchema
from agents.shared.infrastructure.llm import planning_llm, llm
from agents.shared.models import ItineraryResponse, EstimatedCost
from agents.plan.domain.prompt import CREATE_ITINERARY_TEMPLATE
from agents.plan.application.state import PlanAgentState


class AttractionsSearchQuery(BaseModel):
    query: str = Field(description="The query to search for tourist attractions")


class RestaurantsSearchQuery(BaseModel):
    query: str = Field(description="The query to search for restaurants and local food")


async def create_itinerary_node(
    state: PlanAgentState, config: RunnableConfig
) -> PlanAgentState:
    """Create detailed itinerary based on plan."""
    context = state["context"]
    plan = state["plan"]
    if context is None or plan is None:
        logger.warning("create_itinerary_node: Missing context or plan in state")
        return {**state}
    parser = JsonOutputParser(pydantic_object=ItineraryResponse)
    stream_writer = get_stream_writer()

    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", CREATE_ITINERARY_TEMPLATE),
            ("human", "Plan: {plan}"),
        ]
    ).partial(
        language=state["language"],
        format_instructions=parser.get_format_instructions(),
        attractions=json.dumps(context.get("attractions", []), ensure_ascii=False),
        restaurants=json.dumps(context.get("restaurants", []), ensure_ascii=False),
    )
    chain = prompt | planning_llm | parser

    response = {}
    async for chunk in chain.astream(
        {
            "plan": plan.model_dump_json(),
        },
        config=config,
    ):
        stream_writer(
            {
                "data-itinerary": {
                    "data": chunk,
                    "metadata": {"langgraph_node": "create_itinerary_node"},
                }
            }
        )
        response.update(chunk)

    return {
        **state,
        "itinerary": ItineraryResponse(**response),
    }


async def get_attractions_node(
    state: PlanAgentState,
    config: RunnableConfig,
    runtime: Runtime[ContextSchema],
) -> PlanAgentState:
    plan = state["plan"]
    if plan is None:
        logger.warning("get_attractions_node: Missing plan in state")
        return {**state}
    destinations = plan.destinations
    googlemaps_api = runtime.context.googlemaps_api

    structured_llm = llm.with_structured_output(AttractionsSearchQuery)

    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                """You are a helpful assistant that generate the search text query for Google Maps new Places API.
You must generate the query to search for **Tourist attractions** in the destinations.
You must response in {language}
            """,
            ),
            ("human", "Destinations: {destinations}\nPreferences: {preferences}"),
        ]
    ).partial(
        language=state["language"],
        destinations=", ".join(destinations),
        preferences=plan.user_preferences,
    )

    chain = prompt | structured_llm

    response = await chain.ainvoke(
        {
            "destinations": destinations,
        },
        config=config,
    )

    try:
        attractions = await googlemaps_api.search_attractions(
            text_query=response.query,  # type: ignore
            language=state["language"],
            page_size=20,  # type: ignore
        )

        context = state.get("context") or {}
        context = {**context, "attractions": attractions}
        return {**state, "context": context}
    except Exception as e:
        logger.error(f"Error in get_attractions_node: {str(e)}")
        return {
            **state,
            "context": {"attractions": []},
        }


async def transfer_node(
    state: PlanAgentState, config: RunnableConfig
) -> PlanAgentState:
    llm_with_tools = llm.bind_tools(
        [transfer_to_chatbot], tool_choice="transfer_to_chatbot"
    )

    response = await llm_with_tools.ainvoke("Transfer to Chatbot", config=config)

    return {**state, "messages": [response]}


async def get_restaurants_node(
    state: PlanAgentState,
    config: RunnableConfig,
    runtime: Runtime[ContextSchema],
) -> PlanAgentState:
    plan = state["plan"]
    if plan is None:
        logger.warning("get_restaurants_node: Missing plan in state")
        return {**state}
    destinations = plan.destinations
    googlemaps_api = runtime.context.googlemaps_api

    structured_llm = llm.with_structured_output(RestaurantsSearchQuery)

    prompt = ChatPromptTemplate.from_messages(
        [
            (
                "system",
                """Generate a concise text query for Google Maps Places API to find restaurants and local food.
Emphasize options aligned with user preferences and budget level.
Prefer notable local cuisine and well-rated venues.
Respond in {language}.
                """,
            ),
            ("human", "Destinations: {destinations}\nPreferences: {preferences}"),
        ]
    ).partial(
        language=state["language"],
        destinations=", ".join(destinations),
        preferences=plan.user_preferences,
    )

    chain = prompt | structured_llm

    response = await chain.ainvoke(
        {
            "destinations": destinations,
        },
        config=config,
    )

    try:
        restaurants = await googlemaps_api.search_restaurants(
            text_query=response.query,  # type: ignore
            language=state["language"],
            page_size=20,
        )

        # Merge with existing context if present
        context = state.get("context") or {}
        context = {**context, "restaurants": restaurants}
        return {
            **state,
            "context": context,
        }
    except Exception as e:
        logger.error(f"Error in get_restaurants_node: {str(e)}")
        context = state.get("context") or {}
        context = {**context, "restaurants": []}
        return {
            **state,
            "context": context,
        }
