import { useCompareStore } from '../../store/compare.store'
import { useNavigate } from 'react-router-dom'

export default function CompareBar() {
  const { selected, removeRepo, clear } = useCompareStore()
  const navigate = useNavigate()

  if (selected.length === 0) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 px-6 py-3 z-50">
      <div className="max-w-5xl mx-auto flex items-center gap-3">
        <span className="text-sm text-gray-400 flex-shrink-0">
          Compare ({selected.length}/3):
        </span>

        <div className="flex items-center gap-2 flex-1 overflow-x-auto">
          {selected.map((repo) => (
            <div
              key={repo.id}
              className="flex items-center gap-1.5 bg-gray-800 rounded-lg px-3 py-1.5 text-xs text-gray-300 flex-shrink-0"
            >
              <img src={repo.owner.avatar_url} alt="" className="w-4 h-4 rounded" />
              <span>{repo.full_name}</span>
              <button
                onClick={() => removeRepo(repo.id)}
                className="text-gray-500 hover:text-gray-300 ml-1"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={clear}
            className="text-xs text-gray-400 hover:text-gray-200 transition-colors"
          >
            Clear
          </button>
          <button
            onClick={() => navigate('/compare')}
            disabled={selected.length < 2}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg px-4 py-1.5 transition-colors"
          >
            Compare →
          </button>
        </div>
      </div>
    </div>
  )
}
