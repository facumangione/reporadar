import { useSearchStore } from '../../store/search.store'

const LANGUAGES = ['JavaScript', 'TypeScript', 'Python', 'Go', 'Rust', 'Java', 'C++', 'Ruby', 'PHP', 'Swift']
const LICENSES = ['mit', 'apache-2.0', 'gpl-3.0', 'bsd-2-clause', 'bsd-3-clause']
const STAR_RANGES = [
  { label: 'Any', min: undefined, max: undefined },
  { label: '0–100', min: 0, max: 100 },
  { label: '100–1k', min: 100, max: 1000 },
  { label: '1k–10k', min: 1000, max: 10000 },
  { label: '10k+', min: 10000, max: undefined },
]
const ACTIVITY = [
  { label: 'Any time', value: undefined },
  { label: 'Past week', value: new Date(Date.now() - 7 * 86400000).toISOString().slice(0, 10) },
  { label: 'Past month', value: new Date(Date.now() - 30 * 86400000).toISOString().slice(0, 10) },
  { label: 'Past 6 months', value: new Date(Date.now() - 180 * 86400000).toISOString().slice(0, 10) },
  { label: 'Past year', value: new Date(Date.now() - 365 * 86400000).toISOString().slice(0, 10) },
]

export default function SearchFilters() {
  const { filters, search } = useSearchStore()

  const apply = (newFilters: object) => {
    if (!filters.q) return
    search({ ...filters, ...newFilters, page: 1 })
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* Language */}
      <select
        value={filters.language ?? ''}
        onChange={(e) => apply({ language: e.target.value || undefined })}
        className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-gray-300 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/50"
      >
        <option value="">All languages</option>
        {LANGUAGES.map((l) => (
          <option key={l} value={l}>{l}</option>
        ))}
      </select>

      {/* Stars */}
      <select
        value={`${filters.min_stars ?? ''}-${filters.max_stars ?? ''}`}
        onChange={(e) => {
          const range = STAR_RANGES.find(
            (r) => `${r.min ?? ''}-${r.max ?? ''}` === e.target.value
          )
          if (range) apply({ min_stars: range.min, max_stars: range.max })
        }}
        className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-gray-300 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/50"
      >
        {STAR_RANGES.map((r) => (
          <option key={r.label} value={`${r.min ?? ''}-${r.max ?? ''}`}>
            ⭐ {r.label}
          </option>
        ))}
      </select>

      {/* Activity */}
      <select
        value={filters.pushed_after ?? ''}
        onChange={(e) => apply({ pushed_after: e.target.value || undefined })}
        className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-gray-300 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/50"
      >
        {ACTIVITY.map((a) => (
          <option key={a.label} value={a.value ?? ''}>{a.label}</option>
        ))}
      </select>

      {/* License */}
      <select
        value={filters.license ?? ''}
        onChange={(e) => apply({ license: e.target.value || undefined })}
        className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-1.5 text-gray-300 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500/50"
      >
        <option value="">Any license</option>
        {LICENSES.map((l) => (
          <option key={l} value={l}>{l.toUpperCase()}</option>
        ))}
      </select>
    </div>
  )
}
