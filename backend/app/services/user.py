from datetime import timedelta
from uuid import UUID

from passlib.context import CryptContext
from passlib.exc import PasswordValueError
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import app_settings
from app.core.exceptions import BadCredentials, BadPassword, ClientNotVerified, InvalidToken
from app.database.models import User
from app.utils import (
    decode_url_safe_token,
    generate_access_token,
    generate_url_safe_token,
)
from app.worker.tasks import send_email_with_template

from .base import BaseService

password_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
)


class UserService(BaseService):
    def __init__(self, model: User, session: AsyncSession):
        self.model = model
        self.session = session

    async def _add_user(self, data: dict, router_prefix: str) -> User:
        try:
            user = self.model(
                **data,
                password_hash=password_context.hash(data["password"]),
            )
        except PasswordValueError:
            raise BadPassword()
        # Add the user to database and get refreshed data
        user = await self._add(user)
        # Generate the token with user id
        token = generate_url_safe_token({
            # Email can be skipped as not used in our case
            # "email": user.email,
            "id": str(user.id)
        })
        # Send registration email with verification link
        send_email_with_template.delay(
            recipients=[user.email],
            subject="Verify Your Account With FastShip",
            context={
                "username": user.name,
                "verification_url": f"http://{app_settings.APP_DOMAIN}/{router_prefix}/verify?token={token}"
            },
            template_name="mail_email_verify.html",
        )
        
        return user
    
    async def verify_email(self, token: str):
        token_data = decode_url_safe_token(token)
        # Validate the token
        if not token_data:
            raise InvalidToken()
        # Update the verified field on the user
        # to mark user as verified
        user = await self._get(UUID(token_data["id"]))
        user.email_verified = True
        
        await self._update(user)

    async def _get_by_email(self, email) -> User | None:
        return await self.session.scalar(
            select(self.model).where(self.model.email == email)
        )

    async def _generate_token(self, email, password) -> str:
        # Validate the credentials
        user = await self._get_by_email(email)

        if user is None or not password_context.verify(
            password,
            user.password_hash,
        ):
            raise BadCredentials()
        
        if not user.email_verified:
            raise ClientNotVerified()

        return generate_access_token(
            data={
                "user": {
                    "name": user.name,
                    "id": str(user.id),
                },
            }
        )

    async def send_password_reset_link(self, email, router_prefix):
        user = await self._get_by_email(email)

        token = generate_url_safe_token({"id": str(user.id)}, salt="password-reset")

        send_email_with_template.delay(
            recipients=[user.email],
            subject="FastShip Account Password Reset",
            context={
                "username": user.name,
                "reset_url": f"http://{app_settings.APP_DOMAIN}{router_prefix}/reset_password_form?token={token}",
            },
            template_name="mail_password_reset.html",
        )

    async def reset_password(self, token: str, password: str) -> bool:
        token_data = decode_url_safe_token(
            token,
            salt="password-reset",
            expiry=timedelta(days=1),
        )

        if not token_data:
            return False

        user = await self._get(UUID(token_data["id"]))
        user.password_hash = password_context.hash(password)

        await self._update(user)

        return True