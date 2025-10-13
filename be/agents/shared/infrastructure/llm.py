from agents.shared.infrastructure.config.settings import settings
from langchain_openai import ChatOpenAI


llm = ChatOpenAI(
    model=settings.MODEL_NAME,
    max_completion_tokens=settings.MODEL_MAX_TOKENS,
    temperature=settings.MODEL_TEMPERATURE,
    max_retries=3,
    reasoning_effort="low",
)

planning_llm = ChatOpenAI(
    model=settings.PLANNING_MODEL_NAME,
    max_completion_tokens=settings.PLANNING_MODEL_MAX_TOKENS,
    temperature=settings.PLANNING_MODEL_TEMPERATURE,
    max_retries=2,
)
