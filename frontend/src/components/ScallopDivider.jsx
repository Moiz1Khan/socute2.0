/** Soft paper-edge scallop between major sections */
export function ScallopDivider({ fill = '#FFF7FA', flip = false, className = '' }) {
  return (
    <div
      className={`pointer-events-none relative z-[2] -mt-px leading-[0] ${flip ? 'rotate-180' : ''} ${className}`}
      aria-hidden
    >
      <svg viewBox="0 0 1440 28" preserveAspectRatio="none" className="block h-5 w-full sm:h-6">
        <path
          d="M0,14 Q30,28 60,14 T120,14 T180,14 T240,14 T300,14 T360,14 T420,14 T480,14 T540,14 T600,14 T660,14 T720,14 T780,14 T840,14 T900,14 T960,14 T1020,14 T1080,14 T1140,14 T1200,14 T1260,14 T1320,14 T1380,14 T1440,14 L1440,28 L0,28 Z"
          fill={fill}
        />
      </svg>
    </div>
  )
}
