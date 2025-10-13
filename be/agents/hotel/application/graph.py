from functools import lru_cache

from langgraph.graph import StateGraph, START, END
from langgraph.graph.state import CompiledStateGraph
from langgraph.prebuilt import ToolNode

from agents.hotel.application.state import HotelAgentState
from agents.hotel.application.nodes import (
    search_hotels_node,
    rank_hotels_node,
    transfer_node,
    multi_segment_hotels_node,
)
from agents.hotel.application.tools import transfer_to_chatbot
from agents.shared.runtime import ContextSchema


@lru_cache(maxsize=1)
def create_hotel_agent():
    graph_builder = StateGraph(
        state_schema=HotelAgentState,
        context_schema=ContextSchema,
    )

    graph_builder.add_node("search_hotels_node", search_hotels_node)  # type:ignore
    graph_builder.add_node("rank_hotels_node", rank_hotels_node)
    graph_builder.add_node("multi_segment_hotels_node", multi_segment_hotels_node)  # type:ignore
    graph_builder.add_node("transfer_node", transfer_node)
    graph_builder.add_node("tools", ToolNode([transfer_to_chatbot]))

    def route_entry(state: HotelAgentState):
        if state.get("multi_search_criteria"):
            return "multi_segment_hotels_node"
        return "search_hotels_node"

    graph_builder.add_conditional_edges(START, route_entry)
    graph_builder.add_edge("search_hotels_node", "rank_hotels_node")
    graph_builder.add_edge("rank_hotels_node", "transfer_node")
    graph_builder.add_edge("multi_segment_hotels_node", "transfer_node")
    graph_builder.add_edge("transfer_node", "tools")
    graph_builder.add_edge("tools", END)

    return graph_builder.compile(name="hotel_agent")


hotel_agent: CompiledStateGraph = create_hotel_agent()  # type:ignore
