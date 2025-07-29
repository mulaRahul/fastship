from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict


PROJECT_DIR = Path(__file__).resolve().parent.parent


_base_config = SettingsConfigDict(
    env_file=PROJECT_DIR / ".env",
    env_ignore_empty=True,
    extra="ignore",
)


class AppSettings(BaseSettings):
    APP_NAME: str = "FastShip"
    APP_DOMAIN: str = "localhost:8000"


class DatabaseSettings(BaseSettings):
    POSTGRES_SERVER: str
    POSTGRES_PORT: int
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str

    REDIS_HOST: str
    REDIS_PORT: str

    model_config = _base_config

    @property
    def POSTGRES_URL(self):
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    def REDIS_URL(self, db):
        return f"redis://{self.REDIS_HOST}:{self.REDIS_PORT}/{db}"


class SecuritySettings(BaseSettings):

    JWT_SECRET: str
    JWT_ALGORITHM: str

    model_config = _base_config


class NotificationSettings(BaseSettings):

    MAIL_USERNAME: str
    MAIL_PASSWORD: str
    MAIL_FROM: str
    MAIL_PORT: int
    MAIL_SERVER: str
    MAIL_FROM_NAME: str
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False
    USE_CREDENTIALS: bool = True
    VALIDATE_CERTS: bool = True

    TWILIO_SID: str
    TWILIO_AUTH_TOKEN: str
    TWILIO_NUMBER: str

    model_config = _base_config


app_settings = AppSettings()
db_settings = DatabaseSettings()
security_settings = SecuritySettings()
notification_settings = NotificationSettings()