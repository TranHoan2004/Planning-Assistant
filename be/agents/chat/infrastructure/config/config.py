from dotenv import load_dotenv

load_dotenv()

from typing import List
from pydantic_settings import BaseSettings
from pydantic import field_validator
import os


class Settings(BaseSettings):
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "dev")
    PORT: int = int(os.getenv("PORT", 4000))
    DEBUG: bool = bool(os.getenv("DEBUG", True))
    ALLOWED_ORIGINS: str = os.getenv("ALLOWED_ORIGINS", "*")
    MODEL_NAME: str = os.getenv("MODEL_NAME", "openai/gpt-oss-20b")
    GROQ_API_KEY: str | None = os.getenv("GROQ_API_KEY")
    MODEL_MAX_TOKENS: int = int(os.getenv("MODEL_MAX_TOKENS", 4096))
    MODEL_TEMPERATURE: int = int(os.getenv("MODEL_TEMPERATURE", 0.1))
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

    @field_validator("ALLOWED_ORIGINS")
    @classmethod
    def parse_allowed_origin(cls, v: str) -> List[str]:
        return v.split(",") if v else []

    @field_validator("GROQ_API_KEY")
    @classmethod
    def parse_groq_api_key(cls, v: str | None) -> str:
        if not v:
            raise ValueError("GROQ_API_KEY is not set")
        return v


settings = Settings()
