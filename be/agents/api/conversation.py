from typing import Optional
from fastapi import APIRouter, Request, HTTPException
from loguru import logger
from pydantic import BaseModel, Field

from agents.aggregate.agent import agent
from agents.api.response import AgentStreamingResponse
from agents.shared.infrastructure.config.rate_limit import limiter

router = APIRouter(tags=["Conversation"])


class ConversationRequest(BaseModel):
    session_id: Optional[str] = Field(description="Session ID")
    user_id: str = Field(description="Current user's ID")
    content: str


class GetConversationRequest(BaseModel):
    session_id: Optional[str] = Field(description="Session ID")
    user_id: str = Field(description="Current user's ID")


@router.post("/v1/conversation/response")
@limiter.limit("5/minutes")
async def response(request: Request, conversation_req: ConversationRequest):
    logger.info(
        f"current session: {conversation_req.session_id}, user_id: {conversation_req.user_id}"
    )

    try:
        result = await agent.response(
            session_id=conversation_req.session_id,
            user_id=conversation_req.user_id,
            content=conversation_req.content,
        )
        return result
    except Exception as e:
        logger.error(f"Internal error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}") from e


@router.post("/v1/conversation/stream")
@limiter.limit("5/minutes")
async def reply(request: Request, conversation_req: ConversationRequest):
    logger.info(
        f"current session: {conversation_req.session_id}, user_id: {conversation_req.user_id}"
    )

    try:
        return AgentStreamingResponse(
            agent.stream_response(
                session_id=conversation_req.session_id,
                user_id=conversation_req.user_id,
                content=conversation_req.content,
            )
        )
    except Exception as e:
        logger.error(f"Internal error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}") from e


@router.get("/v1/conversation/{session_id}")
@limiter.limit("10/minutes")
async def get_conversation(request: Request, session_id: str):
    logger.info(f"get converstation for session: {session_id}")
    try:
        result = await agent.get_conversation(session_id)
        return result
    except Exception as e:
        logger.error(f"Internal error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}") from e
