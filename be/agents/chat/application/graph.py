from functools import lru_cache

from langgraph.graph import StateGraph, START, END
from langgraph.checkpoint.memory import MemorySaver
from langgraph.prebuilt import ToolNode, tools_condition

from agents.chat.application.state import AgentState, AgentInput
from agents.chat.application.chat.nodes import chat_node, summarize_node
from agents.chat.application.tools import search_tool, search_for_places


@lru_cache(maxsize=1)
def create_workflow():
    graph_buider = StateGraph(
        state_schema=AgentState,
        input_schema=AgentInput,
    )
    # Add all nodes
    graph_buider.add_node("summarize_node", summarize_node)
    graph_buider.add_node("chat_node", chat_node)
    graph_buider.add_node("tools", ToolNode([search_tool, search_for_places]))

    # Define the workflows
    graph_buider.add_edge(START, "summarize_node")
    graph_buider.add_edge("summarize_node", "chat_node")
    graph_buider.add_conditional_edges("chat_node", tools_condition, ["tools", END])
    graph_buider.add_edge("tools", "chat_node")

    return graph_buider


memory = MemorySaver()
graph = create_workflow().compile(checkpointer=memory)
