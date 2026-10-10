import { useEffect, useLayoutEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

const SCROLL_KEY = 'socutesyyy:listing-scroll-y'
const PENDING_KEY = 'socutesyyy:listing-scroll-pending'

function readPendingScroll() {
  try {
    if (sessionStorage.getItem(PENDING_KEY) !== '1') return null
    const y = Number(sessionStorage.getItem(SCROLL_KEY))
    return Number.isFinite(y) ? y : null
  } catch {
    return null
  }
}

function clearPending() {
  try {
    sessionStorage.removeItem(PENDING_KEY)
  } catch {
    /* ignore */
  }
}

/**
 * Homepage listing scroll memory for product detail round-trips.
 * - Saves scroll when clicking a product link
 * - Restores on browser Back / navigate(-1) (POP)
 * - Scrolls to top on PUSH/REPLACE into non-listing routes (and new pages)
 */
export function ListingScrollMemory() {
  const location = useLocation()
  const navigationType = useNavigationType()

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  // Capture scroll before React Router navigates to a product
  useEffect(() => {
    const persist = (event) => {
      if (location.pathname !== '/') return
      const link = event.target?.closest?.('a[href^="/product/"]')
      if (!link) return
      try {
        sessionStorage.setItem(SCROLL_KEY, String(window.scrollY))
        sessionStorage.setItem(PENDING_KEY, '1')
      } catch {
        /* private mode */
      }
    }
    document.addEventListener('pointerdown', persist, true)
    document.addEventListener('click', persist, true)
    return () => {
      document.removeEventListener('pointerdown', persist, true)
      document.removeEventListener('click', persist, true)
    }
  }, [location.pathname])

  useLayoutEffect(() => {
    // Restore listing position after Back from a product
    if (location.pathname === '/' && navigationType === 'POP') {
      const y = readPendingScroll()
      if (y == null) return undefined

      const apply = () => {
        const maxY = Math.max(
          0,
          document.documentElement.scrollHeight - window.innerHeight,
        )
        window.scrollTo({ top: Math.min(y, maxY), left: 0, behavior: 'auto' })
      }
      apply()

      const root = document.documentElement
      let finished = false
      const finish = (event) => {
        if (event?.target?.closest?.('a[href^="/product/"]')) return
        if (finished) return
        finished = true
        clearPending()
        ro.disconnect()
        document.removeEventListener('pointerdown', finish, true)
        document.removeEventListener('wheel', finish, true)
        document.removeEventListener('touchstart', finish, true)
      }

      const ro = new ResizeObserver(() => {
        apply()
        if (
          root.scrollHeight - window.innerHeight >= y - 1 &&
          Math.abs(window.scrollY - y) <= 2
        ) {
          finish()
        }
      })
      ro.observe(root)

      document.addEventListener('pointerdown', finish, true)
      document.addEventListener('wheel', finish, true)
      document.addEventListener('touchstart', finish, true)

      return () => {
        ro.disconnect()
        document.removeEventListener('pointerdown', finish, true)
        document.removeEventListener('wheel', finish, true)
        document.removeEventListener('touchstart', finish, true)
      }
    }

    // New navigations: start at top (nav section jumps use preventScrollReset)
    if (navigationType !== 'POP' && !location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    }

    return undefined
  }, [location.key, location.pathname, location.hash, navigationType])

  // After paint: re-assert listing restore once images/layout settle
  useEffect(() => {
    if (location.pathname !== '/' || navigationType !== 'POP') return
    const y = readPendingScroll()
    if (y == null) return

    const apply = () => {
      const maxY = Math.max(
        0,
        document.documentElement.scrollHeight - window.innerHeight,
      )
      window.scrollTo({ top: Math.min(y, maxY), left: 0, behavior: 'auto' })
    }
    apply()
    const id = requestAnimationFrame(apply)
    return () => cancelAnimationFrame(id)
  }, [location.key, location.pathname, navigationType])

  return null
}
