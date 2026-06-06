import { create } from 'zustand'
import { api } from '../lib/api'
import { Repository, SearchFilters, SearchResponse } from '../types/repo.types'

interface SearchState {
  results: Repository[]
  totalCount: number
  totalPages: number
  currentPage: number
  isLoading: boolean
  error: string | null
  filters: SearchFilters
  hasSearched: boolean
  search: (filters: SearchFilters) => Promise<void>
  setFilters: (filters: Partial<SearchFilters>) => void
  changePage: (page: number) => Promise<void>
}

export const useSearchStore = create<SearchState>((set, get) => ({
  results: [],
  totalCount: 0,
  totalPages: 1,
  currentPage: 1,
  isLoading: false,
  error: null,
  filters: { q: '' },
  hasSearched: false,

  search: async (filters) => {
    set({ isLoading: true, error: null, filters, hasSearched: true })
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value))
        }
      })

      const { data } = await api.get<SearchResponse>(`/search?${params.toString()}`)
      set({
        results: data.items,
        totalCount: data.total_count,
        totalPages: data.total_pages,
        currentPage: data.page,
      })
    } catch (err: any) {
      set({ error: err.response?.data?.detail || 'Something went wrong', results: [] })
    } finally {
      set({ isLoading: false })
    }
  },

  setFilters: (filters) => {
    set((state) => ({ filters: { ...state.filters, ...filters } }))
  },

  changePage: async (page) => {
    const { filters, search } = get()
    await search({ ...filters, page })
  },
}))
