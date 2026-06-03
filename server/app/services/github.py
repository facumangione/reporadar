import httpx
from app.core.config import settings
from app.core.cache import cache_get, cache_set
from app.models.repo import Repository, SearchResponse, SearchFilters


GITHUB_API = "https://api.github.com"


def _get_headers() -> dict:
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    if settings.github_token:
        headers["Authorization"] = f"Bearer {settings.github_token}"
    return headers


def _build_query(filters: SearchFilters) -> str:
    parts = [filters.query]

    if filters.language:
        parts.append(f"language:{filters.language}")
    if filters.min_stars is not None:
        if filters.max_stars is not None:
            parts.append(f"stars:{filters.min_stars}..{filters.max_stars}")
        else:
            parts.append(f"stars:>={filters.min_stars}")
    if filters.license:
        parts.append(f"license:{filters.license}")
    if filters.pushed_after:
        parts.append(f"pushed:>{filters.pushed_after}")

    return " ".join(parts)


def _parse_repo(item: dict) -> Repository:
    return Repository(
        id=item["id"],
        name=item["name"],
        full_name=item["full_name"],
        description=item.get("description"),
        html_url=item["html_url"],
        stargazers_count=item["stargazers_count"],
        forks_count=item["forks_count"],
        open_issues_count=item["open_issues_count"],
        language=item.get("language"),
        license=item["license"]["spdx_id"] if item.get("license") else None,
        topics=item.get("topics", []),
        updated_at=item["updated_at"],
        created_at=item["created_at"],
        owner={"login": item["owner"]["login"], "avatar_url": item["owner"]["avatar_url"], "html_url": item["owner"]["html_url"]},
        watchers_count=item["watchers_count"],
        default_branch=item["default_branch"],
        size=item["size"],
    )


async def search_repos(filters: SearchFilters) -> SearchResponse:
    cache_key = f"search:{filters.model_dump_json()}"
    cached = await cache_get(cache_key)
    if cached:
        return SearchResponse(**cached)

    q = _build_query(filters)

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{GITHUB_API}/search/repositories",
            headers=_get_headers(),
            params={
                "q": q,
                "sort": "stars",
                "order": "desc",
                "page": filters.page,
                "per_page": filters.per_page,
            },
            timeout=15.0,
        )
        response.raise_for_status()
        data = response.json()

    items = [_parse_repo(item) for item in data.get("items", [])]
    total_count = min(data.get("total_count", 0), 1000)
    total_pages = (total_count + filters.per_page - 1) // filters.per_page

    result = SearchResponse(
        total_count=total_count,
        items=items,
        page=filters.page,
        per_page=filters.per_page,
        total_pages=total_pages,
    )

    await cache_set(cache_key, result.model_dump())
    return result


async def get_repo(owner: str, repo: str) -> Repository:
    cache_key = f"repo:{owner}/{repo}"
    cached = await cache_get(cache_key)
    if cached:
        return Repository(**cached)

    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{GITHUB_API}/repos/{owner}/{repo}",
            headers=_get_headers(),
            timeout=10.0,
        )
        response.raise_for_status()
        data = response.json()

    repo_data = _parse_repo(data)
    await cache_set(cache_key, repo_data.model_dump(), ttl=600)
    return repo_data
