from functools import lru_cache

from langgraph.graph import StateGraph, START, END
from langgraph.prebuilt import ToolNode, tools_condition

from agents.chat.domain.constraints import (
    CHAT_NODE,
    SUMMARIZE_NODE,
)
from agents.shared.state import AgentState
from agents.chat.application.nodes import chat_node, summarize_node
from agents.chat.application.tools import search_tool, search_for_places
from agents.chat.application.tools import plan_itinerary
from agents.plan.application.graph import plan_agent


@lru_cache(maxsize=1)
def chatbot_graph():
    graph_builder = StateGraph(
        state_schema=AgentState,
    )
    # Add all nodes
    graph_builder.add_node(SUMMARIZE_NODE, summarize_node)
    graph_builder.add_node(CHAT_NODE, chat_node)
    graph_builder.add_node(
        "tools", ToolNode([search_tool, search_for_places, plan_itinerary])
    )
    graph_builder.add_node("plan_agent", plan_agent)

    # Define the workflows
    graph_builder.add_edge(START, SUMMARIZE_NODE)
    graph_builder.add_edge(SUMMARIZE_NODE, CHAT_NODE)
    graph_builder.add_conditional_edges(CHAT_NODE, tools_condition, ["tools", END])
    graph_builder.add_edge("tools", CHAT_NODE)
    graph_builder.add_edge("plan_agent", END)

    return graph_builder


chatbot = chatbot_graph().compile()
