from functools import lru_cache

from langgraph.graph import StateGraph
from agents.plan.application.nodes import (
    create_itinerary_node,
)
from agents.shared.state import AgentState
from agents.plan.domain.constraints import (
    CREATE_ITINERARY_NODE,
)


@lru_cache(maxsize=1)
def plan_graph():
    graph_builder = StateGraph(state_schema=AgentState)

    graph_builder.add_node(CREATE_ITINERARY_NODE, create_itinerary_node)

    graph_builder.set_entry_point(CREATE_ITINERARY_NODE)
    graph_builder.set_finish_point(CREATE_ITINERARY_NODE)

    return graph_builder


plan_agent = plan_graph().compile()
