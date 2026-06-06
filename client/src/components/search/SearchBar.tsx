import { useState, FormEvent } from 'react'
import { useSearchStore } from '../../store/search.store'

export default function SearchBar() {
  const { filters, search, isLoading } = useSearchStore()
  const [query, setQuery] = useState(filters.q)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    search({ ...filters, q: query.trim(), page: 1 })
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="flex-1 relative">
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
          🔍
        </span>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search repositories... e.g. react dashboard"
          className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-9 pr-4 py-3 text-gray-100 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !query.trim()}
        className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl px-5 py-3 text-sm transition-colors"
      >
        {isLoading ? 'Searching...' : 'Search'}
      </button>
    </form>
  )
}
