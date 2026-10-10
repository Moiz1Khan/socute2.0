import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import {
  scrapbookTilt,
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
import { SatinBow } from './decor/SatinBow'
import { SectionHeading } from './decor/SectionHeading'

const CATEGORY_ID = 'polaroids'

/** Slight scrapbook tilts — straightened on hover */
const TILTS = [-2.4, 1.8, -1.2, 2.1, -1.6]

function HeartDoodle({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  )
}

function PolaroidCard({ product, index, reduceMotion, centerOddLast = false }) {
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
      {...scrapbookTilt(tilt, reduceMotion, staggerDelay(index, 0.08))}
      className={`group/polaroid flex w-full justify-center ${centerOddLast ? 'col-span-2 max-w-[260px] justify-self-center md:col-span-1 md:max-w-none' : ''}`}
      data-cursor="product"
    >
      <motion.div
        className="product-press relative w-full max-w-[260px]"
        style={{ rotate: tilt }}
        whileHover={hoverStraighten(reduceMotion)}
        whileTap={tapPress(reduceMotion)}
      >
        {/* Soft tape accent */}
        <span
          className="pointer-events-none absolute -top-2 left-1/2 z-20 h-4 w-14 -translate-x-1/2 rotate-[-2deg] rounded-sm bg-[#F8C8D8]/70 shadow-sm backdrop-blur-[1px]"
          aria-hidden
        />

        <div className="cute-card relative rounded-[0.35rem] bg-gradient-to-b from-[#ffe4ef] to-[#fadce8] p-2.5 pb-0 shadow-[0_10px_28px_rgba(190,90,120,0.14)] ring-1 ring-[#f5b5cf]/90 transition-shadow duration-300 group-hover/polaroid:shadow-[0_18px_40px_rgba(190,90,120,0.22)] sm:p-3 sm:pb-0">
          <HeartDoodle className="cute-card__heart" />
            <Link
            to={`/product/${product.slug}`}
            className="relative block aspect-square overflow-hidden bg-[#fadce8] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#f9a8d4]/70"
          >
            <img
              src={product.image}
              alt={product.imageAlt ?? product.name}
              className="img-zoom-hover h-full w-full object-cover object-center"
              loading="lazy"
              decoding="async"
            />
            {product.featured && (
              <span className="absolute left-2 top-2 rounded-full bg-[#E77DA8] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow">
                Customize
              </span>
            )}
          </Link>

          {/* Polaroid caption area — title always readable below image */}
          <div className="flex flex-col items-center px-1 pb-3 pt-3 text-center sm:pb-3.5 sm:pt-3.5">
            <Link
              to={`/product/${product.slug}`}
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f9a8d4]"
            >
              <h3 className="font-hero text-base font-semibold leading-snug text-[#704456] transition-colors duration-300 group-hover/polaroid:text-[#E77DA8] sm:text-lg">
                {product.name}
              </h3>
            </Link>
            <p className="font-price mt-1 text-sm text-[#E77DA8]">
              {!fixedPrice && <span className="mr-1 font-medium text-[#a85c7b]/60">from</span>}
              RS. {from.toLocaleString()}
            </p>
            <div className="mt-2.5 flex items-center gap-2">
              <Link
                to={`/product/${product.slug}`}
                className="font-hero text-xs font-semibold tracking-wide text-[#E77DA8] transition group-hover/polaroid:tracking-wider"
              >
                shop →
              </Link>
              <button
                type="button"
                onClick={handleAddToCart}
                className="btn-feedback flex h-8 w-8 items-center justify-center rounded-full bg-[#E77DA8] text-white shadow-md shadow-pink-900/15 transition hover:bg-[#d66b96]"
                aria-label={`Add ${product.name} to cart`}
              >
                <IconCartPlus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tiny heart doodle on some cards */}
        {index % 2 === 0 && (
          <HeartDoodle className="pointer-events-none absolute -right-1 bottom-10 h-3.5 w-3.5 text-[#F4A7BD] opacity-80 sm:-right-2" />
        )}
      </motion.div>
    </motion.article>
  )
}

export function PolaroidsSection() {
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
      className="section-atmosphere relative overflow-hidden border-b border-[#f5b5cf]/70 bg-gradient-to-b from-[#FFF0F6] via-[#FADCE8]/80 to-[#F5B5CF]/40 py-14 sm:py-16"
      aria-labelledby="polaroids-heading"
    >
      {/* Soft scrapbook atmosphere — decorative only */}
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-16 top-10 h-48 w-48 rounded-full bg-[#F5B5CF]/35 blur-3xl" />
        <div className="absolute -right-12 bottom-8 h-56 w-56 rounded-full bg-[#FADCE8]/45 blur-3xl" />
        <SatinBow className="absolute right-[6%] top-16 w-14 rotate-[16deg]" opacity={0.2} />
        <HeartDoodle className="absolute left-[8%] top-24 h-4 w-4 text-[#E77DA8]/45" />
        <HeartDoodle className="absolute right-[10%] top-36 h-3 w-3 text-[#A85C7B]/35" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          id="polaroids-heading"
          eyebrow="main character energy"
          title="Polaroids & prints"
          description="Instant-film vibes, tiny photobooks & booth strips — basically your whole cute core aesthetic."
        />

        {/* Full grid — page scrolls; no nested carousel / fixed-height clip */}
        <div className="grid grid-cols-2 items-start justify-items-center gap-x-4 gap-y-10 sm:gap-x-8 sm:gap-y-12 md:grid-cols-3 md:gap-x-10 lg:gap-x-12">
          {products.map((product, i) => (
            <PolaroidCard
              key={product.id}
              product={product}
              index={i}
              reduceMotion={!!reduceMotion}
              centerOddLast={
                products.length % 2 === 1 && i === products.length - 1
              }
            />
          ))}
        </div>

        <motion.p
          className="mt-12 text-center font-hand text-base text-[#E77DA8]/70 sm:mt-14"
          initial={reduceMotion ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          wait… there’s more cute stuff ↓
        </motion.p>
      </div>
    </section>
  )
}
