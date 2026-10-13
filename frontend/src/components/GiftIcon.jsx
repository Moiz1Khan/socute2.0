/**
 * Soft gift box mark for brand lockups (no bow decoration).
 */
export function GiftIcon({ className = 'h-10 w-10 shrink-0' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect x="6" y="14" width="36" height="11" rx="4" fill="#fdf0f5" />
      <rect x="8" y="23" width="32" height="26" rx="4" fill="#f6b6cc" />
      <path
        d="M15 31 Q18 34 21 31"
        stroke="#e66f98"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M27 31 Q30 34 33 31"
        stroke="#e66f98"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M17 37 Q24 42 31 37"
        stroke="#e66f98"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}
