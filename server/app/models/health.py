from pydantic import BaseModel
from app.models.repo import Repository


class HealthBreakdown(BaseModel):
    commit_activity: int
    contributors: int
    issue_ratio: int
    recent_activity: int


class HealthScore(BaseModel):
    score: int
    label: str
    color: str
    breakdown: HealthBreakdown


class RepoWithHealth(BaseModel):
    repo: Repository
    health: HealthScore


class CompareResponse(BaseModel):
    repos: list[RepoWithHealth]
