from typing import Annotated, Literal
from langchain_core.messages import ToolMessage
from langchain_core.tools import InjectedToolCallId, tool
from langgraph.prebuilt import InjectedState
from langgraph.types import Command


@tool
def transfer_to_chatbot(
    state: Annotated[dict, InjectedState],
    tool_call_id: Annotated[str, InjectedToolCallId],
) -> Command[Literal["chatbot"]]:
    """Transfer the itinerary to Chatbot"""
    return Command(
        goto="chatbot",
        update={
            "itinerary": state["itinerary"],
            "messages": state["messages"]
            + [
                ToolMessage(
                    content="Transfer to Chatbot. Create itinerary successfully",
                    tool_call_id=tool_call_id,
                )
            ],
        },
        graph=Command.PARENT,
    )
