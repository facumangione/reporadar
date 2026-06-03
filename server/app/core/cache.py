import json
import redis.asyncio as aioredis
from app.core.config import settings

_redis = None


async def get_redis() -> aioredis.Redis:
    global _redis
    if _redis is None:
        try:
            _redis = await aioredis.from_url(
                settings.redis_url,
                encoding="utf-8",
                decode_responses=True,
            )
            await _redis.ping()
        except Exception:
            _redis = None
    return _redis


async def cache_get(key: str) -> dict | None:
    try:
        client = await get_redis()
        if client is None:
            return None
        value = await client.get(key)
        if value:
            return json.loads(value)
    except Exception:
        pass
    return None


async def cache_set(key: str, value: dict, ttl: int = None) -> None:
    try:
        client = await get_redis()
        if client is None:
            return
        await client.setex(
            key,
            ttl or settings.cache_ttl,
            json.dumps(value),
        )
    except Exception:
        pass
