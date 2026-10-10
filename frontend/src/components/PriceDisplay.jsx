/**
 * Shows a formatted RS. price with optional label.
 */
export function PriceDisplay({ amount, className = '' }) {
  const n = typeof amount === 'number' && !Number.isNaN(amount) ? amount : 0
  return (
    <p
      className={`font-price tabular-nums text-[#a85c7b] ${className}`}
      aria-live="polite"
      aria-label={`Price RS. ${n.toLocaleString()}`}
    >
      <span className="text-[#e77da8]/90">RS. </span>
      <span className="text-2xl text-[#704456] sm:text-3xl">
        {n.toLocaleString()}
      </span>
    </p>
  )
}
