from pydantic import BaseModel
import os


class AppConfig(BaseModel):
    port: int


env = os.getenv("ENVIRONMENT") or "dev"

app_config = AppConfig(
    port=int(os.getenv("PORT") or 4000),
)
