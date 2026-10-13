import { useEffect, useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

const POSITIONS_KEY = 'socutesy:scroll-positions-v2'

function readPositions() {
  try {
    const raw = sessionStorage.getItem(POSITIONS_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeRecord(key, record) {
  if (!key || !record) return
  try {
    const all = readPositions()
    all[key] = record
    sessionStorage.setItem(POSITIONS_KEY, JSON.stringify(all))
  } catch {
    /* private mode */
  }
}

function readRecord(key) {
  if (!key) return null
  const value = readPositions()[key]
  if (value == null) return null
  if (typeof value === 'number' && Number.isFinite(value)) {
    return { y: value, anchorId: null, anchorTop: null }
  }
  if (typeof value === 'object' && typeof value.y === 'number') {
    return value
  }
  return null
}

/** True when this history entry has a saved Y that POP restoration will apply. */
export function hasSavedScrollPosition(locationKey) {
  return readRecord(locationKey) != null
}

function instantScroll(y) {
  const html = document.documentElement
  const prev = html.style.scrollBehavior
  html.style.scrollBehavior = 'auto'
  window.scrollTo(0, Math.max(0, y))
  html.style.scrollBehavior = prev
}

function findScrollAnchor() {
  const sections = document.querySelectorAll(
    '[id^="section-"], #products-top, #how-to-order, #order-info, #faqs',
  )
  let best = null
  let bestDist = Infinity
  sections.forEach((el) => {
    const top = el.getBoundingClientRect().top
    const dist = Math.abs(top - 96)
    if (dist < bestDist) {
      bestDist = dist
      best = el
    }
  })
  if (!best) return { anchorId: null, anchorTop: null }
  return {
    anchorId: best.id,
    anchorTop: Math.round(best.getBoundingClientRect().top),
  }
}

function captureScroll() {
  const { anchorId, anchorTop } = findScrollAnchor()
  return {
    y: Math.round(window.scrollY),
    anchorId,
    anchorTop,
  }
}

/**
 * Route-aware scroll restoration keyed by React Router location.key.
 *
 * Product link clicks often focus the card and the browser scrolls it into view
 * before React navigates. That would overwrite the real listing Y with a
 * post-focus Y. We freeze the position on pointerdown/click (capture phase)
 * and persist that frozen record when the location key changes.
 */
export function ListingScrollMemory() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const scrollRef = useRef(captureScroll())
  const frozenRef = useRef(null)
  const prevKeyRef = useRef(location.key)
  const prevPathRef = useRef(location.pathname + location.search + location.hash)

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  useEffect(() => {
    scrollRef.current = captureScroll()
    const onScroll = () => {
      // Ignore scroll jitter after a product link has frozen the listing Y
      if (frozenRef.current) return
      scrollRef.current = captureScroll()
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const freeze = (event) => {
      const link = event.target?.closest?.('a[href^="/product/"]')
      if (!link) return
      if (frozenRef.current) return
      const record = {
        ...captureScroll(),
        path: prevPathRef.current,
      }
      frozenRef.current = record
      scrollRef.current = record
      writeRecord(prevKeyRef.current, record)
    }
    document.addEventListener('pointerdown', freeze, true)
    document.addEventListener('click', freeze, true)
    return () => {
      document.removeEventListener('pointerdown', freeze, true)
      document.removeEventListener('click', freeze, true)
    }
  }, [])

  useLayoutEffect(() => {
    const html = document.documentElement
    const prevKey = prevKeyRef.current
    const nextKey = location.key
    const nextPath = location.pathname + location.search + location.hash

    if (prevKey !== nextKey) {
      const record = {
        ...(frozenRef.current || scrollRef.current),
        path: prevPathRef.current,
      }
      writeRecord(prevKey, record)
      frozenRef.current = null
      prevKeyRef.current = nextKey
      prevPathRef.current = nextPath
    } else {
      prevPathRef.current = nextPath
    }

    if (navigationType === 'POP') {
      const record = readRecord(nextKey)
      // Ignore stale "default" key records from a different route (full page loads
      // reuse React Router's "default" key across documents).
      if (!record || (record.path && record.path !== nextPath)) {
        if (!location.hash) {
          instantScroll(0)
          scrollRef.current = captureScroll()
        }
        return undefined
      }

      const apply = () => {
        const needed = record.y + window.innerHeight
        if (html.scrollHeight < needed) {
          html.style.minHeight = `${needed}px`
        }

        instantScroll(record.y)

        if (record.anchorId && typeof record.anchorTop === 'number') {
          const el = document.getElementById(record.anchorId)
          if (el) {
            const currentTop = el.getBoundingClientRect().top
            const delta = currentTop - record.anchorTop
            if (Math.abs(delta) > 1) {
              instantScroll(window.scrollY + delta)
            }
          }
        }

        scrollRef.current = {
          y: Math.round(window.scrollY),
          anchorId: record.anchorId,
          anchorTop: record.anchorTop,
          path: nextPath,
        }
      }

      apply()

      let frames = 0
      let rafId = 0
      const tick = () => {
        apply()
        frames += 1
        if (frames < 45) {
          rafId = window.requestAnimationFrame(tick)
        }
      }
      rafId = window.requestAnimationFrame(tick)

      const ro = new ResizeObserver(() => apply())
      ro.observe(html)

      const safety = window.setTimeout(() => {
        apply()
        if (html.scrollHeight >= record.y + window.innerHeight - 1) {
          html.style.minHeight = ''
        }
        ro.disconnect()
        window.cancelAnimationFrame(rafId)
      }, 2000)

      return () => {
        window.clearTimeout(safety)
        window.cancelAnimationFrame(rafId)
        ro.disconnect()
        html.style.minHeight = ''
      }
    }

    if (!location.hash) {
      html.style.minHeight = ''
      instantScroll(0)
      scrollRef.current = captureScroll()
    }

    return undefined
  }, [location.key, location.hash, location.pathname, location.search, navigationType])

  return null
}
