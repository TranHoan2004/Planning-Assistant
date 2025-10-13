from typing import Annotated, Any, Optional, Dict, Sequence
import uuid
from fastapi import Depends
from loguru import logger
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select

from agents.chat.domain.entities import UserConversation
from agents.shared.infrastructure.db import get_session


class UserConversationService:
    def __init__(self, db_session: Annotated[AsyncSession, Depends(get_session)]):
        self._db_session = db_session

    async def find_user_conversation(
        self,
        user_id: str,
        session_id: str,
    ) -> Optional[UserConversation]:
        try:
            statement = select(UserConversation).where(
                UserConversation.user_id == int(user_id),
                UserConversation.session_id == session_id,
            )
            result = await self._db_session.exec(statement)
            return result.first()
        except Exception as e:
            logger.error(
                f"Error getting conversation by session id: {session_id}, user id: {user_id}"
            )
            raise RuntimeError(
                f"Error getting conversation by session id: {session_id}, user id: {user_id}"
            ) from e

    async def list_user_conversation_history(
        self,
        user_id: str,
        pagination: Dict[str, Any],
    ) -> Sequence[UserConversation]:
        logger.info(f"get converstation history for user: {user_id}")
        try:
            statement = (
                select(UserConversation)
                .where(UserConversation.user_id == int(user_id))
                .offset(pagination["offset"])
                .limit(pagination["limit"])
            )
            result = await self._db_session.exec(statement)
            return result.all()
        except Exception as e:
            logger.error(f"Error getting conversation history for user: {user_id}")
            raise RuntimeError(
                f"Error getting conversation history for user: {user_id}"
            ) from e

    async def create_user_conversation(
        self,
        user_id: str,
        session_id: str,
    ) -> UserConversation:
        try:
            user_conversation = UserConversation(
                user_id=int(user_id),
                session_id=session_id,
            )
            self._db_session.add(user_conversation)
            await self._db_session.commit()
            await self._db_session.refresh(user_conversation)
            return user_conversation
        except Exception as e:
            logger.error(f"Error creating conversation for user: {user_id}")
            raise RuntimeError(
                f"Error creating conversation for user: {user_id}"
            ) from e

    async def create_new_conversation(
        self,
        user_id: str,
    ) -> UserConversation:
        session_id = uuid.uuid4()

        return await self.create_user_conversation(user_id, str(session_id))
