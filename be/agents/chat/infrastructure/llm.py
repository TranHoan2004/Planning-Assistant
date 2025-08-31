from langchain_groq import ChatGroq
from dotenv import load_dotenv

load_dotenv()


# llm = ChatGroq(
#     model="Llama-3.1-8B-instant",
#     temperature=0.1,
#     max_tokens=4096,
#     timeout=None,
#     max_retries=2,
# )
llm = ChatGroq(
    model="deepseek-r1-distill-llama-70b",
    temperature=0.2,
    max_tokens=2048,
    reasoning_format="hidden",
)
