from redis.asyncio import Redis
from langgraph.checkpoint.redis.aio import AsyncRedisSaver

from agents.chat.infrastructure.config.config import settings


redis_client = Redis(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    db=settings.REDIS_DB,
)

ttl_config = {
    "default_ttl": 60,
    "refresh_on_read": True,
}


async def redis_saver_setup():
    redis_saver = AsyncRedisSaver(redis_client=redis_client, ttl=ttl_config)
    await redis_saver.asetup()
    return redis_saver
