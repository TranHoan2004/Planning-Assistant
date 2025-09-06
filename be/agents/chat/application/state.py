from typing import Optional

from langgraph.graph import MessagesState

from shared.domain.models import Plan


class AgentState(MessagesState):
    """The state of the agent"""

    plan: Optional[Plan]
    summary: str


class AgentInput(MessagesState):
    pass
