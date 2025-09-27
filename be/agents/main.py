from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded
from agents.shared.infrastructure.config.rate_limit import (
    rate_limit_exceeded_handler,
    limiter,
)
from agents.shared.infrastructure.config.settings import settings
from agents.shared.infrastructure.config.logging import init_logging
from agents.shared.infrastructure.connection_pool import (
    init_connection_pool,
    close_pool,
)
from agents.api.conversation import router as conv_router
from agents.api.itinerary import router as itinerary_router

is_dev = settings.ENVIRONMENT == "dev"
init_logging(is_dev)


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_connection_pool()
    yield
    await close_pool()


app = FastAPI(
    title="Plango Chat API",
    lifespan=lifespan,
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
app.include_router(itinerary_router)


@app.get("/health")
async def health_check():
    return {"status": "OK"}


def main():
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=settings.PORT, reload=is_dev)


if __name__ == "__main__":
    main()
