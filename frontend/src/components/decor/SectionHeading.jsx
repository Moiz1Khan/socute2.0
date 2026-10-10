import { motion, useReducedMotion } from 'framer-motion'
import { SatinBow } from './SatinBow'
import { easeOut } from '../../utils/motionPresets'

function TinySparkle({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 1.5l1.4 7.1L20.5 10 13.4 11.4 12 18.5l-1.4-7.1L3.5 10l7.1-1.4L12 1.5z" />
    </svg>
  )
}

/**
 * Signature Socutesyyy section heading — serif title, handwritten eyebrow,
 * ribbon underline, optional floating bow accent.
 */
export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  align = 'center',
  showBow = true,
  className = '',
}) {
  const reduceMotion = useReducedMotion()
  const isLeft = align === 'left'

  return (
    <motion.header
      initial={reduceMotion ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px', amount: 0.3 }}
      transition={{ duration: 0.62, ease: easeOut }}
      className={`section-heading ${isLeft ? 'section-heading--left' : ''} ${className}`}
    >
      <div className="section-heading__eyebrow">
        <TinySparkle className="section-heading__spark" />
        <span className="font-hand">{eyebrow}</span>
        <TinySparkle className="section-heading__spark section-heading__spark--dim" />
      </div>

      <div className="section-heading__title-row">
        {showBow && (
          <motion.span
            className="section-heading__bow"
            aria-hidden
            animate={
              reduceMotion
                ? undefined
                : { y: [0, -4, 0], rotate: [-8, -4, -8] }
            }
            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <SatinBow className="h-7 w-10 sm:h-8 sm:w-12" opacity={0.9} />
          </motion.span>
        )}
        <h2 id={id} className="section-heading__title font-display">
          {title}
        </h2>
      </div>

      <div className="section-heading__ribbon" aria-hidden />

      {description && (
        <p className="section-heading__desc">{description}</p>
      )}
    </motion.header>
  )
}
