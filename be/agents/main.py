from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded
from agents.shared.infrastructure.config import (
    settings,
    rate_limit_exceeded_handler,
    limiter,
    init_logging,
)
from agents.shared.infrastructure.connection_pool import (
    init_connection_pool,
    close_pool,
)
from agents.api.conversation import router as conv_router
from agents.api.itinerary import router as itinerary_router
from agents.shared.utils.googlemaps_api import GoogleMapsAPI
from agents.shared.utils.bookingcom_api import BookingComAPI
from agents.shared.infrastructure.db import init_db

is_dev = settings.ENVIRONMENT == "dev"
init_logging(is_dev)


async def startup(app: FastAPI):
    googlemaps_api = GoogleMapsAPI(api_key=settings.GOOGLE_MAPS_API_KEY)
    booking_api = BookingComAPI(api_key=str(settings.RAPIDAPI_KEY))
    await init_connection_pool()
    await init_db()
    await googlemaps_api.__aenter__()
    app.state.googlemaps_api = googlemaps_api
    app.state.booking_api = booking_api


async def shutdown(app: FastAPI):
    await app.state.googlemaps_api.__aexit__(None, None, None)
    await close_pool()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await startup(app)
    yield
    await shutdown(app)


app = FastAPI(
    title="Planggo Chat API",
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
# app.include_router(itinerary_router)


@app.get("/health")
async def health_check():
    return {"status": "OK"}


def main():
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=settings.PORT, reload=is_dev)


if __name__ == "__main__":
    main()
