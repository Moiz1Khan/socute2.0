import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { GiftIcon } from './GiftIcon'
import { SatinBow } from './decor/SatinBow'

const MotionLink = motion.create(Link)
import { IconCart, IconMenu, IconClose } from './icons'
import { useCart } from '../context/CartContext'
import { useShop } from '../context/ShopContext'
import { categories } from '../utils/products'
import { useOrderFlow } from '../context/OrderFlowContext'

export function ShopHeader() {
  const { count } = useCart()
  const { categoryFilter, setCategoryFilter } = useShop()
  const navigate = useNavigate()
  const [cartOpen, setCartOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToId = (id, top = false) => {
    setTimeout(() => {
      if (top) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        document
          .getElementById(id)
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 60)
  }

  const goHome = () => {
    setCategoryFilter(null)
    setMobileNavOpen(false)
    // Keep RR from jumping to top before our intentional scroll
    navigate('/', { preventScrollReset: true })
    scrollToId(null, true)
  }

  const goShopAll = () => {
    setCategoryFilter(null)
    setMobileNavOpen(false)
    navigate('/', { preventScrollReset: true })
    scrollToId('products-top')
  }

  const goCategory = (id) => {
    setCategoryFilter(id)
    setMobileNavOpen(false)
    navigate('/', { preventScrollReset: true })
    scrollToId(`section-${id}`)
  }

  const navLinks = [
    { key: 'home', label: 'Home', onClick: goHome, active: false },
    {
      key: 'all',
      label: 'Shop All',
      onClick: goShopAll,
      active: categoryFilter == null,
    },
    ...categories.map((c) => ({
      key: c.id,
      label: c.title,
      onClick: () => goCategory(c.id),
      active: categoryFilter === c.id,
    })),
  ]

  return (
    <header className={`shop-nav sticky top-0 z-50 transition-[box-shadow,padding] duration-300 ${scrolled ? 'shop-nav--scrolled' : ''}`}>
      <span className="shop-nav__pearl" aria-hidden />
      <div className="shop-nav__bar mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 sm:gap-4 sm:px-6 sm:py-3">
        <div className="flex min-w-0 shrink items-center gap-2 sm:gap-3">
          <MotionLink
            to="/"
            aria-label="socutesyyy gift shop — home"
            initial={false}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            onClick={() => setCategoryFilter(null)}
            className="shop-nav__logo group inline-flex h-11 w-fit max-w-full items-center gap-2.5 rounded-2xl px-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e77da8] sm:h-12 sm:gap-3 sm:px-3.5"
          >
            <SatinBow className="hidden h-7 w-10 shrink-0 sm:block" opacity={0.95} />
            <motion.span
              className="inline-flex shrink-0"
              whileHover={{ rotate: [0, -8, 6, 0] }}
              transition={{ duration: 0.55 }}
            >
              <GiftIcon className="h-8 w-8 shrink-0 sm:h-9 sm:w-9" />
            </motion.span>
            <div className="min-w-0">
              <p className="truncate font-logo-wordmark text-xl lowercase leading-tight text-[#e77da8] sm:text-2xl">
                socutesyyy
              </p>
              <p className="mt-0.5 truncate text-[10px] font-semibold uppercase tracking-[0.32em] text-[#704456]/70 sm:text-xs">
                GIFT SHOP
              </p>
            </div>
          </MotionLink>
        </div>

        <nav className="hidden flex-1 items-center justify-center lg:flex" aria-label="Main">
          <div className="shop-nav__links flex items-center gap-0.5 px-1.5 py-1">
            {navLinks.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={item.onClick}
                className={`shop-nav__link ${item.active ? 'shop-nav__link--active' : ''}`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-3">
          <motion.button
            type="button"
            onClick={() => setCartOpen((o) => !o)}
            whileHover={{ y: -1, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="shop-nav__cart relative flex h-11 items-center gap-2 rounded-xl px-3.5 font-semibold text-white sm:h-12 sm:px-4"
          >
            <IconCart className="h-5 w-5" />
            <span className="hidden sm:inline">Cart</span>
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0.35, opacity: 0, y: 4 }}
                  animate={{ scale: [0.35, 1.18, 1], opacity: 1, y: 0 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 520, damping: 16 }}
                  className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#704456] px-1 text-[10px] font-bold text-[#fff7fa]"
                >
                  {count > 99 ? '99+' : count}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>

          <button
            type="button"
            onClick={() => setMobileNavOpen((o) => !o)}
            className="shop-nav__menu-btn flex h-11 w-11 items-center justify-center rounded-xl text-[#704456] sm:h-12 sm:w-12 lg:hidden"
            aria-expanded={mobileNavOpen}
            aria-label="Menu"
          >
            {mobileNavOpen ? (
              <IconClose className="h-5 w-5" />
            ) : (
              <IconMenu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileNavOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="shop-nav__mobile overflow-hidden lg:hidden"
          >
            <div className="mx-auto flex max-w-6xl flex-col gap-1.5 px-4 py-4 sm:px-6">
              {navLinks.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={item.onClick}
                  className={`rounded-2xl px-4 py-3.5 text-left text-sm font-semibold transition ${
                    item.active
                      ? 'bg-gradient-to-r from-[#f5b5cf] to-[#e77da8] text-white shadow-md'
                      : 'bg-[#ffe4ef]/80 text-[#704456] hover:bg-[#fadce8]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>

      <CartPopover open={cartOpen} onClose={() => setCartOpen(false)} />
    </header>
  )
}

function CartPopover({ open, onClose }) {
  const navigate = useNavigate()
  const { setCheckoutFromCart } = useOrderFlow()
  const { items, removeLine, updateLineQty, subtotal } = useCart()

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-[#704456]/25 backdrop-blur-[2px]"
            aria-label="Close cart"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="fixed right-4 top-[6.25rem] z-50 max-h-[70vh] w-[min(100vw-2rem,22rem)] overflow-auto rounded-2xl border border-[#f5b5cf] bg-gradient-to-b from-[#fff7fa] to-[#fff0f6] p-4 shadow-xl shadow-[#e77da8]/20 sm:right-6"
          >
            <p className="font-display text-xl font-semibold text-[#704456]">Your cart</p>
            {items.length === 0 ? (
              <div className="mt-5 rounded-2xl border border-dashed border-[#f5b5cf] bg-[#fff7fa] px-4 py-8 text-center">
                <p className="font-script text-xl text-[#e77da8]">still empty ♡</p>
                <p className="mt-2 text-sm text-[#8a5a6e]">
                  Add something pretty from the shop.
                </p>
                <button
                  type="button"
                  className="mt-4 text-sm font-semibold text-[#e77da8] underline-offset-2 hover:underline"
                  onClick={() => {
                    onClose()
                    navigate('/', { preventScrollReset: true })
                    setTimeout(() => {
                      document
                        .getElementById('products-top')
                        ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }, 60)
                  }}
                >
                  Browse gifts →
                </button>
              </div>
            ) : (
              <>
                <ul className="mt-3 space-y-3">
                  {items.map((line) => (
                    <li
                      key={line.lineId}
                      className="flex items-start gap-3 border-b border-[#fadce8] pb-3 text-sm"
                    >
                      <Link
                        to={`/product/${line.slug}`}
                        onClick={onClose}
                        className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[#f5b5cf] bg-[#fadce8]"
                      >
                        {line.image ? (
                          <img
                            src={line.image}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="flex h-full w-full items-center justify-center text-[10px] text-[#a85c7b]">
                            gift
                          </span>
                        )}
                      </Link>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-[#704456]">{line.name}</p>
                        <p className="line-clamp-2 text-xs text-[#8a5a6e]">{line.summary}</p>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <div className="inline-flex items-center rounded-lg border border-[#f5b5cf] bg-[#fff7fa]">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              className="px-2 py-1 text-sm font-semibold text-[#704456] hover:bg-[#fff0f6] disabled:opacity-40"
                              disabled={line.qty <= 1}
                              onClick={() => updateLineQty(line.lineId, -1)}
                            >
                              −
                            </button>
                            <span className="min-w-[1.5rem] px-1 text-center text-sm font-semibold tabular-nums text-[#704456]">
                              {line.qty}
                            </span>
                            <button
                              type="button"
                              aria-label="Increase quantity"
                              className="px-2 py-1 text-sm font-semibold text-[#704456] hover:bg-[#fff0f6] disabled:opacity-40"
                              disabled={line.qty >= 99}
                              onClick={() => updateLineQty(line.lineId, 1)}
                            >
                              +
                            </button>
                          </div>
                          <span className="font-price text-xs tabular-nums text-[#e77da8]">
                            RS. {(line.unitPrice * line.qty).toLocaleString()}
                          </span>
                        </div>
                        <Link
                          to={`/product/${line.slug}`}
                          className="mt-1 inline-block text-xs font-medium text-[#e77da8]"
                          onClick={onClose}
                        >
                          View product
                        </Link>
                      </div>
                      <button
                        type="button"
                        className="text-xs text-[#8a5a6e] transition hover:text-[#e77da8]"
                        onClick={() => removeLine(line.lineId)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex items-center justify-between border-t border-[#fadce8] pt-3">
                  <span className="text-sm font-medium text-[#8a5a6e]">Subtotal</span>
                  <span className="font-price text-base tabular-nums text-[#704456]">
                    RS. {subtotal.toLocaleString()}
                  </span>
                </div>
              </>
            )}
            <button
              type="button"
              disabled={items.length === 0}
              className="btn-candy mt-4 w-full py-3 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => {
                if (items.length === 0) return
                setCheckoutFromCart(items)
                navigate('/checkout/customer', { state: { cartItems: items } })
                onClose()
              }}
            >
              Checkout
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
