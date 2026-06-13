from fastapi import APIRouter, HTTPException, Query
from typing import List
from app.models.health import HealthScore, CompareResponse, RepoWithHealth
from app.services.github import get_repo
from app.services.health import calculate_health_score

router = APIRouter(prefix="/api", tags=["health"])


@router.get("/repos/{owner}/{repo}/health", response_model=HealthScore)
async def get_health(owner: str, repo: str):
    try:
        repo_data = await get_repo(owner, repo)
        health = await calculate_health_score(
            owner=owner,
            repo=repo,
            open_issues=repo_data.open_issues_count,
            forks=repo_data.forks_count,
            updated_at=repo_data.updated_at,
        )
        return HealthScore(**health)
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/compare", response_model=CompareResponse)
async def compare_repos(
    repos: List[str] = Query(..., description="List of owner/repo strings, max 3"),
):
    if len(repos) < 2:
        raise HTTPException(status_code=400, detail="Provide at least 2 repositories to compare")
    if len(repos) > 3:
        raise HTTPException(status_code=400, detail="Maximum 3 repositories allowed")

    results = []
    for full_name in repos:
        try:
            parts = full_name.split("/")
            if len(parts) != 2:
                raise ValueError(f"Invalid repo format: {full_name}")
            owner, repo = parts
            repo_data = await get_repo(owner, repo)
            health = await calculate_health_score(
                owner=owner,
                repo=repo,
                open_issues=repo_data.open_issues_count,
                forks=repo_data.forks_count,
                updated_at=repo_data.updated_at,
            )
            results.append(RepoWithHealth(repo=repo_data, health=HealthScore(**health)))
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(status_code=502, detail=f"Error fetching {full_name}: {str(e)}")

    return CompareResponse(repos=results)
