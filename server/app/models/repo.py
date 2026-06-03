from pydantic import BaseModel
from typing import Optional


class RepoOwner(BaseModel):
    login: str
    avatar_url: str
    html_url: str


class Repository(BaseModel):
    id: int
    name: str
    full_name: str
    description: Optional[str] = None
    html_url: str
    stargazers_count: int
    forks_count: int
    open_issues_count: int
    language: Optional[str] = None
    license: Optional[str] = None
    topics: list[str] = []
    updated_at: str
    created_at: str
    owner: RepoOwner
    watchers_count: int
    default_branch: str
    size: int


class SearchFilters(BaseModel):
    query: str
    language: Optional[str] = None
    min_stars: Optional[int] = None
    max_stars: Optional[int] = None
    license: Optional[str] = None
    pushed_after: Optional[str] = None
    page: int = 1
    per_page: int = 12


class SearchResponse(BaseModel):
    total_count: int
    items: list[Repository]
    page: int
    per_page: int
    total_pages: int
