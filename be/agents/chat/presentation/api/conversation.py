import json
from uuid import uuid4

from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import StreamingResponse, JSONResponse
from loguru import logger
from pydantic import BaseModel, Field

from agents.chat.infrastructure.config.rate_limit import limiter

router = APIRouter(tags=["conversation"])


class ChatRequest(BaseModel):
    session_id: str | None = Field(default_factory=uuid4().__str__, description="Session ID")
    user_id: str = Field(description="Current user's ID")
    prompt: str = Field(description="User prompt")


# @router.post("/v1/conversation/chat")
# @limiter.limit("10/minutes")
# async def chat(request: Request, chat_body: ChatRequest):
#     logger.info(f"current session: {chat_body.session_id}, prompt: {chat_body.prompt}")
#     return await reply(
#         chat_body.prompt,
#         {"session_id": chat_body.session_id, "user_id": chat_body.user_id},
#     )


# @router.post("/v1/conversation/chat")
# async def reply(request: Request, chat_request: ChatRequest):
#     logger.info(f"current session: {chat_request.session_id}, prompt: {chat_request.prompt}")

#     try:
#         return response(
#             session_id=chat_request.session_id,
#             messages=chat_request.prompt,
#         )
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}") from e


# Response without streaming for fast api test
# @router.post("/chat")
# @limiter.limit("10/minutes")
# async def chat(request: Request, chat_body: ChatRequest):
#     logger.info(f"current session: {chat_body.session_id}, prompt: {chat_body.prompt}")
#     full_data = ""
#     async for item in reply(
#         chat_body.prompt,
#         {"session_id": chat_body.session_id, "user_id": chat_body.user_id},
#     ):
#         if isinstance(item, str) and item.strip().startswith("{"):
#             try:
#                 item = json.loads(item)
#                 full_data += item.get("data", "")
#             except Exception:
#                 continue
#     result = {
#         "data": full_data,
#         "session_id": chat_body.session_id,
#         "user_id": chat_body.user_id,
#     }
#     return JSONResponse(content=result)
