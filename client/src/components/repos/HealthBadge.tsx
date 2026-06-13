import { useEffect, useState } from 'react'
import { api } from '../../lib/api'
import { HealthScore } from '../../types/health.types'

interface Props {
  owner: string
  repo: string
}

export default function HealthBadge({ owner, repo }: Props) {
  const [health, setHealth] = useState<HealthScore | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api
      .get<HealthScore>(`/repos/${owner}/${repo}/health`)
      .then((res) => setHealth(res.data))
      .catch(() => setHealth(null))
      .finally(() => setLoading(false))
  }, [owner, repo])

  if (loading) {
    return (
      <div className="w-10 h-5 bg-gray-800 rounded-full animate-pulse" />
    )
  }

  if (!health) return null

  return (
    <div
      className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ backgroundColor: `${health.color}20`, color: health.color }}
      title={`Health: ${health.score}/100 — ${health.label}`}
    >
      <span>●</span>
      <span>{health.score}</span>
    </div>
  )
}
