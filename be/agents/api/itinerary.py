from fastapi import APIRouter, HTTPException, Request
from loguru import logger
from pydantic import BaseModel, Field

from agents.shared.infrastructure.config.rate_limit import limiter
from agents.aggregate.agent import agent

router = APIRouter(tags=["Itinerary"])


class ApproveCreateRequest(BaseModel):
    session_id: str = Field(description="Session ID")
    user_id: str = Field(description="Current user's ID")
    approved: bool = Field(description="User approval")


# @router.post("/v1/completion/itinerary")
# @limiter.limit("5/minutes")
# async def generate_itinerary(
#     request: Request,
#     approve_create_req: ApproveCreateRequest,
# ):
#     logger.info(
#         f"current session: {approve_create_req.session_id}, user_id: {approve_create_req.user_id}, approved: {approve_create_req.approved}"
#     )

#     try:
#         result = await agent.resume(
#             approve_create_req.session_id,
#             approve_create_req.user_id,
#             approve_create_req.approved,
#         )
#         return result
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Internal error: {str(e)}") from e
