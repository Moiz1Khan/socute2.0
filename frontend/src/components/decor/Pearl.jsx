/** Tiny gloss pearl accent — use sparingly near headings / cards */
export function Pearl({ className = 'h-2 w-2', style }) {
  return (
    <span
      className={`inline-block rounded-full bg-gradient-to-br from-[#fffcfd] via-[#f6b6cc] to-[#e66f98] shadow-[0_0_6px_rgba(230, 111, 152, 0.45)] ${className}`}
      style={style}
      aria-hidden
    />
  )
}
