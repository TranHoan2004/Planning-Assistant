from typing import List
from pydantic_settings import BaseSettings
from pydantic import field_validator
import os


class Settings(BaseSettings):
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "dev")
    PORT: int = int(os.getenv("PORT", 4000))
    DEBUG: bool = bool(os.getenv("DEBUG", True))
    ALLOWED_ORIGINS: str = os.getenv("ALLOWED_ORIGINS", "*")

    MODEL_NAME: str = os.getenv("MODEL_NAME", "")
    MODEL_MAX_TOKENS: int = int(os.getenv("MODEL_MAX_TOKENS", 4096))
    MODEL_TEMPERATURE: float = float(os.getenv("MODEL_TEMPERATURE", 0.1))

    PLANNING_MODEL_NAME: str = os.getenv("PLANNING_MODEL_NAME", "")
    PLANNING_MODEL_MAX_TOKENS: int = int(os.getenv("PLANNING_MODEL_MAX_TOKENS", 16384))
    PLANNING_MODEL_TEMPERATURE: float = float(
        os.getenv("PLANNING_MODEL_TEMPERATURE", 0.1)
    )

    TAVILY_API_KEY: str | None = os.getenv("TAVILY_API_KEY")
    REDIS_HOST: str = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT: int = int(os.getenv("REDIS_PORT", 6379))
    REDIS_DB: int = int(os.getenv("REDIS_DB", 0))
    SERPAPI_API_KEY: str | None = os.getenv("SERPAPI_API_KEY")

    MIN_CONVERSATION_THRESHOLD: int = int(os.getenv("MIN_CONVERSATION_THRESHOLD", 2))
    MAX_TOKENS_FOR_SUMMARY: int = int(os.getenv("MAX_TOKENS_FOR_SUMMARY", 256))
    TOTAL_MESSAGES_AFTER_SUMMARY: int = int(
        os.getenv("TOTAL_MESSAGES_AFTER_SUMMARY", 2)
    )

    POSTGRES_HOST: str = os.getenv("POSTGRES_HOST", "localhost")
    POSTGRES_PORT: int = int(os.getenv("POSTGRES_PORT", 5432))
    POSTGRES_USER: str = os.getenv("POSTGRES_USER", "postgres")
    POSTGRES_PASSWORD: str = os.getenv("POSTGRES_PASSWORD", "postgres")
    POSTGRES_DB: str = os.getenv("POSTGRES_DB", "plango")
    CONNECTION_POOL_SIZE: int = int(os.getenv("CONNECTION_POOL_SIZE", 5))

    GOOGLE_MAPS_API_KEY: str | None = os.getenv("GOOGLE_MAPS_API_KEY")

    OPENAI_API_KEY: str | None = os.getenv("OPENAI_API_KEY")

    RAPIDAPI_KEY: str | None = os.getenv("RAPIDAPI_KEY")

    @field_validator("ALLOWED_ORIGINS")
    @classmethod
    def parse_allowed_origin(cls, v: str) -> List[str]:
        return v.split(",") if v else []

    @field_validator("GOOGLE_MAPS_API_KEY")
    @classmethod
    def parse_google_maps_api_key(cls, v: str | None) -> str:
        if not v:
            raise ValueError("GOOGLE_MAPS_API_KEY is not set")
        return v

    @field_validator("OPENAI_API_KEY")
    @classmethod
    def parse_openai_api_key(cls, v: str | None) -> str:
        if not v:
            raise ValueError("OPENAI_API_KEY is not set")
        return v

    @field_validator("MODEL_NAME")
    @classmethod
    def parse_model_name(cls, v: str) -> str:
        if not v:
            raise ValueError("MODEL_NAME is not set")
        return v

    @field_validator("PLANNING_MODEL_NAME")
    @classmethod
    def parse_planning_model_name(cls, v: str) -> str:
        if not v:
            raise ValueError("PLANNING_MODEL_NAME is not set")
        return v


settings = Settings()
