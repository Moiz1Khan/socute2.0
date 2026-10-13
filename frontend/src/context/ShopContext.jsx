import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useSearchParams } from 'react-router-dom'

const ShopContext = createContext(null)

export function ShopProvider({ children }) {
  const [searchParams, setSearchParams] = useSearchParams()
  const qFromUrl = searchParams.get('q') ?? ''

  const [searchQuery, setSearchQueryState] = useState(qFromUrl)
  const [categoryFilter, setCategoryFilter] = useState(null)
  /** @type {[string[]|null, Function]} */
  const [slugFilter, setSlugFilter] = useState(null)
  const [filterLabel, setFilterLabel] = useState(null)

  // Keep in-memory search in sync with shareable ?q=
  useEffect(() => {
    setSearchQueryState(qFromUrl)
  }, [qFromUrl])

  const setSearchQuery = useCallback((value) => {
    setSearchQueryState(value)
  }, [])

  /** Commit search to the URL (shareable / back-forward friendly). */
  const commitSearchToUrl = useCallback(
    (value = searchQuery) => {
      const trimmed = String(value ?? '').trim()
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          if (trimmed) next.set('q', trimmed)
          else next.delete('q')
          return next
        },
        { preventScrollReset: true, replace: false },
      )
    },
    [searchQuery, setSearchParams],
  )

  const clearProductFilters = useCallback(() => {
    setCategoryFilter(null)
    setSlugFilter(null)
    setFilterLabel(null)
  }, [])

  const clearSearch = useCallback(() => {
    setSearchQueryState('')
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev)
        next.delete('q')
        return next
      },
      { preventScrollReset: true, replace: true },
    )
  }, [setSearchParams])

  const value = useMemo(
    () => ({
      searchQuery,
      setSearchQuery,
      commitSearchToUrl,
      clearSearch,
      categoryFilter,
      setCategoryFilter,
      slugFilter,
      setSlugFilter,
      filterLabel,
      setFilterLabel,
      clearProductFilters,
    }),
    [
      searchQuery,
      setSearchQuery,
      commitSearchToUrl,
      clearSearch,
      categoryFilter,
      slugFilter,
      filterLabel,
      clearProductFilters,
    ],
  )

  return (
    <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
  )
}

export function useShop() {
  const ctx = useContext(ShopContext)
  if (!ctx) throw new Error('useShop must be used within ShopProvider')
  return ctx
}
