import { CUSTOMER_REVIEWS } from '../../utils/shopConfig'

/**
 * Renders only when real reviews exist — never invents testimonials.
 */
export function ReviewsBlock() {
  if (!CUSTOMER_REVIEWS.length) return null

  return (
    <section className="store-reviews" aria-labelledby="reviews-heading">
      <div className="store-wrap">
        <header className="store-section-head">
          <p className="store-section-head__label">Customer love</p>
          <h2 id="reviews-heading" className="store-section-head__title">
            What people are saying
          </h2>
        </header>
        <ul className="store-reviews__grid">
          {CUSTOMER_REVIEWS.map((r) => (
            <li key={`${r.name}-${r.quote.slice(0, 24)}`} className="store-review">
              <blockquote className="store-review__quote">&ldquo;{r.quote}&rdquo;</blockquote>
              <p className="store-review__name">{r.name}</p>
              {r.detail ? <p className="store-review__detail">{r.detail}</p> : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
