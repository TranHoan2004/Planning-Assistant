from agents.shared.infrastructure.config import settings
from langchain_openai import ChatOpenAI


llm = ChatOpenAI(
    model=settings.MODEL_NAME,
    max_completion_tokens=settings.MODEL_MAX_TOKENS,
    temperature=settings.MODEL_TEMPERATURE,
    max_retries=3,
)

planning_llm = ChatOpenAI(
    model=settings.PLANNING_MODEL_NAME,
    max_completion_tokens=settings.PLANNING_MODEL_MAX_TOKENS,
    temperature=settings.PLANNING_MODEL_TEMPERATURE,
    max_retries=2,
)

extract_llm = ChatOpenAI(
    model="gpt-4o",
    max_completion_tokens=settings.MODEL_MAX_TOKENS,
    temperature=0,
    max_retries=2,
)
