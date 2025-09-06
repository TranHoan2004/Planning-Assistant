from langchain_groq import ChatGroq
from agents.chat.infrastructure.config.config import settings


llm = ChatGroq(
    model=settings.MODEL_NAME,
    temperature=settings.MODEL_TEMPERATURE,
    max_tokens=settings.MODEL_MAX_TOKENS,
    max_retries=3,
)
