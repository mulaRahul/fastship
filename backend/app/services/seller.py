from sqlalchemy.ext.asyncio import AsyncSession

from app.api.schemas.seller import SellerCreate
from app.database.models import Seller

from .user import UserService


class SellerService(UserService):
    def __init__(self, session: AsyncSession):
        super().__init__(Seller, session)

    async def add(self, seller_create: SellerCreate) -> Seller:
        return await self._add_user(
            seller_create.model_dump(),
            "seller"
        )

    async def token(self, email, password) -> str:
        return await self._generate_token(email, password)
