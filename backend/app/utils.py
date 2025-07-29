from datetime import datetime, timedelta, timezone
from json import JSONDecodeError, dumps
from pathlib import Path
from typing import Any, Mapping
from uuid import uuid4

import jwt
from itsdangerous import BadSignature, SignatureExpired, URLSafeTimedSerializer

from app.config import security_settings

_serializer = URLSafeTimedSerializer(security_settings.JWT_SECRET)

APP_DIR = Path(__file__).resolve().parent
TEMPLATE_DIR = APP_DIR / "templates"


def generate_access_token(
    data: dict,
    expiry: timedelta = timedelta(days=7),
) -> str:
    return jwt.encode(
        payload={
            **data,
            "jti": str(uuid4()),
            "exp": datetime.now(timezone.utc) + expiry,
        },
        algorithm=security_settings.JWT_ALGORITHM,
        key=security_settings.JWT_SECRET,
    )


def decode_access_token(token: str) -> dict | None:
    try:
        return jwt.decode(
            jwt=token,
            key=security_settings.JWT_SECRET,
            algorithms=[security_settings.JWT_ALGORITHM],
        )
    except jwt.PyJWTError:
        return None


def generate_url_safe_token(data: dict, salt: str | None = None) -> str:
    return _serializer.dumps(data, salt=salt)


def decode_url_safe_token(
    token: str,
    salt: str | None = None,
    expiry: timedelta | None = None,
) -> dict | None:
    try:
        return _serializer.loads(
            token,
            salt=salt,
            max_age=expiry.total_seconds() if expiry else None,
        )
    except (BadSignature, SignatureExpired):
        return None


def print_label(data: Any, title: str | None = None):

    from rich import print
    from rich.panel import Panel

    try:
        data = dumps(data, indent=4) if isinstance(data, (dict, Mapping)) else data
    except JSONDecodeError:
        pass

    print()
    print(
        Panel(
            data,
            title=title,
        ),
        end="\n\n",
    )