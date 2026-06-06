import { Repository } from '../../types/repo.types'
import { formatNumber, timeAgo } from '../../lib/utils'

interface Props {
  repo: Repository
}

export default function RepoCard({ repo }: Props) {
  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl p-5 transition-colors group"
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">
        <img
          src={repo.owner.avatar_url}
          alt={repo.owner.login}
          className="w-8 h-8 rounded-lg flex-shrink-0"
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-blue-400 group-hover:text-blue-300 truncate transition-colors">
            {repo.full_name}
          </p>
          {repo.description && (
            <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">
              {repo.description}
            </p>
          )}
        </div>
      </div>

      {/* Topics */}
      {repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {repo.topics.slice(0, 4).map((topic) => (
            <span
              key={topic}
              className="bg-blue-500/10 text-blue-400 text-xs px-2 py-0.5 rounded-full"
            >
              {topic}
            </span>
          ))}
          {repo.topics.length > 4 && (
            <span className="text-gray-500 text-xs px-1">+{repo.topics.length - 4}</span>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        {repo.language && (
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            {repo.language}
          </span>
        )}
        <span>⭐ {formatNumber(repo.stargazers_count)}</span>
        <span>🍴 {formatNumber(repo.forks_count)}</span>
        <span>🔴 {formatNumber(repo.open_issues_count)}</span>
        <span className="ml-auto">Updated {timeAgo(repo.updated_at)}</span>
      </div>
    </a>
  )
}
