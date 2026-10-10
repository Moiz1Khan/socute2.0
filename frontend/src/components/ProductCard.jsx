import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import {
  getMinPrice,
  hasFixedPrice,
  defaultSelection,
  getPrice,
  getSelectionSummary,
} from '../utils/pricing'
import { useCart } from '../context/CartContext'
import { IconCartPlus } from './icons'
import {
  fadeUp,
  hoverLift,
  tapPress,
  staggerDelay,
} from '../utils/motionPresets'

/**
 * Homepage / carousel card: name, starting price, links to product detail.
 */
export function ProductCard({ product, index = 0 }) {
  const { addToCart } = useCart()
  const reduceMotion = useReducedMotion()
  const { name, image, imageAlt, slug, featured, images } = product
  const from = getMinPrice(product)
  const fixedPrice = hasFixedPrice(product)
  const hoverImage =
    Array.isArray(images) && images.length > 1 ? images[1] : null

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
      {...fadeUp(reduceMotion, staggerDelay(index))}
      whileHover={hoverLift(reduceMotion, -4)}
      whileTap={tapPress(reduceMotion)}
      className="group/card w-[min(100%,280px)] shrink-0 snap-start"
      data-cursor="product"
    >
      <div className="cute-card product-press flex h-full min-h-0 flex-col overflow-hidden rounded-3xl border border-[#f5b5cf] bg-gradient-to-b from-[#fff7fa] to-[#ffe4ef] shadow-sm shadow-pink-200/40 transition-all duration-300 ease-out hover:border-[#e77da8] hover:shadow-xl hover:shadow-[#e77da8]/20">
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className="cute-card__heart"
          aria-hidden
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <div className="relative aspect-square w-full shrink-0 overflow-hidden bg-gradient-to-br from-[#fff0f6] to-[#fadce8]">
          <Link
            to={`/product/${slug}`}
            className="block h-full w-full focus:outline-none focus-visible:ring-4 focus-visible:ring-[#f5b5cf]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fff0f6]"
          >
            <img
              src={image}
              alt={imageAlt ?? name}
              className={`img-zoom-hover h-full w-full object-cover object-center ${
                hoverImage ? 'group-hover/card:opacity-0' : ''
              }`}
              loading="lazy"
              decoding="async"
            />
            {hoverImage && (
              <img
                src={hoverImage}
                alt=""
                aria-hidden
                className="img-zoom-hover absolute inset-0 h-full w-full object-cover object-center opacity-0 transition-opacity duration-500 group-hover/card:opacity-100"
                loading="lazy"
                decoding="async"
              />
            )}
          </Link>
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#704456]/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover/card:opacity-100"
            aria-hidden
          />
          {featured && (
            <span className="pointer-events-none absolute left-3 top-3 rounded-full bg-[#e77da8] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-md shadow-[#e77da8]/30">
              Customize
            </span>
          )}
          <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-[#fff7fa]/95 px-3 py-1 font-price text-xs tabular-nums text-[#704456] shadow-sm backdrop-blur-sm">
            {!fixedPrice && (
              <span className="mr-1 text-[10px] font-medium text-[#a85c7b]">
                from
              </span>
            )}
            RS. {from.toLocaleString()}
          </span>
          <button
            type="button"
            onClick={handleAddToCart}
            className="btn-feedback absolute bottom-3 right-3 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#e77da8] text-white opacity-100 shadow-lg shadow-[#e77da8]/35 transition-all duration-300 hover:bg-[#d66b96] sm:translate-y-1 sm:opacity-0 sm:group-hover/card:translate-y-0 sm:group-hover/card:opacity-100"
            aria-label={`Add ${name} to cart`}
          >
            <IconCartPlus className="h-5 w-5" />
          </button>
        </div>

        <Link
          to={`/product/${slug}`}
          className="group flex min-h-[6.5rem] flex-1 flex-col p-4 focus:outline-none focus-visible:ring-4 focus-visible:ring-[#f5b5cf]/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#fff0f6]"
        >
          <h3 className="font-hero mb-2 line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug tracking-tight text-[#704456] transition-colors group-hover:text-[#e77da8]">
            {name}
          </h3>
          <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-[#e77da8]">
            shop
            <span className="transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </span>
        </Link>
      </div>
    </motion.article>
  )
}
