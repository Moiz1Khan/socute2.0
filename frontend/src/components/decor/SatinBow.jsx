/**
 * Glossy dimensional satin bow — primary brand decoration.
 */
export function SatinBow({ className = 'h-10 w-14', opacity = 1 }) {
  return (
    <svg
      viewBox="0 0 140 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ opacity }}
      aria-hidden
    >
      <defs>
        <linearGradient id="bowLoop" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFE4EF" />
          <stop offset="40%" stopColor="#F5B5CF" />
          <stop offset="100%" stopColor="#E77DA8" />
        </linearGradient>
        <linearGradient id="bowKnot" x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor="#FADCE8" />
          <stop offset="100%" stopColor="#E77DA8" />
        </linearGradient>
        <linearGradient id="bowTail" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F5B5CF" />
          <stop offset="100%" stopColor="#E77DA8" />
        </linearGradient>
      </defs>
      {/* Left loop */}
      <path
        d="M70 44C52 22 28 16 16 28c-11 11-4 28 14 34 10 3 22-1 30-10 2-2 5-5 10-8z"
        fill="url(#bowLoop)"
      />
      {/* Right loop */}
      <path
        d="M70 44c18-22 42-28 54-16 11 11 4 28-14 34-10 3-22-1-30-10-2-2-5-5-10-8z"
        fill="url(#bowLoop)"
      />
      {/* Inner highlight loops */}
      <path
        d="M68 42c-12-14-28-18-38-10-8 7-3 18 10 22 8 2.5 17 0 23-7 1.5-2 3.5-3.5 5-5z"
        fill="#FFF7FA"
        opacity="0.35"
      />
      <path
        d="M72 42c12-14 28-18 38-10 8 7 3 18-10 22-8 2.5-17 0-23-7-1.5-2-3.5-3.5-5-5z"
        fill="#FFF7FA"
        opacity="0.28"
      />
      {/* Knot */}
      <ellipse cx="70" cy="44" rx="12" ry="13" fill="url(#bowKnot)" />
      <ellipse cx="70" cy="41" rx="6" ry="5" fill="#FFF7FA" opacity="0.45" />
      {/* Tails */}
      <path
        d="M64 54c-6 14-4 28 2 34 2-8 4-16 6-24-1-3-4-7-8-10z"
        fill="url(#bowTail)"
      />
      <path
        d="M76 54c6 14 4 28-2 34-2-8-4-16-6-24 1-3 4-7 8-10z"
        fill="url(#bowTail)"
      />
      {/* Pearls */}
      <circle cx="38" cy="34" r="2.2" fill="#FFF7FA" opacity="0.85" />
      <circle cx="102" cy="36" r="1.8" fill="#FFF7FA" opacity="0.7" />
    </svg>
  )
}
