import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const CartContext = createContext(null)
const CART_STORAGE_KEY = 'socutesyyy:cart-v1'

function lineKey(productId, summary) {
  return `${productId}::${summary}`
}

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (x) =>
        x &&
        typeof x.lineId === 'string' &&
        typeof x.productId === 'string' &&
        typeof x.name === 'string' &&
        typeof x.slug === 'string' &&
        typeof x.unitPrice === 'number',
    )
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => loadCart())
  const [lastAdded, setLastAdded] = useState(null)

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch {
      /* private mode */
    }
  }, [items])

  const clampQty = (n) =>
    Math.max(1, Math.min(99, Math.floor(Number(n)) || 1))

  const addToCart = useCallback(
    ({ productId, name, slug, unitPrice, summary, qty: addQty = 1, image }) => {
      const key = lineKey(productId, summary)
      const q = clampQty(addQty)
      setItems((prev) => {
        const i = prev.findIndex((x) => x.lineId === key)
        if (i >= 0) {
          const next = [...prev]
          next[i] = {
            ...next[i],
            qty: clampQty(next[i].qty + q),
            image: next[i].image || image || null,
          }
          return next
        }
        return [
          ...prev,
          {
            lineId: key,
            productId,
            name,
            slug,
            unitPrice,
            summary,
            qty: q,
            image: image || null,
          },
        ]
      })
      setLastAdded({ name, at: Date.now() })
    },
    [],
  )

  const clearLastAdded = useCallback(() => setLastAdded(null), [])

  const updateLineQty = useCallback((lineId, delta) => {
    setItems((prev) =>
      prev.map((x) => {
        if (x.lineId !== lineId) return x
        return { ...x, qty: clampQty(x.qty + delta) }
      }),
    )
  }, [])

  const removeLine = useCallback((lineId) => {
    setItems((prev) => prev.filter((x) => x.lineId !== lineId))
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const count = useMemo(
    () => items.reduce((s, x) => s + x.qty, 0),
    [items],
  )

  const subtotal = useMemo(
    () => items.reduce((s, x) => s + x.unitPrice * x.qty, 0),
    [items],
  )

  const value = useMemo(
    () => ({
      items,
      addToCart,
      updateLineQty,
      removeLine,
      clearCart,
      count,
      subtotal,
      lastAdded,
      clearLastAdded,
    }),
    [
      items,
      addToCart,
      updateLineQty,
      removeLine,
      clearCart,
      count,
      subtotal,
      lastAdded,
      clearLastAdded,
    ],
  )

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
