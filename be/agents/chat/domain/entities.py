from datetime import datetime
from pydantic import field_validator
from sqlmodel import Field, SQLModel


class BaseUserConversation(SQLModel):
    session_id: str = Field(primary_key=True)
    created_at: datetime = Field(default=datetime.now())


class UserConversation(BaseUserConversation, table=True):
    __tablename__: str = "user_conversations"
    user_id: int = Field(primary_key=True)


class UserConversationResponse(BaseUserConversation):
    user_id: str

    @field_validator("user_id", mode="before")
    @classmethod
    def convert_user_id(cls, v) -> str:
        return str(v)
