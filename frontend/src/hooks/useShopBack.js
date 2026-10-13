import { useCallback } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

/**
 * Returns to the previous browsing entry (listing scroll / filters preserved).
 * Falls back to `fallbackPath` for direct product links, refreshes, and new tabs.
 */
export function useShopBack(fallbackPath = '/') {
  const navigate = useNavigate()
  const location = useLocation()

  return useCallback(() => {
    const idx = window.history.state?.idx
    if (typeof idx === 'number' && idx > 0) {
      navigate(-1)
      return
    }

    const from = location.state?.from
    if (from && typeof from.pathname === 'string') {
      navigate(
        {
          pathname: from.pathname,
          search: from.search || '',
          hash: from.hash || '',
        },
        { replace: true, preventScrollReset: Boolean(from.hash) },
      )
      return
    }

    if (fallbackPath.includes('#')) {
      const [pathAndSearch, hash = ''] = fallbackPath.split('#')
      const [pathname, search = ''] = pathAndSearch.split('?')
      navigate(
        {
          pathname: pathname || '/',
          search: search ? `?${search}` : '',
          hash: hash ? `#${hash}` : '',
        },
        { replace: true, preventScrollReset: true },
      )
      return
    }

    navigate(fallbackPath, { replace: true })
  }, [navigate, location.state, fallbackPath])
}
