import httpx
from app.core.config import settings
from app.core.cache import cache_get, cache_set


GITHUB_API = "https://api.github.com"


def _get_headers() -> dict:
    headers = {
        "Accept": "application/vnd.github.v3+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }
    if settings.github_token:
        headers["Authorization"] = f"Bearer {settings.github_token}"
    return headers


async def _get_commit_frequency(owner: str, repo: str) -> float:
    """Returns commits per week over the last 4 weeks (0-1 normalized)."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{GITHUB_API}/repos/{owner}/{repo}/commits",
                headers=_get_headers(),
                params={"per_page": 100, "since": "2026-01-01T00:00:00Z"},
                timeout=10.0,
            )
            if response.status_code != 200:
                return 0.0
            commits = response.json()
            count = len(commits) if isinstance(commits, list) else 0
            # Normalize: 50+ commits in period = score 1.0
            return min(count / 50, 1.0)
    except Exception:
        return 0.0


async def _get_contributor_count(owner: str, repo: str) -> float:
    """Returns contributor count normalized (0-1)."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{GITHUB_API}/repos/{owner}/{repo}/contributors",
                headers=_get_headers(),
                params={"per_page": 100, "anon": "false"},
                timeout=10.0,
            )
            if response.status_code != 200:
                return 0.0
            contributors = response.json()
            count = len(contributors) if isinstance(contributors, list) else 0
            # Normalize: 20+ contributors = score 1.0
            return min(count / 20, 1.0)
    except Exception:
        return 0.0


def _issue_ratio_score(open_issues: int, forks: int) -> float:
    """Lower open issue ratio = better score."""
    if forks == 0:
        return 0.5
    ratio = open_issues / max(forks, 1)
    # ratio < 0.1 = great, > 1.0 = poor
    if ratio < 0.1:
        return 1.0
    if ratio > 1.0:
        return 0.0
    return 1.0 - ratio


def _activity_score(updated_at: str) -> float:
    """More recently updated = better score."""
    from datetime import datetime, timezone
    try:
        updated = datetime.fromisoformat(updated_at.replace("Z", "+00:00"))
        now = datetime.now(timezone.utc)
        days_since = (now - updated).days
        if days_since < 7:
            return 1.0
        if days_since < 30:
            return 0.8
        if days_since < 90:
            return 0.6
        if days_since < 365:
            return 0.3
        return 0.1
    except Exception:
        return 0.5


async def calculate_health_score(
    owner: str,
    repo: str,
    open_issues: int,
    forks: int,
    updated_at: str,
) -> dict:
    cache_key = f"health:{owner}/{repo}"
    cached = await cache_get(cache_key)
    if cached:
        return cached

    commit_score = await _get_commit_frequency(owner, repo)
    contributor_score = await _get_contributor_count(owner, repo)
    issue_score = _issue_ratio_score(open_issues, forks)
    activity_score = _activity_score(updated_at)

    # Weighted average
    total = (
        commit_score * 0.35
        + contributor_score * 0.25
        + issue_score * 0.20
        + activity_score * 0.20
    )

    score = round(total * 100)

    if score >= 80:
        label = "Excellent"
        color = "#22c55e"
    elif score >= 60:
        label = "Good"
        color = "#84cc16"
    elif score >= 40:
        label = "Fair"
        color = "#f59e0b"
    else:
        label = "Poor"
        color = "#ef4444"

    result = {
        "score": score,
        "label": label,
        "color": color,
        "breakdown": {
            "commit_activity": round(commit_score * 100),
            "contributors": round(contributor_score * 100),
            "issue_ratio": round(issue_score * 100),
            "recent_activity": round(activity_score * 100),
        },
    }

    await cache_set(cache_key, result, ttl=3600)
    return result
