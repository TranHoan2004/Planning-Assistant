from psycopg_pool import AsyncConnectionPool
from loguru import logger
from typing import Optional
from agents.shared.infrastructure.config.settings import settings

connection_pool: Optional[AsyncConnectionPool] = None


async def init_connection_pool():
    """
    Initialize async connection pool for postgres
    """
    global connection_pool

    try:
        pool_size = settings.CONNECTION_POOL_SIZE

        connection_pool = AsyncConnectionPool(
            conninfo=f"postgres://{settings.POSTGRES_USER}:{settings.POSTGRES_PASSWORD}@{settings.POSTGRES_HOST}:{settings.POSTGRES_PORT}/{settings.POSTGRES_DB}",
            open=False,
            max_size=pool_size,
            kwargs={
                "autocommit": True,
                "connect_timeout": 5,
                "prepare_threshold": None,
            },
        )
        await connection_pool.open()
        logger.info(
            "Connection pool created, pool size: {pool_size}", pool_size=pool_size
        )
    except Exception as e:
        logger.error("Error creating connection pool {error}", error=str(e))
        raise e


async def close_pool():
    global connection_pool
    if connection_pool is not None:
        try:
            await connection_pool.close()
            logger.info("Connection pool closed")
        except Exception as e:
            logger.error("Error closing connection pool {error}", error=str(e))
            raise e


async def get_connection_pool():
    if connection_pool is None:
        await init_connection_pool()
    return connection_pool
