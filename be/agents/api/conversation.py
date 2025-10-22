from typing import Annotated
from fastapi import APIRouter, Depends, Request, HTTPException
from fastapi.responses import StreamingResponse
from loguru import logger
from pydantic import BaseModel, Field

from agents.aggregate.agent import Agent
from agents.api.common import PaginatedResponse, Pagination
from agents.api.response import AgentStreamingResponse
from agents.api.services.conversation_service import UserConversationService
from agents.chat.domain.entities import UserConversationResponse
from agents.shared.infrastructure.config.rate_limit import limiter
from agents.shared.runtime import ContextSchema

router = APIRouter(tags=["Conversation"], prefix="/v1/conversation")


class ConversationRequest(BaseModel):
    session_id: str = Field(description="Session ID")
    user_id: str = Field(description="Current user's ID")
    content: str


class GetConversationRequest(BaseModel):
    session_id: str = Field(description="Session ID")
    user_id: str = Field(description="Current user's ID")


class NewConversationRequest(BaseModel):
    user_id: str = Field(description="Current user's ID")


@router.post("/new", status_code=201)
@limiter.limit("10/minutes")
async def new_conversation(
    request: Request,
    new_conversation_req: NewConversationRequest,
    user_conversation_service: Annotated[
        UserConversationService, Depends(UserConversationService)
    ],
):
    logger.info(f"create new conversation for user: {new_conversation_req.user_id}")
    try:
        conversation = await user_conversation_service.create_new_conversation(
            new_conversation_req.user_id
        )
        return conversation
    except Exception as e:
        logger.error(f"Internal error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}") from e


@router.post("/response")
@limiter.limit("5/minutes")
async def response(
    request: Request,
    conversation_req: ConversationRequest,
    user_conversation_service: Annotated[
        UserConversationService, Depends(UserConversationService)
    ],
    agent: Annotated[Agent, Depends(Agent)],
):
    logger.info(
        f"current session: {conversation_req.session_id}, user_id: {conversation_req.user_id}"
    )
    context = ContextSchema(
        googlemaps_api=request.app.state.googlemaps_api,
        booking_api=request.app.state.booking_api,
    )

    try:
        user_conversation = await user_conversation_service.find_user_conversation(
            user_id=conversation_req.user_id,
            session_id=conversation_req.session_id,
        )
        if not user_conversation:
            await user_conversation_service.create_user_conversation(
                user_id=conversation_req.user_id,
                session_id=conversation_req.session_id,
            )

        result = await agent.response(
            session_id=conversation_req.session_id,
            user_id=conversation_req.user_id,
            content=conversation_req.content,
            context=context,
        )
        return result
    except Exception as e:
        logger.error(f"Internal error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}") from e


@router.post("/stream", response_class=StreamingResponse)
@limiter.limit("5/minutes")
async def stream(
    request: Request,
    conversation_req: ConversationRequest,
    user_conversation_service: Annotated[
        UserConversationService, Depends(UserConversationService)
    ],
    agent: Annotated[Agent, Depends(Agent)],
):
    logger.info(
        f"current session: {conversation_req.session_id}, user_id: {conversation_req.user_id}"
    )
    context = ContextSchema(
        googlemaps_api=request.app.state.googlemaps_api,
        booking_api=request.app.state.booking_api,
    )

    try:
        user_conversation = await user_conversation_service.find_user_conversation(
            user_id=conversation_req.user_id,
            session_id=conversation_req.session_id,
        )
        if not user_conversation:
            await user_conversation_service.create_user_conversation(
                user_id=conversation_req.user_id,
                session_id=conversation_req.session_id,
            )

        return AgentStreamingResponse(
            agent.stream_response(
                session_id=conversation_req.session_id,
                user_id=conversation_req.user_id,
                content=conversation_req.content,
                context=context,
            )
        )
    except Exception as e:
        logger.error(f"Internal error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}") from e


@router.get("/{session_id}")
@limiter.limit("30/minutes")
async def get_conversation(
    request: Request, session_id: str, agent: Annotated[Agent, Depends(Agent)]
):
    logger.info(f"get converstation for session: {session_id}")
    try:
        return await agent.get_conversation(session_id)
    except Exception as e:
        logger.error(f"Internal error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}") from e


@router.get(
    "/history/{user_id}", response_model=PaginatedResponse[UserConversationResponse]
)
@limiter.limit("30/minutes")
async def get_user_conversation_history(
    request: Request,
    user_id: str,
    pagination: Pagination,
    conversation_service: Annotated[
        UserConversationService, Depends(UserConversationService)
    ],
):
    logger.info(
        f"get conversation history. user_id: {user_id}, page: {pagination['page']}, limit: {pagination['limit']}",
        user_id=user_id,
        pagination=pagination,
    )
    try:
        return await conversation_service.list_user_conversation_history(
            user_id, pagination
        )
    except Exception as e:
        logger.error(f"Internal error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}") from e
