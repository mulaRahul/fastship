from uuid import UUID
from redis.asyncio import Redis

from app.config import db_settings


_token_blacklist = Redis(
    host=db_settings.REDIS_HOST,
    port=db_settings.REDIS_PORT,
    db=0,
)
_shipment_verification_codes = Redis(
    host=db_settings.REDIS_HOST,
    port=db_settings.REDIS_PORT,
    db=1,
    decode_responses=True,
)

async def add_jti_to_blacklist(jti: str):
    await _token_blacklist.set(jti, "blacklisted")


async def is_jti_blacklisted(jti: str) -> bool:
    return await _token_blacklist.exists(jti)

async def add_shipment_verification_code(id: UUID, code: int):
    await _shipment_verification_codes.set(str(id), code)

async def get_shipment_verification_code(id: UUID) -> str:
    return str(await _shipment_verification_codes.get(str(id)))