from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded
from agents.chat.infrastructure.config.rate_limit import (
    rate_limit_exceeded_handler,
    limiter,
)
from agents.chat.infrastructure.config.config import settings
from agents.chat.infrastructure.config.logging import init_logging
from agents.chat.presentation.api.conversation import router as conv_router

is_dev = settings.ENVIRONMENT == "dev"
init_logging(is_dev)

app = FastAPI(
    title="Plango Chat API",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTION"],
    allow_headers=["*"],
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)

# Routes setup
app.include_router(conv_router)


@app.get("/health")
async def health_check():
    return {"status": "OK"}


def main():
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=settings.PORT, reload=is_dev)


if __name__ == "__main__":
    main()
