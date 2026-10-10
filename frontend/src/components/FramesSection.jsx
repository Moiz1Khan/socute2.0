import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import {
  galleryReveal,
  hoverLift,
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

const CATEGORY_ID = 'frames'

function HeartDoodle({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  )
}

function FrameCard({ product, index, reduceMotion, centerOddLast = false }) {
  const { addToCart } = useCart()
  const from = getMinPrice(product)
  const fixedPrice = hasFixedPrice(product)

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
      {...galleryReveal(reduceMotion, staggerDelay(index, 0.07))}
      className={`group/frame flex w-full justify-center ${
        centerOddLast
          ? 'col-span-2 max-w-[270px] justify-self-center md:col-span-1 md:max-w-none lg:col-span-1'
          : ''
      }`}
      data-cursor="product"
    >
      <motion.div
        className="product-press relative w-full max-w-[270px]"
        whileHover={hoverLift(reduceMotion, -8)}
        whileTap={tapPress(reduceMotion)}
      >
        <div className="cute-card gallery-mat relative transition-shadow duration-300 group-hover/frame:shadow-[0_18px_40px_rgba(190,61,106,0.18)]">
          <HeartDoodle className="cute-card__heart" />
          <Link
            to={`/product/${product.slug}`}
            className="relative block focus:outline-none focus-visible:ring-4 focus-visible:ring-[#f9a8d4]/70"
          >
            <div className="gallery-mat__inner flex aspect-square items-center justify-center">
              <img
                src={product.image}
                alt={product.imageAlt ?? product.name}
                className="img-zoom-hover max-h-[92%] max-w-[92%] object-contain object-center drop-shadow-[0_8px_18px_rgba(131,24,67,0.12)]"
                loading="lazy"
                decoding="async"
              />
            </div>
          </Link>

          <div className="flex flex-col items-center px-1 pb-1 pt-3.5 text-center">
            <Link
              to={`/product/${product.slug}`}
              className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f9a8d4]"
            >
              <h3 className="font-hero text-base font-semibold leading-snug text-[#704456] transition-colors duration-300 group-hover/frame:text-[#E77DA8] sm:text-lg">
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
                className="font-hero text-xs font-semibold tracking-wide text-[#E77DA8] transition group-hover/frame:tracking-wider"
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

export function FramesSection() {
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
      className="section-atmosphere relative overflow-hidden border-b border-[#f5b5cf]/60 bg-gradient-to-b from-[#FFF7FA] via-[#FADCE8]/55 to-[#FFF0F6] py-14 sm:py-16"
      aria-labelledby="frames-heading"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -right-20 top-8 h-52 w-52 rounded-full bg-[#F8C8D8]/30 blur-3xl" />
        <div className="absolute -left-16 bottom-6 h-48 w-48 rounded-full bg-[#fce7f3]/50 blur-3xl" />
        <HeartDoodle className="absolute left-[11%] top-24 h-3 w-3 text-[#F4A7BD]/35" />
        <HeartDoodle className="absolute right-[13%] top-28 h-2.5 w-2.5 text-[#CE6684]/30" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          id="frames-heading"
          eyebrow="shelf candy forever"
          title="Frames"
          description="Mini frames, keepsakes, bouquets, CD journals & phone cases — memories but make them adorable."
        />

        {/* Full grid — page scrolls; no carousel / fixed-height clip */}
        <div className="grid grid-cols-2 items-start justify-items-center gap-x-5 gap-y-12 sm:gap-x-8 sm:gap-y-14 md:grid-cols-3 md:gap-x-8 lg:gap-x-10">
          {products.map((product, i) => (
            <FrameCard
              key={product.id}
              product={product}
              index={i}
              reduceMotion={!!reduceMotion}
              centerOddLast={
                products.length % 2 === 1 &&
                i === products.length - 1 &&
                products.length % 3 !== 0
              }
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
          one more cute scroll ↓
        </motion.p>
      </div>
    </section>
  )
}
