import { useCallback, useEffect, useId, useRef, useState } from 'react'
import { HERO_REELS } from '../../utils/shopConfig'

/**
 * Single phone mockup — muted loop when video assets exist;
 * otherwise a static product poster (never fakes playback).
 */
function PhoneReel({
  reel,
  active,
  allowPlay,
  reduceMotion,
  className = '',
  onSelect,
  onMediaChange,
}) {
  const videoRef = useRef(null)
  const [media, setMedia] = useState('loading') // loading | video | poster

  useEffect(() => {
    onMediaChange?.(reel.id, media)
  }, [media, reel.id, onMediaChange])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return undefined

    video.muted = true
    video.defaultMuted = true
    video.playsInline = true
    video.setAttribute('playsinline', '')
    video.setAttribute('webkit-playsinline', '')

    if (media === 'poster') return undefined

    if (!allowPlay || !active || reduceMotion) {
      video.pause()
      return undefined
    }

    const play = () => {
      const p = video.play()
      if (p && typeof p.catch === 'function') p.catch(() => {})
    }
    play()
    return () => video.pause()
  }, [allowPlay, active, reduceMotion, media, reel.videoMp4])

  return (
    <figure
      className={`phone-reel ${className}${active ? ' is-active' : ''}${media === 'video' ? ' has-video' : ' has-poster'}`}
    >
      <button
        type="button"
        className="phone-reel__hit"
        aria-label={`${reel.label} reel`}
        onClick={onSelect}
      >
        <span className="phone-reel__device">
          <span className="phone-reel__notch" aria-hidden />
          <span className="phone-reel__screen">
            <video
              ref={videoRef}
              className="phone-reel__video"
              src={reel.videoMp4}
              poster={reel.poster}
              muted
              playsInline
              loop
              preload="auto"
              controls={false}
              disablePictureInPicture
              controlsList="nodownload noplaybackrate noremoteplayback"
              aria-label={`${reel.label} product reel`}
              onLoadedData={() => setMedia('video')}
              onCanPlay={() => setMedia('video')}
              onError={() => setMedia('poster')}
            />

            <img
              src={reel.poster}
              alt=""
              className="phone-reel__poster"
              width={720}
              height={1280}
              loading="eager"
              decoding="async"
              draggable={false}
            />
          </span>
        </span>
      </button>
      <figcaption className="phone-reel__caption">{reel.label}</figcaption>
    </figure>
  )
}

/**
 * SoCutesy Reel Studio — split editorial hero with three 9:16 phone reels.
 */
export function ReelStudioHero({ onCategory }) {
  const pauseId = useId()
  const stageRef = useRef(null)
  const [inView, setInView] = useState(true)
  const [userPaused, setUserPaused] = useState(false)
  const [mobileIndex, setMobileIndex] = useState(1) // center reel featured
  const [reduceMotion, setReduceMotion] = useState(false)
  const [compact, setCompact] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(max-width: 699px)').matches,
  )
  const [hasAnyVideo, setHasAnyVideo] = useState(false)

  const onMediaChange = useCallback((id, media) => {
    if (media === 'video') setHasAnyVideo(true)
  }, [])

  useEffect(() => {
    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const compactMq = window.matchMedia('(max-width: 699px)')
    const syncMotion = () => setReduceMotion(motionMq.matches)
    const syncCompact = () => setCompact(compactMq.matches)
    syncMotion()
    syncCompact()
    motionMq.addEventListener('change', syncMotion)
    compactMq.addEventListener('change', syncCompact)
    return () => {
      motionMq.removeEventListener('change', syncMotion)
      compactMq.removeEventListener('change', syncCompact)
    }
  }, [])

  useEffect(() => {
    const el = stageRef.current
    if (!el || typeof IntersectionObserver === 'undefined') return undefined
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting && entry.intersectionRatio > 0.2),
      { threshold: [0, 0.2, 0.5] },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const allowPlay = inView && !userPaused && !reduceMotion

  const goMobile = useCallback((next) => {
    const len = HERO_REELS.length
    setMobileIndex(((next % len) + len) % len)
  }, [])

  const handleShop = (e) => {
    e.preventDefault()
    const target = document.getElementById('products-top')
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 96
      window.scrollTo({ top: Math.max(0, top), left: 0, behavior: 'smooth' })
    }
  }

  const handleReelSelect = (reel, index) => {
    setMobileIndex(index)
    if (reel.categoryId && onCategory) onCategory(reel.categoryId)
  }

  return (
    <section className="reel-studio" aria-labelledby="reel-studio-heading">
      <div className="reel-studio__shell">
        <div className="reel-studio__copy">
          <h1 id="reel-studio-heading" className="reel-studio__title font-display">
            Gifts, made personal.
          </h1>
          <p className="reel-studio__lede">
            Customized magazines, albums, photo gifts & more.
          </p>
          <a href="#products-top" className="reel-studio__cta" onClick={handleShop}>
            Shop Now
          </a>
        </div>

        <div className="reel-studio__stage" ref={stageRef}>
          {!compact ? (
            <div className="reel-studio__phones" aria-label="Product reels">
              {HERO_REELS.map((reel, i) => (
                <PhoneReel
                  key={reel.id}
                  reel={reel}
                  active
                  allowPlay={allowPlay}
                  reduceMotion={reduceMotion}
                  onMediaChange={onMediaChange}
                  className={`phone-reel--${i === 0 ? 'left' : i === 1 ? 'center' : 'right'}${reel.featured ? ' phone-reel--featured' : ''}`}
                  onSelect={() => handleReelSelect(reel, i)}
                />
              ))}
            </div>
          ) : (
            <div
              className="reel-studio__mobile"
              aria-label="Product reels"
              onTouchStart={(e) => {
                e.currentTarget.dataset.touchX = String(e.touches[0]?.clientX ?? 0)
              }}
              onTouchEnd={(e) => {
                const start = Number(e.currentTarget.dataset.touchX || 0)
                const end = e.changedTouches[0]?.clientX ?? start
                const dx = end - start
                if (Math.abs(dx) < 40) return
                goMobile(mobileIndex + (dx < 0 ? 1 : -1))
              }}
            >
              <PhoneReel
                key={`mobile-${HERO_REELS[mobileIndex].id}`}
                reel={HERO_REELS[mobileIndex]}
                active
                allowPlay={allowPlay}
                reduceMotion={reduceMotion}
                onMediaChange={onMediaChange}
                className="phone-reel--mobile phone-reel--featured"
                onSelect={() => handleReelSelect(HERO_REELS[mobileIndex], mobileIndex)}
              />
              <div className="reel-studio__mobile-nav">
                <button
                  type="button"
                  className="reel-studio__nav-btn"
                  aria-label="Previous reel"
                  onClick={() => goMobile(mobileIndex - 1)}
                >
                  ←
                </button>
                <div className="reel-studio__dots" role="tablist" aria-label="Choose reel">
                  {HERO_REELS.map((reel, i) => (
                    <button
                      key={reel.id}
                      type="button"
                      role="tab"
                      aria-selected={i === mobileIndex}
                      aria-label={reel.label}
                      className={`reel-studio__dot${i === mobileIndex ? ' is-active' : ''}`}
                      onClick={() => setMobileIndex(i)}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  className="reel-studio__nav-btn"
                  aria-label="Next reel"
                  onClick={() => goMobile(mobileIndex + 1)}
                >
                  →
                </button>
              </div>
              <p className="reel-studio__mobile-label">{HERO_REELS[mobileIndex].label}</p>
            </div>
          )}

          {hasAnyVideo || reduceMotion ? (
            <div className="reel-studio__a11y">
              <button
                type="button"
                id={pauseId}
                className="reel-studio__pause"
                aria-pressed={userPaused || reduceMotion}
                onClick={() => setUserPaused((p) => !p)}
                disabled={reduceMotion || !hasAnyVideo}
              >
                {reduceMotion || userPaused ? 'Play reels' : 'Pause reels'}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}
