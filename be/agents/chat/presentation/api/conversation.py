import json
from uuid import uuid4

from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import StreamingResponse, JSONResponse
from loguru import logger
from pydantic import BaseModel, Field

from infrastructure.config.rate_limit import limiter
from application.chatbot import reply

router = APIRouter(tags=["conversation"], prefix="/v1/conversation")


class ChatRequest(BaseModel):
    session_id: str = str(uuid4())
    user_id: str
    prompt: str


@router.post("/chat")
@limiter.limit("10/minutes")
async def chat(request: Request, chat_body: ChatRequest):
    logger.info(f"current session: {chat_body.session_id}, prompt: {chat_body.prompt}")
    return await reply(
        chat_body.prompt,
        {"session_id": chat_body.session_id, "user_id": chat_body.user_id},
    )


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
