import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { SatinBow } from './decor/SatinBow'

const INTRO_SESSION_KEY = 'socutesyyy:gift-intro-seen'

/**
 * Lightweight, skippable gift-inspired reveal on first visit per tab session.
 * Never blocks content if reduced-motion is on.
 * Skipped on later mounts so back-navigation scroll restore stays visible.
 */
export function SoftGiftIntro() {
  const reduceMotion = useReducedMotion()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (reduceMotion) return
    try {
      if (sessionStorage.getItem(INTRO_SESSION_KEY)) return
      sessionStorage.setItem(INTRO_SESSION_KEY, '1')
    } catch {
      /* private mode */
    }
    setShow(true)
    const auto = setTimeout(() => setShow(false), 1400)
    return () => clearTimeout(auto)
  }, [reduceMotion])

  const dismiss = () => setShow(false)

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="gift-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          role="dialog"
          aria-label="Welcome to Socutesyyy"
        >
          <button type="button" className="gift-intro__skip" onClick={dismiss}>
            Skip
          </button>
          <motion.div
            className="gift-intro__card"
            initial={{ opacity: 0, scale: 0.88, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              animate={{ y: [0, -6, 0], rotate: [-6, -2, -6] }}
              transition={{ duration: 1.4, ease: 'easeInOut' }}
            >
              <SatinBow className="h-14 w-20 sm:h-16 sm:w-24" />
            </motion.div>
            <p className="gift-intro__brand font-logo-wordmark">socutesyyy</p>
            <p className="gift-intro__hand font-script">heyyy cutie… welcome in ♡</p>
            <p className="gift-intro__sub">it&apos;s about to get so soft</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
