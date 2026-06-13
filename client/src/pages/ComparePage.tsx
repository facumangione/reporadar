import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCompareStore } from '../store/compare.store'
import { formatNumber, timeAgo } from '../lib/utils'

export default function ComparePage() {
  const { selected, result, isLoading, error, compare, clear } = useCompareStore()
  const navigate = useNavigate()

  useEffect(() => {
    if (selected.length < 2) {
      navigate('/')
      return
    }
    compare()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-gray-400 text-sm">Analyzing repositories...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => { clear(); navigate('/') }}
              className="text-gray-400 hover:text-gray-200 text-sm transition-colors"
            >
              ← Back
            </button>
            <div className="w-px h-4 bg-gray-700" />
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-bold">R</div>
              <span className="font-semibold text-gray-100">RepoRadar</span>
            </div>
          </div>
          <h1 className="text-sm font-semibold text-gray-300">Repository Comparison</h1>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm mb-6">
            {error}
          </div>
        )}

        {result && (
          <div className={`grid gap-4 ${result.repos.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
            {result.repos.map(({ repo, health }) => (
              <div key={repo.id} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                {/* Repo header */}
                <div className="p-5 border-b border-gray-800">
                  <div className="flex items-center gap-3 mb-2">
                    <img src={repo.owner.avatar_url} alt="" className="w-8 h-8 rounded-lg" />
                    <div>
                      <a
                        href={repo.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        {repo.full_name}
                      </a>
                      {repo.language && (
                        <p className="text-xs text-gray-500">{repo.language}</p>
                      )}
                    </div>
                  </div>
                  {repo.description && (
                    <p className="text-xs text-gray-400 line-clamp-2">{repo.description}</p>
                  )}
                </div>

                {/* Health score */}
                <div className="p-5 border-b border-gray-800">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">Health Score</span>
                    <div
                      className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                      style={{ backgroundColor: `${health.color}20`, color: health.color }}
                    >
                      {health.score}/100 — {health.label}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{ width: `${health.score}%`, backgroundColor: health.color }}
                    />
                  </div>

                  {/* Breakdown */}
                  <div className="space-y-2">
                    {Object.entries(health.breakdown).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between text-xs">
                        <span className="text-gray-400 capitalize">{key.replace('_', ' ')}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-800 rounded-full h-1">
                            <div
                              className="h-1 rounded-full bg-blue-500"
                              style={{ width: `${value}%` }}
                            />
                          </div>
                          <span className="text-gray-300 w-8 text-right">{value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="p-5 space-y-2">
                  {[
                    { label: 'Stars', value: formatNumber(repo.stargazers_count) },
                    { label: 'Forks', value: formatNumber(repo.forks_count) },
                    { label: 'Open Issues', value: formatNumber(repo.open_issues_count) },
                    { label: 'Last Updated', value: timeAgo(repo.updated_at) },
                    { label: 'License', value: repo.license ?? '—' },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">{label}</span>
                      <span className="text-gray-200 font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
