from typing import Optional, Union
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
from agents.shared.data_stream import CustomDataStreamConfig, StreamResponse
from agents.shared.infrastructure.connection_pool import get_connection_pool
from agents.shared.runtime import ContextSchema
from agents.shared.state import AgentState


class Agent:
    def __init__(self) -> None:
        self._graph: Optional[CompiledStateGraph] = None
        self._connection_pool: Optional[AsyncConnectionPool] = None

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

        async for data_part in StreamResponse(
            iterator=self._graph.astream(
                input={"messages": [human_message]},
                stream_mode=["messages", "custom"],
                config={**config, "recursion_limit": 12},
                subgraphs=True,
                context=context,  # type:ignore
            ),
            messages_streamable_nodes=["agent"],
            custom_data_stream_config=[
                CustomDataStreamConfig(
                    key="data-itinerary",
                    node_name="create_itinerary_node",
                    data_type="itinerary",
                ),
                CustomDataStreamConfig(
                    key="data-hotel",
                    node_name="rank_hotels_node",
                    data_type="hotel",
                ),
            ],
        ):
            yield data_part

    async def stream_response(
        self, session_id: str, user_id: str, content: str, context: ContextSchema
    ):
        """Stream response from agent compatible with Vercel AI SDK protocol"""
        if self._graph is None:
            self._graph = await self._create_workflow_graph()

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
