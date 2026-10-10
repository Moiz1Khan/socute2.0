import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getProductBySlug } from '../utils/products'
import { SatinBow } from '../components/decor/SatinBow'

/**
 * Placeholder until Fabric editor is wired per product.
 */
export default function CustomizePlaceholder() {
  const { productId } = useParams()
  const product = getProductBySlug(productId)

  return (
    <main className="relative flex min-h-[60vh] flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-[#fff7fa] via-[#fff0f6] to-[#fadce8] px-4 py-16 text-center">
      <div
        className="pointer-events-none absolute -left-16 top-16 h-48 w-48 rounded-full bg-[#f5b5cf]/40 blur-3xl"
        aria-hidden
      />
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-lg rounded-[2rem] border border-[#f5b5cf] bg-gradient-to-b from-[#fff7fa] to-[#fff0f6] p-8 shadow-xl shadow-[#e77da8]/15"
      >
        <SatinBow className="mx-auto mb-4 h-10 w-14" opacity={0.95} />
        <h1 className="font-display text-3xl font-semibold tracking-tight text-[#704456]">
          {product?.name ?? 'Product'}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#8a5a6e]">
          The live canvas editor is coming next for this item. You can still open
          the product page to choose options and place your order.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          {product?.slug && (
            <Link
              to={`/product/${product.slug}`}
              className="btn-candy px-6 py-3 text-sm"
            >
              View product
            </Link>
          )}
          <Link
            to="/"
            className="inline-flex rounded-full border-2 border-[#f5b5cf] bg-[#fff7fa] px-6 py-3 text-sm font-semibold text-[#e77da8] transition hover:border-[#e77da8]"
          >
            Back to shop
          </Link>
        </div>
      </motion.div>
    </main>
  )
}
