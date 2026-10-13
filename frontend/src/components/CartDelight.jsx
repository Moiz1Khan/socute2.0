import { useEffect } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { easeOut, springSoft } from '../utils/motionPresets'

/**
 * Toast after a successful add-to-cart.
 * Only appears when CartContext reports a real lastAdded item.
 */
export function CartDelight() {
  const { lastAdded, clearLastAdded } = useCart()
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!lastAdded) return
    const t = setTimeout(() => clearLastAdded(), reduceMotion ? 1200 : 2200)
    return () => clearTimeout(t)
  }, [lastAdded, clearLastAdded, reduceMotion])

  return (
    <AnimatePresence>
      {lastAdded && (
        <motion.div
          key={lastAdded.at}
          role="status"
          aria-live="polite"
          className="cart-delight"
          initial={
            reduceMotion
              ? { opacity: 0 }
              : { opacity: 0, y: 12 }
          }
          animate={{ opacity: 1, y: 0 }}
          exit={
            reduceMotion
              ? { opacity: 0 }
              : { opacity: 0, y: 6 }
          }
          transition={
            reduceMotion
              ? { duration: 0.18 }
              : { ...springSoft, opacity: { duration: 0.22, ease: easeOut } }
          }
        >
          <div className="min-w-0">
            <p className="cart-delight__label">Added to cart</p>
            <p className="cart-delight__name">{lastAdded.name}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
