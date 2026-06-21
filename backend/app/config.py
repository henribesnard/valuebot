from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql+asyncpg://valuebot:valuebot_secret@db:5432/valuebot"

    # Redis
    redis_url: str = "redis://redis:6379"

    # JWT
    jwt_secret_key: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 15
    refresh_token_expire_days: int = 7

    # Google OAuth
    google_client_id: str = ""
    google_client_secret: str = ""

    # CORS
    frontend_url: str = "http://localhost:4000"

    # Internal API (Hermès agent)
    hermes_api_token: str = "hermes_dev_token_change_me"

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
