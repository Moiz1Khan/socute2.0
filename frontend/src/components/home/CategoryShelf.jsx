import { useMemo } from 'react'
import { ProductCard } from '../ProductCard'
import { ProductLink } from '../ProductLink'
import { getProductsByCategory } from '../../utils/products'
import { useShop } from '../../context/ShopContext'
import { getCategoryLabel } from '../../utils/shopConfig'
import { getMinPrice, hasFixedPrice } from '../../utils/pricing'

/**
 * Resolve a balanced layout from product count.
 * - 1 → compact featured presentation
 * - 2–6 → equal CSS grid sized to count
 */
function resolveLayout(count) {
  if (count <= 1) return 'feature'
  return 'grid'
}

function gridCountClass(count) {
  if (count <= 2) return 'cat-shelf__grid--count-2'
  if (count === 3) return 'cat-shelf__grid--count-3'
  if (count === 4) return 'cat-shelf__grid--count-4'
  if (count === 5) return 'cat-shelf__grid--count-5'
  return 'cat-shelf__grid--count-6'
}

/**
 * One homepage category shelf — original category ids only.
 */
export function CategoryShelf({
  categoryId,
  tone = 'ivory',
  isFirst = false,
}) {
  const { searchQuery } = useShop()
  const title = getCategoryLabel(categoryId)

  const products = useMemo(() => {
    let list = getProductsByCategory(categoryId)
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase()
      list = list.filter((p) => p.name.toLowerCase().includes(q))
    }
    return list
  }, [categoryId, searchQuery])

  if (products.length === 0) return null

  const layout = resolveLayout(products.length)
  const featured = layout === 'feature' ? products[0] : null

  return (
    <section
      id={`section-${categoryId}`}
      className={`cat-shelf cat-shelf--${tone}${isFirst ? ' cat-shelf--first' : ''}`}
      aria-labelledby={`heading-${categoryId}`}
    >
      {isFirst ? <div id="products-top" className="sr-only" aria-hidden /> : null}

      <div className="store-wrap">
        <header className="cat-shelf__head">
          <div className="cat-shelf__head-text">
            <h2 id={`heading-${categoryId}`} className="cat-shelf__title font-display">
              {title}
            </h2>
            <span className="cat-shelf__rule" aria-hidden />
          </div>
          <p className="cat-shelf__count">
            {products.length} {products.length === 1 ? 'product' : 'products'}
          </p>
        </header>

        {layout === 'feature' && featured ? (
          <div className="cat-shelf__feature">
            <div className="cat-shelf__feature-media">
              <ProductCard product={featured} layout="grid" />
            </div>
            <div className="cat-shelf__feature-copy">
              <p className="cat-shelf__feature-eyebrow">Featured</p>
              <h3 className="cat-shelf__feature-title font-display">
                {featured.name}
              </h3>
              <p className="cat-shelf__solo-price">
                {!hasFixedPrice(featured) && <span>from </span>}
                RS. {getMinPrice(featured).toLocaleString()}
              </p>
              <ProductLink slug={featured.slug} className="cat-shelf__solo-cta">
                Shop Now
              </ProductLink>
            </div>
          </div>
        ) : null}

        {layout === 'grid' ? (
          <div className={`cat-shelf__grid ${gridCountClass(products.length)}`}>
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                layout="grid"
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  )
}
