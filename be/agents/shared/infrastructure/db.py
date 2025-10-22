from sqlmodel import SQLModel
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.ext.asyncio import create_async_engine
from agents.shared.infrastructure.config import settings

engine = create_async_engine(
    url=f"postgresql+psycopg://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_HOST}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DB}",
    echo=settings.ENVIRONMENT == "dev",
    future=True,
)


async def get_session():
    async with AsyncSession(engine) as session:
        yield session


async def init_db():
    async with engine.begin() as conn:
        from agents.chat.domain.entities import UserConversation

        await conn.run_sync(SQLModel.metadata.create_all)
