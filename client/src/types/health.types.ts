export interface HealthBreakdown {
  commit_activity: number
  contributors: number
  issue_ratio: number
  recent_activity: number
}

export interface HealthScore {
  score: number
  label: string
  color: string
  breakdown: HealthBreakdown
}

export interface RepoWithHealth {
  repo: import('./repo.types').Repository
  health: HealthScore
}

export interface CompareResponse {
  repos: RepoWithHealth[]
}
