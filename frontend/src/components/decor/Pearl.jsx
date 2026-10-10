/** Tiny gloss pearl accent — use sparingly near headings / cards */
export function Pearl({ className = 'h-2 w-2', style }) {
  return (
    <span
      className={`inline-block rounded-full bg-gradient-to-br from-[#fff7fa] via-[#f5b5cf] to-[#e77da8] shadow-[0_0_6px_rgba(231,125,168,0.45)] ${className}`}
      style={style}
      aria-hidden
    />
  )
}
