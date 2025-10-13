from functools import lru_cache

from langgraph.graph import StateGraph, START, END
from langgraph.graph.state import CompiledStateGraph
from langgraph.prebuilt import ToolNode
from agents.plan.application.nodes import (
    create_itinerary_node,
    get_attractions_node,
    get_restaurants_node,
    transfer_node,
)
from agents.plan.application.tools import transfer_to_chatbot
from agents.plan.domain.constraints import (
    CREATE_ITINERARY_NODE,
)
from agents.plan.application.state import PlanAgentState
from agents.shared.runtime import ContextSchema


@lru_cache(maxsize=1)
def plan_graph():
    graph_builder = StateGraph(
        state_schema=PlanAgentState,
        context_schema=ContextSchema,
    )

    graph_builder.add_node(CREATE_ITINERARY_NODE, create_itinerary_node)
    graph_builder.add_node("get_attractions_node", get_attractions_node)  # type:ignore
    graph_builder.add_node("get_restaurants_node", get_restaurants_node)  # type:ignore
    graph_builder.add_node("transfer_node", transfer_node)
    graph_builder.add_node("tools", ToolNode([transfer_to_chatbot]))

    graph_builder.add_edge(START, "get_attractions_node")
    graph_builder.add_edge("get_attractions_node", CREATE_ITINERARY_NODE)
    graph_builder.add_edge("get_restaurants_node", CREATE_ITINERARY_NODE)
    graph_builder.add_edge(CREATE_ITINERARY_NODE, "transfer_node")
    graph_builder.add_edge("transfer_node", "tools")
    graph_builder.add_edge("tools", END)

    return graph_builder


plan_agent: CompiledStateGraph = plan_graph().compile(name="plan_agent")  # type:ignore
