from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import search, health
from app.core.config import settings

app = FastAPI(
    title="RepoRadar API",
    description="Smarter GitHub repository search and analysis",
    version="0.2.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.client_url, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(search.router)
app.include_router(health.router)


@app.get("/api/health-check")
async def health_check():
    return {"status": "ok"}
