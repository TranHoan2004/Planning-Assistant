import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi.errors import RateLimitExceeded
from dotenv import load_dotenv
from infrastructure.config.rate_limit import rate_limit_exceeded_handler, limiter
from infrastructure.config.config import app_config
from infrastructure.config.logging import init_logging
from presentation.api.conversation import router as conv_router

load_dotenv()
is_dev = os.getenv("ENVIRONMENT") == "dev"
init_logging(is_dev)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

    uvicorn.run("main:app", host="0.0.0.0", port=app_config.port, reload=is_dev)


if __name__ == "__main__":
    main()
