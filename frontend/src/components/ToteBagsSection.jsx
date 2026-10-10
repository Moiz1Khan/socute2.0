import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import {
  photoReveal,
  hoverLift,
  tapPress,
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
import { SatinBow } from './decor/SatinBow'

const CATEGORY_ID = 'tote-bags'

function HeartDoodle({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  )
}

function TotePhotoCard({ src, alt, index, reduceMotion, to }) {
  return (
    <motion.div
      {...photoReveal(reduceMotion, index * 0.12)}
      className="group/photo w-full"
      data-cursor="product"
    >
      <motion.div
        className="product-press"
        whileHover={hoverLift(reduceMotion, -8)}
        whileTap={tapPress(reduceMotion)}
      >
        <Link
          to={to}
          className="block overflow-hidden rounded-[1.25rem] border border-[#f5b5cf] bg-gradient-to-b from-[#ffe4ef] to-[#fadce8] p-2.5 shadow-[0_10px_28px_rgba(190,61,106,0.1)] transition-shadow duration-300 group-hover/photo:shadow-[0_16px_36px_rgba(190,61,106,0.18)] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#f9a8d4]/70 sm:p-3"
        >
          <div className="aspect-[3/4] min-h-[280px] overflow-hidden rounded-[0.9rem] bg-gradient-to-b from-[#ffe4ef] to-[#fce7f3]/55 sm:min-h-[420px]">
            <img
              src={src}
              alt={alt}
              className="img-zoom-hover h-full w-full object-cover object-center"
              loading="eager"
              decoding="async"
            />
          </div>
        </Link>
      </motion.div>
    </motion.div>
  )
}

export function ToteBagsSection() {
  const { searchQuery } = useShop()
  const { addToCart } = useCart()
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

  const product = products[0]
  const gallery = product.images?.length ? product.images : [product.image]
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
    <section
      id={`section-${CATEGORY_ID}`}
      className="section-atmosphere relative overflow-hidden border-b border-[#f5b5cf]/70 bg-gradient-to-b from-[#FFF0F6] via-[#FADCE8]/60 to-[#F5B5CF]/45 py-14 sm:py-20"
      aria-labelledby="totes-heading"
    >
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute -left-16 top-10 h-48 w-48 rounded-full bg-[#F8C8D8]/30 blur-3xl" />
        <div className="absolute -right-20 bottom-8 h-52 w-52 rounded-full bg-[#fce7f3]/50 blur-3xl" />
        <HeartDoodle className="absolute left-[12%] top-24 h-3 w-3 text-[#F4A7BD]/35" />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          id="totes-heading"
          eyebrow="outfit completer energy"
          title="Tote Bags"
          description="Soft canvas totes with pretty prints — peacock florals & that ‘where’d you get that’ vibe."
        />

        {/* Editorial lifestyle pair — peacock + beach */}
        <div className="relative mx-auto grid max-w-5xl grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-7">
          <SatinBow
            className="pointer-events-none absolute -top-3 left-1/2 z-10 hidden w-14 -translate-x-1/2 sm:block"
            opacity={0.85}
          />
          {gallery.map((src, i) => (
            <TotePhotoCard
              key={src}
              src={src}
              alt={i === 0 ? 'Peacock floral tote bag' : 'Beach outfit tote bag'}
              index={i}
              reduceMotion={!!reduceMotion}
              to={`/product/${product.slug}`}
            />
          ))}
        </div>

        <motion.div
          className="mx-auto mt-8 flex max-w-md flex-col items-center text-center"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15, duration: 0.45 }}
        >
          <Link
            to={`/product/${product.slug}`}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f9a8d4]"
          >
            <h3 className="font-hero text-xl font-semibold text-[#704456] transition-colors hover:text-[#E77DA8] sm:text-2xl">
              {product.name}
            </h3>
          </Link>
          <p className="font-price mt-1 text-base text-[#E77DA8]">
            {!fixedPrice && <span className="mr-1 font-medium text-[#a85c7b]/55">from</span>}
            RS. {from.toLocaleString()}
          </p>
          <div className="mt-4 flex items-center gap-3">
            <Link
              to={`/product/${product.slug}`}
              className="font-hero inline-flex items-center justify-center rounded-full bg-[#e77da8] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(231,125,168,0.28)] transition hover:bg-[#d66b96]"
            >
              shop →
            </Link>
            <button
              type="button"
              onClick={handleAddToCart}
              className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#e77da8]/40 bg-[#fff7fa] text-[#e77da8] transition active:scale-95 hover:border-[#e77da8] hover:bg-[#fff0f6]"
              aria-label={`Add ${product.name} to cart`}
            >
              <IconCartPlus className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
