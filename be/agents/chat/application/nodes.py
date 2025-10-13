from langchain_core.runnables import RunnableConfig
from agents.chat.application.state import ChatbotState
from agents.shared.infrastructure.llm import llm
from agents.chat.application.summarize import SummarizeTool


async def summarize_node(state: ChatbotState, config: RunnableConfig):
    """Handles summarizing the message conversation."""
    summarize_tool = SummarizeTool(llm)

    return await summarize_tool.summarize(state, config)
