import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { IconBag, IconMenu, IconClose, IconSearch } from './icons'
import { useCart } from '../context/CartContext'
import { useShop } from '../context/ShopContext'
import { categories } from '../utils/products'
import { getCategoryLabel } from '../utils/shopConfig'
import { useOrderFlow } from '../context/OrderFlowContext'
import { whatsappLink } from '../utils/whatsapp'

const CONTACT_HREF = whatsappLink('Hi SoCutesy! I have a question.')

export function ShopHeader() {
  const { count } = useCart()
  const {
    categoryFilter,
    searchQuery,
    setSearchQuery,
    clearSearch,
    setCategoryFilter,
    setSlugFilter,
    setFilterLabel,
    clearProductFilters,
  } = useShop()
  const navigate = useNavigate()
  const location = useLocation()
  const reduceMotion = useReducedMotion()
  const [cartOpen, setCartOpen] = useState(false)
  const [mobileNavOpen, setMobileNavOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [shopOpen, setShopOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const searchRef = useRef(null)
  const shopRef = useRef(null)

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 8)
        ticking = false
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!mobileNavOpen) return
    const onKey = (e) => {
      if (e.key === 'Escape') setMobileNavOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [mobileNavOpen])

  useEffect(() => {
    if (!searchOpen) return
    searchRef.current?.focus()
  }, [searchOpen])

  useEffect(() => {
    if (!shopOpen) return
    const onDoc = (e) => {
      if (!shopRef.current?.contains(e.target)) setShopOpen(false)
    }
    document.addEventListener('pointerdown', onDoc)
    return () => document.removeEventListener('pointerdown', onDoc)
  }, [shopOpen])

  const goListing = (hash = '', { clearFilters = false, replace = false } = {}) => {
    if (clearFilters) clearProductFilters()
    setMobileNavOpen(false)
    setShopOpen(false)
    const normalized = hash
      ? hash.startsWith('#')
        ? hash
        : `#${hash}`
      : ''
    navigate(
      {
        pathname: '/',
        search: location.search,
        hash: normalized,
      },
      { preventScrollReset: true, replace },
    )
  }

  const goHome = () => {
    clearProductFilters()
    clearSearch()
    setMobileNavOpen(false)
    setShopOpen(false)
    navigate({ pathname: '/', search: '', hash: '' })
  }

  const goShopAll = () => {
    goListing('products-top', { clearFilters: true })
  }

  const goCategory = (id) => {
    clearProductFilters()
    setCategoryFilter(id)
    setFilterLabel(getCategoryLabel(id))
    goListing(`section-${id}`)
  }

  const goCategories = () => {
    goListing('products-top')
  }

  const openSearch = () => {
    setSearchOpen(true)
    setCartOpen(false)
  }

  const submitSearch = (e) => {
    e?.preventDefault()
    setSlugFilter(null)
    setMobileNavOpen(false)
    const trimmed = searchQuery.trim()
    navigate(
      {
        pathname: '/',
        search: trimmed ? `?q=${encodeURIComponent(trimmed)}` : '',
        hash: '#products-top',
      },
      { preventScrollReset: true },
    )
  }

  const goFaqs = () => {
    goListing('faqs')
  }

  const mobileLinks = [
    { key: 'home', label: 'Home', onClick: goHome },
    { key: 'all', label: 'Shop All', onClick: goShopAll },
    { key: 'categories', label: 'Categories', onClick: goCategories },
    ...categories.map((c) => ({
      key: c.id,
      label: getCategoryLabel(c.id),
      onClick: () => goCategory(c.id),
      active: categoryFilter === c.id,
    })),
    { key: 'faqs', label: 'FAQs', onClick: goFaqs },
  ]

  return (
    <header
      className={`shop-nav sticky top-0 z-50 ${scrolled ? 'shop-nav--scrolled' : ''}`}
    >
      <div className="shop-nav__bar">
        <Link
          to="/"
          aria-label="SoCutesy gift shop — home"
          onClick={() => {
            clearProductFilters()
            clearSearch()
          }}
          className="shop-nav__brand"
        >
          <img
            src="/logo-socutesy.png"
            alt="SoCutesy"
            className="shop-nav__logo"
            width={112}
            height={112}
            decoding="async"
          />
        </Link>

        <nav className="shop-nav__desktop" aria-label="Main">
          <ul className="shop-nav__list">
            <li>
              <button type="button" onClick={goHome} className="shop-nav__link">
                Home
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={goShopAll}
                className={`shop-nav__link ${!categoryFilter ? 'shop-nav__link--active' : ''}`}
              >
                Shop All
              </button>
            </li>
            <li className="shop-nav__shop" ref={shopRef}>
              <button
                type="button"
                className={`shop-nav__link ${categoryFilter ? 'shop-nav__link--active' : ''}`}
                aria-expanded={shopOpen}
                aria-haspopup="true"
                onClick={() => setShopOpen((o) => !o)}
              >
                Shop by Category
              </button>
              {shopOpen && (
                <div className="shop-nav__mega" role="menu">
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      role="menuitem"
                      className="shop-nav__mega-item"
                      onClick={() => goCategory(c.id)}
                    >
                      {getCategoryLabel(c.id)}
                    </button>
                  ))}
                </div>
              )}
            </li>
            <li>
              <button type="button" className="shop-nav__link" onClick={goFaqs}>
                FAQs
              </button>
            </li>
            {CONTACT_HREF ? (
              <li>
                <a
                  href={CONTACT_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shop-nav__link shop-nav__link--a"
                >
                  Contact
                </a>
              </li>
            ) : null}
          </ul>
        </nav>

        <div className="shop-nav__actions shop-nav__actions--bar">
          <AnimatePresence initial={false}>
            {searchOpen && (
              <motion.form
                key="search"
                initial={reduceMotion ? false : { opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'min(14rem, 42vw)' }}
                exit={reduceMotion ? undefined : { opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="shop-nav__search"
                onSubmit={submitSearch}
                role="search"
              >
                <input
                  ref={searchRef}
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search gifts…"
                  aria-label="Search gifts"
                  className="shop-nav__search-input"
                />
              </motion.form>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={() => (searchOpen ? submitSearch() : openSearch())}
            className="shop-nav__icon-btn"
            aria-label={searchOpen ? 'Search' : 'Open search'}
            aria-expanded={searchOpen}
          >
            <IconSearch className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={() => setCartOpen((o) => !o)}
            className={`shop-nav__bag ${cartOpen ? 'shop-nav__bag--open' : ''}`}
            aria-expanded={cartOpen}
            aria-label={count > 0 ? `Bag, ${count} items` : 'Bag'}
          >
            <IconBag className="shop-nav__bag-icon" />
            {count > 0 && (
              <span className="shop-nav__bag-count">
                {count > 99 ? '99+' : count}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileNavOpen((o) => !o)}
            className="shop-nav__menu-btn"
            aria-expanded={mobileNavOpen}
            aria-controls="shop-mobile-nav"
            aria-label={mobileNavOpen ? 'Close menu' : 'Open menu'}
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
            id="shop-mobile-nav"
            initial={reduceMotion ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={reduceMotion ? undefined : { opacity: 0, height: 0 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="shop-nav__mobile"
            aria-label="Mobile"
          >
            <form
              className="shop-nav__mobile-search"
              onSubmit={submitSearch}
              role="search"
            >
              <IconSearch className="h-4 w-4 shrink-0 opacity-60" />
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search gifts…"
                aria-label="Search gifts"
              />
            </form>
            <ul className="shop-nav__mobile-list">
              {mobileLinks.map((item) => (
                <li key={item.key}>
                  <button
                    type="button"
                    onClick={item.onClick}
                    className={`shop-nav__mobile-link ${
                      item.active ? 'shop-nav__mobile-link--active' : ''
                    }`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
              {CONTACT_HREF ? (
                <li>
                  <a
                    href={CONTACT_HREF}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shop-nav__mobile-link"
                    onClick={() => setMobileNavOpen(false)}
                  >
                    Contact
                  </a>
                </li>
              ) : null}
            </ul>
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
  const { items, removeLine, updateLineQty, subtotal, linePhotos } = useCart()
  const reduceMotion = useReducedMotion()

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0 }}
            className="shop-nav__cart-backdrop"
            aria-label="Close bag"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-label="Shopping bag"
            initial={reduceMotion ? false : { opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="shop-nav__cart-panel"
          >
            <div className="shop-nav__cart-head">
              <p className="shop-nav__cart-title">Your bag</p>
              <button
                type="button"
                className="shop-nav__cart-close"
                onClick={onClose}
                aria-label="Close bag"
              >
                <IconClose className="h-4 w-4" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="shop-nav__cart-empty">
                <p className="shop-nav__cart-empty-title">Your bag is empty</p>
                <p className="shop-nav__cart-empty-copy">
                  Browse the collection to find something special.
                </p>
                <button
                  type="button"
                  className="shop-nav__cart-browse"
                  onClick={() => {
                    onClose()
                    navigate(
                      { pathname: '/', hash: '#products-top' },
                      { preventScrollReset: true },
                    )
                  }}
                >
                  Browse the shop
                </button>
              </div>
            ) : (
              <>
                <ul className="shop-nav__cart-lines">
                  {items.map((line) => (
                    <li key={line.lineId} className="shop-nav__cart-line">
                      <Link
                        to={`/product/${line.slug}`}
                        onClick={onClose}
                        className="shop-nav__cart-thumb"
                      >
                        {line.image ? (
                          <img src={line.image} alt="" loading="lazy" />
                        ) : (
                          <span className="shop-nav__cart-thumb-fallback">
                            Item
                          </span>
                        )}
                      </Link>
                      <div className="shop-nav__cart-line-body">
                        <p className="shop-nav__cart-line-name">{line.name}</p>
                        <p className="shop-nav__cart-line-summary">
                          {line.summary}
                        </p>
                        <div className="shop-nav__cart-line-meta">
                          <div className="shop-nav__qty">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              disabled={line.qty <= 1}
                              onClick={() => updateLineQty(line.lineId, -1)}
                            >
                              −
                            </button>
                            <span>{line.qty}</span>
                            <button
                              type="button"
                              aria-label="Increase quantity"
                              disabled={line.qty >= 99}
                              onClick={() => updateLineQty(line.lineId, 1)}
                            >
                              +
                            </button>
                          </div>
                          <span className="shop-nav__cart-line-price">
                            RS. {(line.unitPrice * line.qty).toLocaleString()}
                          </span>
                        </div>
                        <Link
                          to={`/product/${line.slug}`}
                          className="shop-nav__cart-view"
                          onClick={onClose}
                        >
                          View product
                        </Link>
                      </div>
                      <button
                        type="button"
                        className="shop-nav__cart-remove"
                        onClick={() => removeLine(line.lineId)}
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="shop-nav__cart-subtotal">
                  <span>Subtotal</span>
                  <span>RS. {subtotal.toLocaleString()}</span>
                </div>
                <p className="shop-nav__cart-note">
                  Photo products keep pictures per item. WhatsApp customization
                  happens after you submit your order.
                </p>
              </>
            )}

            <button
              type="button"
              disabled={items.length === 0}
              className="shop-nav__checkout"
              onClick={() => {
                if (items.length === 0) return
                setCheckoutFromCart(items, linePhotos)
                navigate('/checkout/customer', {
                  state: { cartItems: items, linePhotos },
                })
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
