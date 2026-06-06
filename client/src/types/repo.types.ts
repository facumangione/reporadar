export interface RepoOwner {
  login: string
  avatar_url: string
  html_url: string
}

export interface Repository {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  stargazers_count: number
  forks_count: number
  open_issues_count: number
  language: string | null
  license: string | null
  topics: string[]
  updated_at: string
  created_at: string
  owner: RepoOwner
  watchers_count: number
  default_branch: string
  size: number
}

export interface SearchResponse {
  total_count: number
  items: Repository[]
  page: number
  per_page: number
  total_pages: number
}

export interface SearchFilters {
  q: string
  language?: string
  min_stars?: number
  max_stars?: number
  license?: string
  pushed_after?: string
  page?: number
  per_page?: number
}
