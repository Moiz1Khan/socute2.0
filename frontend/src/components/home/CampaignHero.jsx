import { useCallback, useEffect, useState } from 'react'
import { HERO_SLIDES } from '../../utils/shopConfig'

const AUTO_MS = 6500

/**
 * Full-bleed campaign carousel — photo left/right with copy over a soft veil.
 */
export function CampaignHero({ onCategory }) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const total = HERO_SLIDES.length

  const go = useCallback(
    (next) => setIndex(((next % total) + total) % total),
    [total],
  )

  useEffect(() => {
    if (paused) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = window.setInterval(() => go(index + 1), AUTO_MS)
    return () => window.clearInterval(id)
  }, [index, paused, go])

  const handleCta = (slide, e) => {
    if (slide.ctaAction?.type === 'category' && onCategory) {
      e.preventDefault()
      onCategory(slide.ctaAction.id)
    }
  }

  return (
    <section
      className="store-hero"
      aria-label="SoCutesy campaign"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setPaused(false)
      }}
    >
      <div className="store-hero__stage">
        {HERO_SLIDES.map((slide, i) => {
          const active = i === index
          return (
            <div
              key={slide.id}
              className={`store-hero__slide${active ? ' is-active' : ''}`}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${total}`}
              aria-hidden={!active}
            >
              <picture className="store-hero__media">
                {slide.mobileImage && (
                  <source
                    media="(max-width: 767px)"
                    srcSet={slide.mobileImage}
                    width={675}
                    height={900}
                  />
                )}
                <img
                  src={slide.image}
                  alt={active ? slide.alt : ''}
                  width={1920}
                  height={1080}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  fetchPriority={i === 0 ? 'high' : 'auto'}
                  decoding="async"
                />
              </picture>
              <div className="store-hero__veil" aria-hidden />
              <div className="store-hero__copy">
                <p className="store-hero__eyebrow">{slide.eyebrow}</p>
                <h1 className="store-hero__title font-display">{slide.headline}</h1>
                <p className="store-hero__lede">{slide.lede}</p>
                <a
                  href={slide.ctaHref || '#products-top'}
                  className="store-hero__cta"
                  tabIndex={active ? 0 : -1}
                  onClick={(e) => handleCta(slide, e)}
                >
                  {slide.ctaLabel}
                </a>
              </div>
            </div>
          )
        })}
      </div>

      <div className="store-hero__controls">
        <div className="store-hero__dots" role="tablist" aria-label="Hero slides">
          {HERO_SLIDES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show slide ${i + 1}`}
              className={`store-hero__dot${i === index ? ' is-active' : ''}`}
              onClick={() => go(i)}
            />
          ))}
        </div>
        <div className="store-hero__arrows">
          <button
            type="button"
            className="store-hero__arrow"
            aria-label="Previous slide"
            onClick={() => go(index - 1)}
          >
            ←
          </button>
          <button
            type="button"
            className="store-hero__arrow"
            aria-label="Next slide"
            onClick={() => go(index + 1)}
          >
            →
          </button>
        </div>
      </div>
    </section>
  )
}
