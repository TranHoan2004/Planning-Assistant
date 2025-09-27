from langchain_groq import ChatGroq
from agents.shared.infrastructure.config.settings import settings


llm = ChatGroq(
    model=settings.MODEL_NAME,
    temperature=settings.MODEL_TEMPERATURE,
    max_tokens=settings.MODEL_MAX_TOKENS,
    max_retries=3,
)

planning_llm = ChatGroq(
    model=settings.PLANNING_MODEL_NAME,
    temperature=settings.PLANNING_MODEL_TEMPERATURE,
    max_tokens=settings.PLANNING_MODEL_MAX_TOKENS,
    max_retries=2,
)
