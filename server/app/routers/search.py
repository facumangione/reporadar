from fastapi import APIRouter, Query, HTTPException
from typing import Optional
from app.models.repo import SearchFilters, SearchResponse, Repository
from app.services.github import search_repos, get_repo

router = APIRouter(prefix="/api", tags=["repos"])


@router.get("/search", response_model=SearchResponse)
async def search(
    q: str = Query(..., min_length=1, description="Search query"),
    language: Optional[str] = Query(None),
    min_stars: Optional[int] = Query(None, ge=0),
    max_stars: Optional[int] = Query(None, ge=0),
    license: Optional[str] = Query(None),
    pushed_after: Optional[str] = Query(None, description="ISO date e.g. 2024-01-01"),
    page: int = Query(1, ge=1),
    per_page: int = Query(12, ge=1, le=30),
):
    filters = SearchFilters(
        query=q,
        language=language,
        min_stars=min_stars,
        max_stars=max_stars,
        license=license,
        pushed_after=pushed_after,
        page=page,
        per_page=per_page,
    )
    try:
        return await search_repos(filters)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"GitHub API error: {str(e)}")


@router.get("/repos/{owner}/{repo}", response_model=Repository)
async def get_repository(owner: str, repo: str):
    try:
        return await get_repo(owner, repo)
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"Repository not found: {str(e)}")
