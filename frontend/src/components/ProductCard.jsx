import {
  getMinPrice,
  hasFixedPrice,
  defaultSelection,
  getPrice,
  getSelectionSummary,
} from '../utils/pricing'
import {
  getProductImageFit,
  getProductImagePosition,
} from '../utils/shopConfig'
import { useCart } from '../context/CartContext'
import { IconCartPlus } from './icons'
import { ProductLink } from './ProductLink'

/**
 * Boutique product card — consistent 4:5 media, name, price, quick add.
 */
export function ProductCard({ product, index = 0, layout = 'grid' }) {
  const { addToCart } = useCart()
  const { name, image, imageAlt, slug, images } = product
  const from = getMinPrice(product)
  const fixedPrice = hasFixedPrice(product)
  const focal = getProductImagePosition(slug)
  const fit = getProductImageFit(slug)
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

  const imgStyle = { objectPosition: focal, objectFit: fit }

  return (
    <article
      className={`product-card-wrap product-card-wrap--${layout}`}
      style={layout === 'rail' ? undefined : { '--stagger': Math.min(index, 6) }}
    >
      <div className="product-card">
        <div
          className={`product-card__media${fit === 'contain' ? ' product-card__media--contain' : ''}`}
        >
          <ProductLink
            slug={slug}
            className="product-card__image-link"
            aria-label={name}
          >
            <img
              src={image}
              alt={imageAlt ?? name}
              className={`product-card__img${hoverImage ? ' product-card__img--has-hover' : ''}`}
              loading="lazy"
              decoding="async"
              width={480}
              height={600}
              sizes="(max-width: 699px) 45vw, (max-width: 1023px) 30vw, 22vw"
              style={imgStyle}
            />
            {hoverImage ? (
              <img
                src={hoverImage}
                alt=""
                aria-hidden
                className="product-card__img product-card__img--hover"
                loading="lazy"
                decoding="async"
                width={480}
                height={600}
                sizes="(max-width: 699px) 45vw, (max-width: 1023px) 30vw, 22vw"
                style={imgStyle}
              />
            ) : null}
          </ProductLink>
          <button
            type="button"
            onClick={handleAddToCart}
            className="product-card__add"
            aria-label={`Add ${name} to cart`}
          >
            <IconCartPlus className="h-4 w-4" />
          </button>
        </div>

        <div className="product-card__body">
          <ProductLink slug={slug} className="product-card__title-link">
            <h3 className="product-card__title">{name}</h3>
          </ProductLink>
          <p className="product-card__price">
            {!fixedPrice && <span className="product-card__from">from </span>}
            RS. {from.toLocaleString()}
          </p>
        </div>
      </div>
    </article>
  )
}
