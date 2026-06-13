import { useSearchStore } from '../store/search.store'
import { useCompareStore } from '../store/compare.store'
import SearchBar from '../components/search/SearchBar'
import SearchFilters from '../components/search/SearchFilters'
import RepoCard from '../components/repos/RepoCard'
import CompareBar from '../components/repos/CompareBar'

export default function SearchPage() {
  const { results, totalCount, totalPages, currentPage, isLoading, error, hasSearched, changePage } =
    useSearchStore()
  const { selected, addRepo } = useCompareStore()

  return (
    <div className="min-h-screen bg-gray-950 pb-20">
      {/* Header */}
      <header className="border-b border-gray-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-xs font-bold">
            R
          </div>
          <span className="font-semibold text-gray-100">RepoRadar</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        {!hasSearched && (
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-100 mb-2">
              Find the right repository
            </h1>
            <p className="text-gray-400 text-sm">
              Smarter GitHub search with filters that actually matter
            </p>
          </div>
        )}

        <div className="space-y-3 mb-6">
          <SearchBar />
          <SearchFilters />
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-sm">
            {error}
          </div>
        ) : hasSearched && results.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl mb-2">🔭</p>
            <p className="text-gray-400 text-sm">No repositories found</p>
          </div>
        ) : results.length > 0 ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-400">
                {totalCount.toLocaleString()} repositories found
              </p>
              <p className="text-xs text-gray-500">
                Click "+ Compare" on up to 3 repos to compare them
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {results.map((repo) => (
                <RepoCard
                  key={repo.id}
                  repo={repo}
                  onAddToCompare={addRepo}
                  isInCompare={!!selected.find((r) => r.id === repo.id)}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => changePage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1.5 text-sm text-gray-400 hover:text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ← Prev
                </button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => changePage(page)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      page === currentPage
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => changePage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1.5 text-sm text-gray-400 hover:text-gray-200 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        ) : null}
      </main>

      <CompareBar />
    </div>
  )
}
