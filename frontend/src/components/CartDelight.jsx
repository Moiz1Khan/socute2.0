import { useEffect } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { useCart } from '../context/CartContext'
import { SatinBow } from './decor/SatinBow'
import { easeOut, springSnappy } from '../utils/motionPresets'

/**
 * Tiny heart/bow toast after a successful add-to-cart.
 * Only appears when CartContext reports a real lastAdded item.
 */
export function CartDelight() {
  const { lastAdded, clearLastAdded } = useCart()
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!lastAdded) return
    const t = setTimeout(() => clearLastAdded(), reduceMotion ? 1100 : 2000)
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
              : { opacity: 0, y: 22, scale: 0.88 }
          }
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={
            reduceMotion
              ? { opacity: 0 }
              : { opacity: 0, y: 10, scale: 0.94 }
          }
          transition={
            reduceMotion
              ? { duration: 0.2 }
              : { ...springSnappy, opacity: { duration: 0.28, ease: easeOut } }
          }
        >
          <motion.div
            animate={
              reduceMotion
                ? undefined
                : { rotate: [-8, -2, -8], y: [0, -3, 0] }
            }
            transition={{ duration: 1.6, ease: 'easeInOut' }}
          >
            <SatinBow className="cart-delight__bow" opacity={0.95} />
          </motion.div>
          <div className="min-w-0">
            <p className="cart-delight__label font-hand">
              omg it&apos;s in your cart ♡
            </p>
            <p className="cart-delight__name">{lastAdded.name}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
