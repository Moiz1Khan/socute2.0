import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import {
  paperReveal,
  hoverStraighten,
  tapPress,
  staggerDelay,
} from '../utils/motionPresets'
import {
  getMinPrice,
  hasFixedPrice,
  defaultSelection,
  getPrice,
  getSelectionSummary,
} from '../utils/pricing'
import { getProductsByCategory } from '../utils/products'
import { useCart } from '../context/CartContext'
import { useShop } from '../context/ShopContext'
import { IconCartPlus } from './icons'
import { SectionHeading } from './decor/SectionHeading'

const CATEGORY_ID = 'stationery'

/** Soft paper tilts — straighten on hover */
const TILTS = [-1.8, 1.5, -1.2, 2]

function HeartDoodle({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  )
}

function SparkleDoodle({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2l1.2 6.3L19 10l-5.8 1.7L12 18l-1.2-6.3L5 10l5.8-1.7L12 2z" />
    </svg>
  )
}

function PrintableCard({ product, index, reduceMotion }) {
  const { addToCart } = useCart()
  const from = getMinPrice(product)
  const fixedPrice = hasFixedPrice(product)
  const tilt = TILTS[index % TILTS.length]

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const sel = defaultSelection(product)
    addToCart({
      productId: product.id,
      name: product.name,
      slug: product.slug,
      unitPrice: getPrice(product, sel),
      summary: getSelectionSummary(product, sel),
      qty: 1,
      image: product.image,
    })
  }

  return (
    <motion.article
      {...paperReveal(reduceMotion, staggerDelay(index, 0.08))}
      className="group/print flex w-full justify-center"
      data-cursor="product"
    >
      <motion.div
        className="product-press relative w-full max-w-[280px]"
        style={{ rotate: tilt }}
        whileHover={hoverStraighten(reduceMotion)}
        whileTap={tapPress(reduceMotion)}
      >
        {/* Soft corner bow / sparkle accents */}
        {index % 2 === 0 ? (
          <HeartDoodle className="pointer-events-none absolute -right-1 -top-1 z-20 h-3.5 w-3.5 text-[#F4A7BD] opacity-80" />
        ) : (
          <SparkleDoodle className="pointer-events-none absolute -left-0.5 -top-1 z-20 h-3 w-3 text-[#CE6684] opacity-70" />
        )}

        <div className="cute-card relative overflow-hidden rounded-[1.35rem] border border-[#f5b5cf] bg-gradient-to-b from-[#ffe4ef] to-[#fadce8] shadow-[0_10px_28px_rgba(190,61,106,0.1)] transition-shadow duration-300 group-hover/print:shadow-[0_16px_36px_rgba(190,61,106,0.18)]">
          <HeartDoodle className="cute-card__heart" />
          {/* Delicate paper edge */}
          <div
            className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-[#f8c8d8]/80 to-transparent"
            aria-hidden
          />

          <Link
            to={`/product/${product.slug}`}
            className="relative block aspect-[4/5] overflow-hidden bg-[#ffe4ef] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#f9a8d4]/70"
          >
            <img
              src={product.image}
              alt={product.imageAlt ?? product.name}
              className="img-zoom-hover h-full w-full object-cover object-center"
              loading="lazy"
              decoding="async"
            />
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#704456]/15 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/print:opacity-100"
              aria-hidden
            />
            {product.featured && (
              <span className="absolute left-2.5 top-2.5 rounded-full bg-[#E77DA8] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow">
                Customize
              </span>
            )}
          </Link>

          <div className="flex flex-col items-center px-3 pb-4 pt-3.5 text-center">
            <Link
              to={`/product/${product.slug}`}
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f9a8d4]"
            >
              <h3 className="font-hero text-base font-semibold leading-snug text-[#704456] transition-colors duration-300 group-hover/print:text-[#E77DA8] sm:text-lg">
                {product.name}
              </h3>
            </Link>
            <p className="font-price mt-1 text-sm text-[#E77DA8]">
              {!fixedPrice && <span className="mr-1 font-medium text-[#a85c7b]/55">from</span>}
              RS. {from.toLocaleString()}
            </p>
            <div className="mt-2.5 flex items-center gap-2">
              <Link
                to={`/product/${product.slug}`}
                className="font-hero text-xs font-semibold tracking-wide text-[#E77DA8] transition group-hover/print:tracking-wider"
              >
                shop →
              </Link>
              <button
                type="button"
                onClick={handleAddToCart}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E77DA8] text-white shadow-md shadow-pink-900/15 transition active:scale-95 hover:bg-[#a8335b]"
                aria-label={`Add ${product.name} to cart`}
              >
                <IconCartPlus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.article>
  )
}

export function PrintablesSection() {
  const { searchQuery } = useShop()
  const reduceMotion = useReducedMotion()

  const products = useMemo(() => {
    let list = getProductsByCategory(CATEGORY_ID)
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      list = list.filter((p) => p.name.toLowerCase().includes(q))
    }
    return list
  }, [searchQuery])

  if (products.length === 0) return null

  return (
    <section
      id={`section-${CATEGORY_ID}`}
      className="section-atmosphere paper-texture relative overflow-hidden border-b border-[#f5b5cf]/60 bg-gradient-to-b from-[#FFF7FA] via-[#FFF0F6] to-[#FADCE8]/70 py-14 sm:py-16"
      aria-labelledby="printables-heading"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -right-20 top-8 h-52 w-52 rounded-full bg-[#F8C8D8]/30 blur-3xl" />
        <div className="absolute -left-16 bottom-10 h-48 w-48 rounded-full bg-[#fce7f3]/50 blur-3xl" />
        <SparkleDoodle className="absolute left-[12%] top-20 h-3.5 w-3.5 text-[#F4A7BD]/45" />
        <HeartDoodle className="absolute right-[14%] top-28 h-3.5 w-3.5 text-[#CE6684]/40" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          id="printables-heading"
          eyebrow="tiny dopamine hits"
          title="little things to print ♡"
          description="Newspapers, stickers, bookmarks & cards — the kind of cute you stick on everything."
        />

        {/* Full grid — page scrolls; no nested carousel / fixed-height clip */}
        <div className="grid grid-cols-2 items-start justify-items-center gap-x-4 gap-y-10 sm:gap-x-8 sm:gap-y-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-x-8">
          {products.map((product, i) => (
            <PrintableCard
              key={product.id}
              product={product}
              index={i}
              reduceMotion={!!reduceMotion}
            />
          ))}
        </div>

        <motion.p
          className="mt-12 text-center font-hand text-base text-[#E77DA8]/70 sm:mt-14"
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          still scrolling? good. more cute ↓
        </motion.p>
      </div>
    </section>
  )
}
