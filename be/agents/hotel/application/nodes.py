import json
from typing import List
from langchain_core.output_parsers import JsonOutputParser
from langchain_core.runnables import RunnableConfig
from langchain_core.prompts import ChatPromptTemplate
from langgraph.config import get_stream_writer
from langgraph.runtime import Runtime
from langgraph.types import Command
from loguru import logger
from pydantic import BaseModel, Field

from agents.hotel.application.state import HotelAgentState
from agents.hotel.application.tools import transfer_to_chatbot
from agents.hotel.domain.prompt import (
    HOTEL_RECOMMENDATION_TEMPLATE,
    DESTINATION_SEARCH_PROMPT,
)
from agents.shared.infrastructure.llm import planning_llm, llm
from agents.shared.models import (
    HotelDetails,
    HotelRecommendation,
    HotelSearchCriteria,
    MultiHotelSearchCriteria,
    MultiHotelRecommendation,
    SegmentHotelRecommendation,
    DestinationInfo,
)
from agents.shared.runtime import ContextSchema


class DestinationQuery(BaseModel):
    destination: str = Field(description="Formatted destination name for Booking.com")


async def search_hotels_node(
    state: HotelAgentState,
    config: RunnableConfig,
    runtime: Runtime[ContextSchema],
) -> HotelAgentState:
    search_criteria = state["search_criteria"]
    booking_api = runtime.context.booking_api

    structured_llm = llm.with_structured_output(DestinationQuery)

    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", DESTINATION_SEARCH_PROMPT),
            ("human", "destination: {destination}; language: {language}"),
        ]
    ).partial(
        destination=search_criteria.destination,
        language=state["language"],
    )

    chain = prompt | structured_llm

    dest_query = await chain.ainvoke({}, config=config)

    try:
        destination_info = await booking_api.search_destination(
            query=dest_query.destination, language=state["language"]
        )

        hotels = await booking_api.search_hotels(
            dest_id=destination_info.destination_id,
            check_in=search_criteria.check_in.isoformat(),
            check_out=search_criteria.check_out.isoformat(),
            adults=search_criteria.adults,
            children=search_criteria.children,
            rooms=search_criteria.rooms,
            language=state["language"],
            currency=getattr(
                search_criteria.currency, "value", str(search_criteria.currency)
            ),
        )
        enriched_hotels = _enrich_distance_to_center(hotels, destination_info)

        return {
            "context": {"hotels": enriched_hotels, "destination_info": destination_info}
        }

    except Exception as e:
        logger.error(f"Error in search_hotels_node: {str(e)}")
        return {"context": {"hotels": [], "destination_info": None}}


async def rank_hotels_node(
    state: HotelAgentState,
    config: RunnableConfig,
) -> HotelAgentState:
    parser = JsonOutputParser(pydantic_object=HotelRecommendation)
    stream_writer = get_stream_writer()

    search_criteria = state.get("search_criteria")
    context = state.get("context") or {}
    hotels = context.get("hotels", [])

    if not hotels:
        empty_recommendation = HotelRecommendation(
            recommended_hotels=[],
            search_summary=f"No hotels found for {search_criteria.destination}",
            booking_tips="Try adjusting your search criteria or dates",
        )
        return {"hotel_recommendation": empty_recommendation}

    budget_info = _format_budget_info(search_criteria)
    amenities_str = (
        ", ".join(search_criteria.amenities)
        if search_criteria.amenities
        else "None specified"
    )
    max_distance = (
        f"{search_criteria.max_distance_to_center} km"
        if search_criteria.max_distance_to_center
        else "Not specified"
    )

    hotels_json = [
        {
            "hotel_id": h.hotel_id,
            "name": h.name,
            "type": h.property_type,
            "rating": h.rating,
            "review_count": h.review_count,
            "price_per_night": h.price_per_night,
            "currency": h.currency,
            "distance_to_center": h.distance_to_center,
            "amenities": h.amenities[:10],
        }
        for h in hotels
    ]

    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", HOTEL_RECOMMENDATION_TEMPLATE),
            (
                "human",
                "Recommend hotels for {destination} from {check_in} to {check_out}",
            ),
        ]
    ).partial(
        destination=search_criteria.destination,
        check_in=search_criteria.check_in.isoformat(),
        check_out=search_criteria.check_out.isoformat(),
        adults=search_criteria.adults,
        children=search_criteria.children,
        rooms=search_criteria.rooms,
        budget_info=budget_info,
        min_rating=search_criteria.min_rating or "Not specified",
        amenities=amenities_str,
        max_distance=max_distance,
        hotels=json.dumps(hotels_json, indent=2),
        language=state["language"],
        format_instructions=parser.get_format_instructions(),
    )
    # Log prompt
    # try:
    #     _rendered_msgs = prompt.format_messages(
    #         destination=search_criteria.destination,
    #         check_in=search_criteria.check_in.isoformat(),
    #         check_out=search_criteria.check_out.isoformat(),
    #     )
    #     _rendered_text = "\n\n".join(
    #         getattr(m, "content", str(m)) for m in _rendered_msgs
    #     )
    #     logger.info(f"Prompt hotel (rendered):\n{_rendered_text}")
    # except Exception:
    #     logger.info("Prompt hotel: (render preview failed; continuing)")

    chain = prompt | planning_llm | parser

    response = {}
    try:
        async for chunk in chain.astream({}, config=config):
            stream_writer(
                {
                    "data-hotel": {
                        "data": chunk,
                        "metadata": {"langgraph_node": "rank_hotels_node"},
                    }
                }
            )
            if isinstance(chunk, dict):
                response.update(chunk)
    except Exception as e:
        logger.error(
            f"rank_hotels_node streaming error: {str(e)} — falling back to non-streaming invoke"
        )
        try:
            response = await chain.ainvoke({}, config=config)
        except Exception as ee:
            logger.error(f"rank_hotels_node fallback invoke failed: {str(ee)}")
            empty_recommendation = HotelRecommendation(
                recommended_hotels=[],
                search_summary=f"Unable to rank hotels for {search_criteria.destination}",
                booking_tips="Please adjust your criteria and try again",
            )
            return {"hotel_recommendation": empty_recommendation}

    recommendation = HotelRecommendation(**response)
    return {"hotel_recommendation": recommendation}


async def transfer_node(
    state: HotelAgentState,
    config: RunnableConfig,
) -> HotelAgentState:
    llm_with_tools = llm.bind_tools(
        [transfer_to_chatbot], tool_choice="transfer_to_chatbot"
    )

    response = await llm_with_tools.ainvoke("Transfer to Chatbot", config=config)

    return {**state, "messages": [response]}


async def _rank_for_segment(
    hotels: list[HotelDetails],
    criteria: HotelSearchCriteria,
    language: str,
    config: RunnableConfig,
) -> HotelRecommendation:
    parser = JsonOutputParser(pydantic_object=HotelRecommendation)
    prompt = ChatPromptTemplate.from_messages(
        [
            ("system", HOTEL_RECOMMENDATION_TEMPLATE),
            (
                "human",
                "Rank candidate hotels for {destination} between {check_in} and {check_out}",
            ),
        ]
    ).partial(
        destination=criteria.destination,
        check_in=criteria.check_in.isoformat(),
        check_out=criteria.check_out.isoformat(),
        adults=criteria.adults,
        children=criteria.children,
        rooms=criteria.rooms,
        budget_info=_format_budget_info(criteria),
        min_rating=criteria.min_rating or "Not specified",
        amenities=", ".join(criteria.amenities)
        if criteria.amenities
        else "None specified",
        max_distance=f"{criteria.max_distance_to_center} km"
        if criteria.max_distance_to_center
        else "Not specified",
        hotels=json.dumps(
            [
                {
                    "hotel_id": h.hotel_id,
                    "name": h.name,
                    "type": h.property_type,
                    "rating": h.rating,
                    "review_count": h.review_count,
                    "price_per_night": h.price_per_night,
                    "currency": h.currency,
                    "distance_to_center": h.distance_to_center,
                    "amenities": h.amenities[:10],
                }
                for h in hotels
            ],
            indent=2,
        ),
        language=language,
        format_instructions=parser.get_format_instructions(),
    )
    chain = prompt | planning_llm | parser
    response = await chain.ainvoke({}, config=config)
    recommendation = HotelRecommendation(**response)
    return recommendation


async def multi_segment_hotels_node(
    state: HotelAgentState,
    config: RunnableConfig,
    runtime: Runtime[ContextSchema],
) -> HotelAgentState:
    multi: MultiHotelSearchCriteria = state["multi_search_criteria"]
    booking_api = runtime.context.booking_api
    language = state["language"]

    segment_results: list[SegmentHotelRecommendation] = []

    for criteria in multi.segments:
        structured_llm = llm.with_structured_output(DestinationQuery)
        prompt = ChatPromptTemplate.from_messages(
            [
                ("system", DESTINATION_SEARCH_PROMPT),
                ("human", "destination: {destination}; language: {language}"),
            ]
        ).partial(
            destination=criteria.destination,
            language=language,
        )
        dest = await (prompt | structured_llm).ainvoke({}, config=config)

        destination_info = await booking_api.search_destination(
            query=dest.destination,
            language=language,
        )

        hotels = []
        if destination_info:
            hotels = await booking_api.search_hotels(
                dest_id=destination_info.destination_id,
                check_in=criteria.check_in.isoformat(),
                check_out=criteria.check_out.isoformat(),
                adults=criteria.adults,
                children=criteria.children,
                rooms=criteria.rooms,
                language=language,
                currency=getattr(criteria.currency, "value", str(criteria.currency)),
            )
        enriched = (
            _enrich_distance_to_center(hotels, destination_info)
            if destination_info
            else hotels
        )
        recommendation = await _rank_for_segment(enriched, criteria, language, config)
        segment_results.append(
            SegmentHotelRecommendation(
                criteria=criteria,
                destination_info=destination_info,
                recommendation=recommendation,
            )
        )

    multi_result = MultiHotelRecommendation(
        segments=segment_results,
        summary=None,
    )

    return {"multi_hotel_recommendation": multi_result, "context": {"multi": True}}


def _format_budget_info(criteria: "HotelSearchCriteria") -> str:
    code = (
        getattr(criteria.currency, "value", str(criteria.currency))
        if getattr(criteria, "currency", None) is not None
        else "VND"
    )
    if criteria.min_price and criteria.max_price:
        return f"{criteria.min_price} - {criteria.max_price} {code} per night"
    elif criteria.min_price:
        return f"Minimum {criteria.min_price} {code} per night"
    elif criteria.max_price:
        return f"Maximum {criteria.max_price} {code} per night"
    else:
        return "No budget specified"


def _enrich_distance_to_center(
    hotels: List[HotelDetails], destination_info: DestinationInfo
) -> List[HotelDetails]:
    if not hotels or destination_info is None:
        return hotels
    dest_lat = destination_info.latitude
    dest_lng = destination_info.longitude
    enriched: List[HotelDetails] = []
    for h in hotels:
        if (
            h.distance_to_center is None
            and h.latitude is not None
            and h.longitude is not None
        ):
            d = _haversine_km(dest_lat, dest_lng, h.latitude, h.longitude)
            enriched.append(h.model_copy(update={"distance_to_center": d}))
        else:
            enriched.append(h)
    return enriched


def _haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    from math import radians, sin, cos, asin, sqrt

    rlat1, rlon1, rlat2, rlon2 = map(radians, [lat1, lon1, lat2, lon2])
    dlat = rlat2 - rlat1
    dlon = rlon2 - rlon1
    a = sin(dlat / 2) ** 2 + cos(rlat1) * cos(rlat2) * sin(dlon / 2) ** 2
    c = 2 * asin(sqrt(a))
    R = 6371.0
    return R * c
