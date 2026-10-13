import { useEffect, useId, useRef, useState } from 'react'
import { IconCheck } from './icons'

/**
 * Custom dropdown (replaces native select) — pink palette, full control over focus/hover.
 * Selected row: same pink gradient as “Add to cart” — keep in sync with ProductDetail primary CTA.
 */
export function ShopSelect({ value, options, onChange, disabled = false }) {
  const id = useId()
  const listId = `${id}-list`
  const rootRef = useRef(null)
  const triggerRef = useRef(null)
  const [open, setOpen] = useState(false)

  const safeIndex =
    typeof value === 'number' && value >= 0 && value < options.length
      ? value
      : 0
  const currentLabel = options[safeIndex] ?? ''

  useEffect(() => {
    if (!open) return
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const closeAndFocusTrigger = () => {
    setOpen(false)
    requestAnimationFrame(() => triggerRef.current?.focus())
  }

  const pick = (i) => {
    onChange(i)
    closeAndFocusTrigger()
  }

  return (
    <div ref={rootRef} className="relative mt-1">
      <button
        ref={triggerRef}
        type="button"
        id={id}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => !disabled && setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 rounded-2xl border border-[#f6b6cc] bg-[#fffcfd] px-4 py-3 text-left text-sm font-medium text-[#493c43] shadow-sm outline-none transition hover:border-[#f6b6cc] focus-visible:border-[#f6b6cc] focus-visible:ring-2 focus-visible:ring-[#f6b6cc] disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className="min-w-0 truncate">{currentLabel}</span>
        <span
          className={`shrink-0 text-[#e66f98] transition ${open ? 'rotate-180' : ''}`}
          aria-hidden
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>

      {open && (
        <ul
          id={listId}
          role="listbox"
          aria-labelledby={id}
          className="absolute left-0 right-0 top-[calc(100%+4px)] z-50 max-h-60 overflow-auto rounded-2xl border border-[#f6b6cc] bg-[#fffcfd] py-1 shadow-lg shadow-[rgba(73,60,67,0.10)]"
        >
          {options.map((opt, i) => {
            const selected = i === safeIndex
            return (
              <li key={`${opt}-${i}`} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={selected}
                  className={`flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-sm font-medium outline-none transition ${
                    selected
                      ? 'bg-gradient-to-r from-[#e66f98] to-[#e66f98] text-white shadow-sm shadow-[rgba(73,60,67,0.10)] focus-visible:brightness-105 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/40'
                      : 'text-[#493c43] hover:bg-[#fdf0f5]/60 focus-visible:bg-[#fdf0f5] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#f6b6cc]'
                  }`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pick(i)}
                >
                  <span className="min-w-0">{opt}</span>
                  {selected && (
                    <IconCheck className="h-4 w-4 shrink-0 text-white" />
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
