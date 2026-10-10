import { useEffect, useRef, useState } from 'react'

const TRAIL_COUNT = 5
const INTERACTIVE =
  'a, button, [role="button"], label[for], summary, [data-cursor="interactive"]'
const PRODUCT_TARGETS =
  'a[href*="/product"], [data-cursor="product"]'
const TEXT_TARGETS =
  'input, textarea, select, [contenteditable="true"], [contenteditable=""], [data-cursor="text"]'

function prefersFinePointer() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches
  )
}

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function CursorBow() {
  return (
    <svg
      className="boutique-cursor__bow"
      viewBox="0 0 40 28"
      width="22"
      height="16"
      aria-hidden
    >
      <defs>
        <linearGradient id="cursorBowLoop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFE4EF" />
          <stop offset="45%" stopColor="#F5B5CF" />
          <stop offset="100%" stopColor="#E77DA8" />
        </linearGradient>
        <linearGradient id="cursorBowKnot" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#FADCE8" />
          <stop offset="100%" stopColor="#E77DA8" />
        </linearGradient>
        <filter id="cursorBowGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="0.9" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M20 13C14.5 6.5 8 4.5 4.5 7.5c-3 2.6-1.2 7.2 3.6 8.8 2.6.9 5.6-.2 7.6-2.5.6-.6 1.4-1.4 2.8-2.3z"
        fill="url(#cursorBowLoop)"
        filter="url(#cursorBowGlow)"
      />
      <path
        d="M20 13c5.5-6.5 12-8.5 15.5-5.5 3 2.6 1.2 7.2-3.6 8.8-2.6.9-5.6-.2-7.6-2.5-.6-.6-1.4-1.4-2.8-2.3z"
        fill="url(#cursorBowLoop)"
        filter="url(#cursorBowGlow)"
      />
      <path
        d="M19.4 12.4c-3.2-3.8-7.4-4.8-10-2.6-2.2 1.9-.8 4.8 2.6 5.8 2.1.6 4.5 0 6.1-1.9.4-.5.9-.9 1.3-1.3z"
        fill="#FFF7FA"
        opacity="0.4"
      />
      <path
        d="M20.6 12.4c3.2-3.8 7.4-4.8 10-2.6 2.2 1.9.8 4.8-2.6 5.8-2.1.6-4.5 0-6.1-1.9-.4-.5-.9-.9-1.3-1.3z"
        fill="#FFF7FA"
        opacity="0.32"
      />
      <ellipse cx="20" cy="13" rx="3.4" ry="3.6" fill="url(#cursorBowKnot)" />
      <ellipse cx="20" cy="12.2" rx="1.6" ry="1.3" fill="#FFF7FA" opacity="0.55" />
      <path
        d="M18.4 15.6c-1.5 3.6-1 7.2.5 8.8.5-2 .9-4 1.5-6.2-.3-.8-1.1-1.8-2-2.6z"
        fill="#E77DA8"
        opacity="0.9"
      />
      <path
        d="M21.6 15.6c1.5 3.6 1 7.2-.5 8.8-.5-2-.9-4-1.5-6.2.3-.8 1.1-1.8 2-2.6z"
        fill="#E77DA8"
        opacity="0.9"
      />
    </svg>
  )
}

/**
 * Signature Socutesyyy cursor — tiny satin bow + soft pink sparkle trail.
 * Fine-pointer only; disabled on touch and reduced-motion.
 */
export function BoutiqueCursor() {
  const [enabled, setEnabled] = useState(false)
  const rootRef = useRef(null)
  const bowRef = useRef(null)
  const trailRefs = useRef([])
  const pos = useRef({ x: -100, y: -100 })
  const render = useRef({ x: -100, y: -100 })
  const trail = useRef(
    Array.from({ length: TRAIL_COUNT }, () => ({ x: -100, y: -100, o: 0 })),
  )
  const mode = useRef('default')
  const visible = useRef(false)
  const raf = useRef(0)

  useEffect(() => {
    const fine = prefersFinePointer()
    const reduce = prefersReducedMotion()
    if (!fine || reduce) return undefined

    setEnabled(true)
    document.documentElement.classList.add('boutique-cursor-on')

    const resolveMode = (target) => {
      if (!(target instanceof Element)) return 'default'
      if (target.closest(TEXT_TARGETS)) return 'text'
      if (target.closest(PRODUCT_TARGETS)) return 'product'
      if (target.closest(INTERACTIVE)) return 'active'
      return 'default'
    }

    const onMove = (e) => {
      pos.current.x = e.clientX
      pos.current.y = e.clientY
      visible.current = true
      const under =
        document.elementFromPoint(e.clientX, e.clientY) || e.target
      mode.current = resolveMode(under)
    }

    const onLeave = () => {
      visible.current = false
      mode.current = 'default'
    }

    const onOver = (e) => {
      mode.current = resolveMode(e.target)
    }

    const tick = () => {
      const ease = 0.28
      render.current.x += (pos.current.x - render.current.x) * ease
      render.current.y += (pos.current.y - render.current.y) * ease

      const bow = bowRef.current
      const root = rootRef.current
      if (bow && root) {
        const isText = mode.current === 'text'
        const isActive = mode.current === 'active'
        const isProduct = mode.current === 'product'
        const show = visible.current && !isText

        root.dataset.mode = mode.current
        root.dataset.visible = show ? 'true' : 'false'
        bow.style.transform = `translate3d(${render.current.x}px, ${render.current.y}px, 0) translate(-40%, -35%) scale(${
          isActive ? 1.18 : isProduct ? 1.1 : 1
        })`
      }

      let prevX = render.current.x
      let prevY = render.current.y
      for (let i = 0; i < TRAIL_COUNT; i += 1) {
        const point = trail.current[i]
        const lag = 0.18 - i * 0.02
        point.x += (prevX - point.x) * lag
        point.y += (prevY - point.y) * lag
        point.o = visible.current && mode.current !== 'text' ? 0.42 - i * 0.07 : 0
        prevX = point.x
        prevY = point.y

        const el = trailRefs.current[i]
        if (el) {
          const size = 7 - i * 0.8
          el.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) translate(-50%, -50%)`
          el.style.width = `${size}px`
          el.style.height = `${size}px`
          el.style.opacity = String(Math.max(0, point.o))
        }
      }

      raf.current = requestAnimationFrame(tick)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerover', onOver, { passive: true })
    document.addEventListener('mouseleave', onLeave)
    window.addEventListener('blur', onLeave)
    raf.current = requestAnimationFrame(tick)

    const mqFine = window.matchMedia('(hover: hover) and (pointer: fine)')
    const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncMedia = () => {
      if (!mqFine.matches || mqReduce.matches) {
        setEnabled(false)
        document.documentElement.classList.remove('boutique-cursor-on')
      }
    }
    mqFine.addEventListener?.('change', syncMedia)
    mqReduce.addEventListener?.('change', syncMedia)

    return () => {
      cancelAnimationFrame(raf.current)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerover', onOver)
      document.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('blur', onLeave)
      mqFine.removeEventListener?.('change', syncMedia)
      mqReduce.removeEventListener?.('change', syncMedia)
      document.documentElement.classList.remove('boutique-cursor-on')
    }
  }, [])

  if (!enabled) return null

  return (
    <div
      ref={rootRef}
      className="boutique-cursor"
      aria-hidden
      data-visible="false"
      data-mode="default"
    >
      {Array.from({ length: TRAIL_COUNT }, (_, i) => (
        <span
          key={i}
          ref={(el) => {
            trailRefs.current[i] = el
          }}
          className="boutique-cursor__spark"
        />
      ))}
      <div ref={bowRef} className="boutique-cursor__tip">
        <span className="boutique-cursor__glow" />
        <CursorBow />
      </div>
    </div>
  )
}
