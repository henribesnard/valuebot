from fastapi import HTTPException, Request, status
from redis.asyncio import Redis

from app.config import settings

_redis: Redis | None = None


async def get_redis() -> Redis:
    global _redis
    if _redis is None:
        _redis = Redis.from_url(settings.redis_url, decode_responses=True)
    return _redis


async def check_rate_limit(
    request: Request, max_requests: int = 5, window_seconds: int = 60
) -> None:
    """Sliding window rate limiter using Redis."""
    client_ip = request.client.host if request.client else "unknown"
    key = f"rate_limit:auth:{client_ip}"

    redis = await get_redis()
    current = await redis.get(key)

    if current is not None and int(current) >= max_requests:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail="Trop de tentatives. Reessayez dans quelques minutes.",
            headers={"Retry-After": str(window_seconds)},
        )

    pipe = redis.pipeline()
    pipe.incr(key)
    pipe.expire(key, window_seconds)
    await pipe.execute()
