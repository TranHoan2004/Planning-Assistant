from typing import Optional, Union
from uuid import uuid4
from enum import Enum

from langgraph.graph.state import CompiledStateGraph
from loguru import logger
from langchain_core.runnables import RunnableConfig
from langchain_core.messages import AIMessage, HumanMessage
from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver
from langgraph.types import Command
from psycopg_pool import AsyncConnectionPool
from langgraph.checkpoint.memory import MemorySaver
from langgraph_swarm import create_swarm

from agents.chat.application.graph import chatbot
from agents.plan.application.graph import plan_agent
from agents.hotel.application.graph import create_hotel_agent
from agents.shared.data_stream.stream_parts import (
    DataStreamFinishPart,
    DataStreamInterruptPart,
    DataStreamStartStepPart,
    DataStreamFinishStepPart,
    DataStreamMessageStartPart,
    DataStreamTextDeltaPart,
    DataStreamTextEndPart,
    DataStreamTextStartPart,
    DataStreamDataPart,
)
from agents.shared.infrastructure.connection_pool import get_connection_pool
from agents.shared.runtime import ContextSchema
from agents.shared.state import AgentState


class StreamStatus(Enum):
    INIT = "init"
    RUNNING = "running"
    FINISHED = "finished"
    INTERRUPTED = "interrupted"


class Agent:
    def __init__(self) -> None:
        self._graph: Optional[CompiledStateGraph] = None
        self._connection_pool: Optional[AsyncConnectionPool] = None
        self._status: StreamStatus = StreamStatus.INIT

    async def _get_connection_pool(self) -> AsyncConnectionPool:
        if self._connection_pool is None:
            self._connection_pool = await get_connection_pool()
        return self._connection_pool

    async def _create_workflow_graph(self) -> CompiledStateGraph:
        if self._graph is None:
            hotel_agent = create_hotel_agent()

            graph_builder = create_swarm(
                agents=[chatbot, plan_agent, hotel_agent],  # type: ignore
                default_active_agent="chatbot",
                context_schema=ContextSchema,
                state_schema=AgentState,
            )

            try:
                connection_pool = await self._get_connection_pool()
                if connection_pool:
                    checkpointer = AsyncPostgresSaver(connection_pool)  # type: ignore
                    await checkpointer.setup()
                else:
                    checkpointer = None
                # checkpointer = MemorySaver()
                self._graph = graph_builder.compile(checkpointer=checkpointer)
            except Exception as e:
                logger.error("Error creating checkpointer", error=str(e))
                raise e
        return self._graph

    async def _async_stream(
        self,
        human_message: HumanMessage,
        config: RunnableConfig,
        context: ContextSchema,
    ):
        if self._graph is None:
            self._graph = await self._create_workflow_graph()

        message_id = f"{uuid4().hex}"
        text_id = f"msg_{message_id}"
        text_started = False

        if self._status == StreamStatus.INIT:
            self._status = StreamStatus.RUNNING
            yield DataStreamMessageStartPart(message_id).format()

        async for chunk in self._graph.astream(
            input={"messages": [human_message]},
            stream_mode=["messages", "custom"],
            config={**config, "recursion_limit": 12},
            subgraphs=True,
            context=context,  # type:ignore
        ):
            _, stream_mode, step = chunk
            if stream_mode == "messages" and isinstance(step, tuple) and len(step) == 2:
                message, metadata = step
                if metadata.get("langgraph_node") == "agent":
                    if hasattr(message, "content") and message.content:
                        if not text_started:
                            yield DataStreamTextStartPart(text_id).format()
                            text_started = True
                        yield DataStreamTextDeltaPart(text_id, message.content).format()

            # if stream_mode == "updates":
            #     logger.debug(f"updates: {step}")
            #     if isinstance(step, dict) and step.get("__interrupt__"):
            #         self._status = StreamStatus.INTERRUPTED
            #         yield DataStreamInterruptPart({"message": "Do you want to create a detailed itinerary?"}).format()

            if stream_mode == "custom":
                # Forward custom data emitted by get_stream_writer() from nodes
                if isinstance(step, dict):
                    payload = step.get("data-itinerary")
                    if payload:
                        data = payload.get("data")
                        metadata = payload.get("metadata", {})
                        if metadata.get("langgraph_node") == "create_itinerary_node":
                            # Emit itinerary data chunks to the client
                            yield DataStreamDataPart("itinerary", data).format()

                    hotel_payload = step.get("data-hotel")
                    if hotel_payload:
                        data = hotel_payload.get("data")
                        metadata = hotel_payload.get("metadata", {})
                        if metadata.get("langgraph_node") == "rank_hotels_node":
                            yield DataStreamDataPart("hotel", data).format()

        if self._status == StreamStatus.RUNNING:
            if text_started:
                yield DataStreamTextEndPart(text_id).format()
            self._status = StreamStatus.FINISHED

        if self._status != StreamStatus.INTERRUPTED:
            yield DataStreamFinishPart().format()

    async def stream_response(
        self, session_id: str, user_id: str, content: str, context: ContextSchema
    ):
        """Stream response from agent compatible with Vercel AI SDK protocol"""
        if self._graph is None:
            self._graph = await self._create_workflow_graph()

        # Reset stream status for each new streaming request
        self._status = StreamStatus.INIT

        config: RunnableConfig = {
            "configurable": {
                "thread_id": session_id,
                "user_id": user_id,
            },
        }

        message = HumanMessage(content=content)
        try:
            async for msg in self._async_stream(message, config, context):
                yield msg

            yield "data: [DONE]\n\n"
        except Exception as e:
            logger.error(f"Error streaming response: {str(e)}")

    async def resume(self, session_id: str, user_id: str, approved: bool):
        if self._graph is None:
            self._graph = await self._create_workflow_graph()

        config: RunnableConfig = {
            "configurable": {
                "thread_id": session_id,
                "user_id": user_id,
            },
        }

        try:
            response = await self._graph.ainvoke(
                Command(resume={"action": "create_itinerary", "approved": approved}),
                config={**config, "recursion_limit": 12},
            )
            return response
        except Exception as e:
            logger.error(f"Error getting response: {str(e)}")
            raise RuntimeError(f"Error getting response: {str(e)}") from e

    async def response(
        self,
        session_id: str,
        user_id: str,
        content: str,
        context: ContextSchema,
    ):
        if self._graph is None:
            self._graph = await self._create_workflow_graph()

        config: RunnableConfig = {
            "configurable": {
                "thread_id": session_id,
                "user_id": user_id,
            },
        }

        try:
            result = await self._graph.ainvoke(
                {"messages": [HumanMessage(content=content)]},
                config={**config, "recursion_limit": 12},
                subgraphs=True,
                context=context,  # type:ignore
            )
            return result
        except Exception as e:
            logger.error(f"Error getting response: {str(e)}")
            raise RuntimeError(f"Error getting response: {str(e)}") from e

    async def get_conversation(self, session_id: str):
        if self._graph is None:
            self._graph = await self._create_workflow_graph()

        config: RunnableConfig = {
            "configurable": {
                "thread_id": session_id,
            },
        }

        final_msg = []
        try:
            result = await self._graph.aget_state(config=config)
            for msg in result.values.get("messages", []):
                converted_msg = self._convert_to_ui_message(msg)
                if converted_msg:
                    final_msg.append(converted_msg)
            itinerary = result.values.get("itinerary")
            hotel_recommendation = result.values.get("hotel_recommendation")
            return {
                "messages": final_msg,
                "itinerary": itinerary,
                "hotel_recommendation": hotel_recommendation,
            }
        except Exception as e:
            logger.error(f"Error getting response: {str(e)}")
            raise RuntimeError(f"Error getting response: {str(e)}") from e

    def _convert_to_ui_message(
        self, msg: Union[HumanMessage, AIMessage]
    ) -> Optional[dict]:
        if isinstance(msg, HumanMessage):
            return {
                "id": msg.id,
                "role": "user",
                "parts": [{"type": "text", "text": msg.content}],
            }
        elif isinstance(msg, AIMessage):
            if msg.content and len(msg.tool_calls) == 0:
                return {
                    "id": msg.id,
                    "role": "assistant",
                    "parts": [{"type": "text", "text": msg.content}],
                }

        return None
