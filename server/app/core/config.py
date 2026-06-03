from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    github_token: str = ""
    redis_url: str = "redis://localhost:6379"
    cache_ttl: int = 300
    client_url: str = "http://localhost:5173"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
