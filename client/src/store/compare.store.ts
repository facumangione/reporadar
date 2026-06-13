import { create } from 'zustand'
import { api } from '../lib/api'
import { Repository } from '../types/repo.types'
import { CompareResponse } from '../types/health.types'

interface CompareState {
  selected: Repository[]
  result: CompareResponse | null
  isLoading: boolean
  error: string | null
  addRepo: (repo: Repository) => void
  removeRepo: (id: number) => void
  compare: () => Promise<void>
  clear: () => void
}

export const useCompareStore = create<CompareState>((set, get) => ({
  selected: [],
  result: null,
  isLoading: false,
  error: null,

  addRepo: (repo) => {
    const { selected } = get()
    if (selected.length >= 3) return
    if (selected.find((r) => r.id === repo.id)) return
    set({ selected: [...selected, repo], result: null })
  },

  removeRepo: (id) => {
    set((state) => ({
      selected: state.selected.filter((r) => r.id !== id),
      result: null,
    }))
  },

  compare: async () => {
    const { selected } = get()
    if (selected.length < 2) return

    set({ isLoading: true, error: null })
    try {
      const params = selected.map((r) => `repos=${r.full_name}`).join('&')
      const { data } = await api.get<CompareResponse>(`/compare?${params}`)
      set({ result: data })
    } catch (err: any) {
      set({ error: err.response?.data?.detail || 'Comparison failed' })
    } finally {
      set({ isLoading: false })
    }
  },

  clear: () => set({ selected: [], result: null, error: null }),
}))
