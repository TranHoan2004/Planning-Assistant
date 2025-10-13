from typing import List, Sequence

from langchain_core.messages import (
    BaseMessage,
    HumanMessage,
    AIMessage,
    RemoveMessage,
)
from langchain_core.runnables import RunnableConfig
from langgraph.graph.message import REMOVE_ALL_MESSAGES

from agents.chat.application.state import ChatbotState
from agents.shared.infrastructure.config.settings import settings


class SummarizeTool:
    """
    This class provide a tool for summarizing the conversation between human and chatbot
    """

    def __init__(self, llm) -> None:
        self._summarization_llm = llm.bind(max_tokens=settings.MAX_TOKENS_FOR_SUMMARY)

    def _extract_conversation_messages(
        self, messages: Sequence[BaseMessage]
    ) -> List[BaseMessage]:
        """
        Extract human and non-tool AI messages from the message list.

        Args:
            messages: List of messages to filter

        Returns:
            List of conversation messages (HumanMessage and content-only AIMessage)
        """
        conversation_messages = []

        for msg in messages:
            if isinstance(msg, HumanMessage):
                conversation_messages.append(msg)
            elif isinstance(msg, AIMessage) and not msg.tool_calls and msg.content:
                conversation_messages.append(msg)

        return conversation_messages

    def _should_summarize_conversation(
        self,
        state: ChatbotState,
        min_conversation_threshold: int = settings.MIN_CONVERSATION_THRESHOLD,
    ) -> bool:
        """
        Determine if conversation should be summarized based on message count threshold.

        Args:
            state: Current agent state containing messages
            min_conversation_threshold: Minimum number of conversation messages required

        Returns:
            True if conversation should be summarized, False otherwise
        """
        messages = state.get("messages")

        if not messages:
            return False

        conversation_messages = self._extract_conversation_messages(messages)
        return len(conversation_messages) >= min_conversation_threshold

    def _create_summary_prompt(self, existing_summary: str | None) -> str:
        """
        Create the appropriate summary prompt based on whether a summary already exists.

        Args:
            existing_summary: Existing summary content, if any

        Returns:
            Formatted prompt string for summarization
        """
        if existing_summary:
            return f"""
Expand the summary below by incorporating the above conversation while preserving context, key points and
user intent. Pay special attention to preserving:
- Trip planning details (destinations, dates, budget, departure location)
- User preferences and requirements
- Specific numbers, dates, and location names
- Any decisions or conclusions reached

Rework the summary if needed. Ensure that no critical information is lost and that the conversation
can continue naturally without gaps. For trip planning conversations, maintain all specific details
that would be needed to create a travel itinerary.

Only return the updated summary. DO NOT add explanations, section headers, or extra commentary.

Existing summary:
{existing_summary}
            """
        else:
            return """
            Summarize the above conversation while preserving full context, key points and user intent.
Pay special attention to preserving:
- Trip planning details (destinations, dates, budget, departure location)
- User preferences and requirements
- Specific numbers, dates, and location names
- Any decisions or conclusions reached

Your response should be detailed enough to ensure seamless continuation of discussions, especially
for trip planning conversations where specific details matter. For travel-related discussions,
maintain all information that would be needed to create a travel itinerary.

Only return the updated summary. DO NOT add explanations, section headers, or extra commentary.
            """

    async def summarize(self, state: ChatbotState, config: RunnableConfig):
        """Summarize the messages conversation between human and chatbot"""
        if not self._should_summarize_conversation(state):
            return {"messages": state["messages"]}

        existing_summary = state.get("summary")
        summary_prompt = self._create_summary_prompt(existing_summary)

        # Create summary message and get response
        sum_message = HumanMessage(content=summary_prompt)
        messages_for_summary = self._extract_conversation_messages(
            state["messages"]
        ) + [sum_message]

        response = await self._summarization_llm.ainvoke(
            messages_for_summary, config=config
        )

        # Create delete messages for all but the most recent N messages
        updated_messages = state["messages"][-settings.TOTAL_MESSAGES_AFTER_SUMMARY :]

        return {
            "summary": response.content,
            "messages": [RemoveMessage(id=REMOVE_ALL_MESSAGES), *updated_messages],
        }
