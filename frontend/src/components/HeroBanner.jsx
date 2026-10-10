import { useRef } from 'react'
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion'
import { SatinBow } from './decor/SatinBow'
import { easeOut, heroStagger, springSnappy } from '../utils/motionPresets'

const INSTAGRAM_URL = 'https://www.instagram.com/socutesyyy_/'

function HeartIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  )
}

function DreamAtmosphere({ reduceMotion }) {
  return (
    <div className="hero-dream" aria-hidden>
      <div className="hero-dream__base" />
      <div className="hero-dream__mesh" />
      <div className="hero-dream__orb hero-dream__orb--a" />
      <div className="hero-dream__orb hero-dream__orb--b" />
      <div className="hero-dream__orb hero-dream__orb--c" />
      <div className="hero-dream__ribbon hero-dream__ribbon--l" />
      <div className="hero-dream__ribbon hero-dream__ribbon--r" />
      <div className="hero-dream__satin hero-dream__satin--a" />
      <div className="hero-dream__satin hero-dream__satin--b" />

      {!reduceMotion && (
        <>
          <motion.div
            className="hero-dream__float hero-dream__float--1"
            animate={{ y: [0, -22, 0], rotate: [-16, -6, -16] }}
            transition={{ duration: 6.2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <SatinBow className="h-auto w-full" opacity={0.9} />
          </motion.div>
          <motion.div
            className="hero-dream__float hero-dream__float--2"
            animate={{ y: [0, 18, 0], rotate: [14, 6, 14] }}
            transition={{
              duration: 7.4,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.5,
            }}
          >
            <SatinBow className="h-auto w-full" opacity={0.82} />
          </motion.div>
          <motion.div
            className="hero-dream__float hero-dream__float--3"
            animate={{ y: [0, -16, 0], x: [0, 12, 0] }}
            transition={{
              duration: 6.8,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
          >
            <SatinBow className="h-auto w-full" opacity={0.78} />
          </motion.div>
        </>
      )}

      {!reduceMotion &&
        [
          { t: '14%', l: '8%', d: 0 },
          { t: '22%', l: '78%', d: 0.7 },
          { t: '48%', l: '12%', d: 1.4 },
          { t: '62%', l: '88%', d: 0.3 },
          { t: '78%', l: '18%', d: 1.1 },
          { t: '32%', l: '92%', d: 1.8 },
          { t: '55%', l: '45%', d: 0.5 },
          { t: '85%', l: '70%', d: 1.3 },
        ].map((p, i) => (
          <motion.span
            key={i}
            className="hero-dream__spark"
            style={{ top: p.t, left: p.l }}
            animate={{ opacity: [0.18, 0.95, 0.18], scale: [0.7, 1.25, 0.7] }}
            transition={{ duration: 2.6 + i * 0.15, repeat: Infinity, delay: p.d }}
          />
        ))}

      {!reduceMotion &&
        [
          { t: '18%', l: '42%', d: 0.2, s: 0.85 },
          { t: '68%', l: '6%', d: 0.9, s: 0.65 },
          { t: '40%', l: '86%', d: 1.5, s: 0.75 },
        ].map((p, i) => (
          <motion.span
            key={`h-${i}`}
            className="hero-dream__heart"
            style={{
              top: p.t,
              left: p.l,
              width: `${p.s}rem`,
              height: `${p.s}rem`,
            }}
            animate={{ y: [0, -12, 0], opacity: [0.3, 0.75, 0.3] }}
            transition={{
              duration: 4.4 + i * 0.35,
              repeat: Infinity,
              delay: p.d,
              ease: 'easeInOut',
            }}
          >
            <HeartIcon className="h-full w-full" />
          </motion.span>
        ))}

      <div className="hero-dream__glow" />
    </div>
  )
}

function CollageStage({ reduceMotion, parallaxX, parallaxY }) {
  const mainX = useTransform(parallaxX, (v) => v * 0.35)
  const mainY = useTransform(parallaxY, (v) => v * 0.25)
  const sideX = useTransform(parallaxX, (v) => v * 0.55)
  const sideY = useTransform(parallaxY, (v) => v * 0.4)
  const frameX = useTransform(parallaxX, (v) => v * -0.4)
  const frameY = useTransform(parallaxY, (v) => v * -0.3)

  return (
    <div className="hero-collage">
      <div className="hero-collage__bloom" aria-hidden />

      <motion.figure
        className="hero-collage__piece hero-collage__piece--main"
        style={{ x: mainX, y: mainY, rotate: -3 }}
        initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.18, ease: easeOut }}
        whileHover={reduceMotion ? undefined : { y: -10, scale: 1.02 }}
      >
        <span className="hero-collage__tape" aria-hidden />
        <img
          src="/images/magazine-1.png"
          alt="Custom magazine"
          loading="eager"
          decoding="async"
        />
        <figcaption className="font-hand">little keepsakes</figcaption>
      </motion.figure>

      <motion.figure
        className="hero-collage__piece hero-collage__piece--polaroid"
        style={{ x: sideX, y: sideY, rotate: 8 }}
        initial={reduceMotion ? false : { opacity: 0, y: 18, rotate: 14 }}
        animate={{ opacity: 1, y: 0, rotate: 8 }}
        transition={{ duration: 0.72, delay: 0.32, ease: easeOut }}
        whileHover={reduceMotion ? undefined : { y: -8, rotate: 4 }}
      >
        <img
          src="/images/polaroids-1.png"
          alt="Polaroid prints"
          loading="eager"
          decoding="async"
        />
      </motion.figure>

      <motion.figure
        className="hero-collage__piece hero-collage__piece--frame"
        style={{ x: frameX, y: frameY, rotate: -7 }}
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.72, delay: 0.42, ease: easeOut }}
        whileHover={reduceMotion ? undefined : { y: -7 }}
      >
        <img
          src="/images/keepsake-frame-1.png"
          alt="Keepsake frame"
          loading="eager"
          decoding="async"
        />
      </motion.figure>

      <motion.figure
        className="hero-collage__piece hero-collage__piece--strips"
        style={{ rotate: -10 }}
        initial={reduceMotion ? false : { opacity: 0, x: -14 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.68, delay: 0.52, ease: easeOut }}
        whileHover={reduceMotion ? undefined : { y: -6 }}
      >
        <img
          src="/images/photobooth-strips-cover.png"
          alt="Photobooth strips"
          loading="eager"
          decoding="async"
        />
      </motion.figure>

      <motion.figure
        className="hero-collage__piece hero-collage__piece--book"
        style={{ rotate: 6 }}
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.68, delay: 0.6, ease: easeOut }}
        whileHover={reduceMotion ? undefined : { y: -6 }}
      >
        <img
          src="/images/mini-photobook-1.png"
          alt="Mini photobook"
          loading="eager"
          decoding="async"
        />
      </motion.figure>

      <motion.div
        className="hero-collage__bow"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.75, rotate: -12 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ delay: 0.75, duration: 0.55, ease: easeOut }}
        aria-hidden
      >
        <SatinBow className="h-12 w-16 drop-shadow-md sm:h-14 sm:w-20" />
      </motion.div>
    </div>
  )
}

export function HeroBanner() {
  const reduceMotion = useReducedMotion()
  const sectionRef = useRef(null)
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const parallaxX = useSpring(rawX, { stiffness: 42, damping: 26 })
  const parallaxY = useSpring(rawY, { stiffness: 42, damping: 26 })
  const item = heroStagger.item(!!reduceMotion)
  const container = heroStagger.container(!!reduceMotion)

  const onPointerMove = (e) => {
    if (reduceMotion || !sectionRef.current) return
    const r = sectionRef.current.getBoundingClientRect()
    rawX.set(((e.clientX - r.left) / r.width - 0.5) * 16)
    rawY.set(((e.clientY - r.top) / r.height - 0.5) * 10)
  }

  return (
    <section
      ref={sectionRef}
      className="hero-root"
      aria-label="Socutesyyy hero"
      onPointerMove={onPointerMove}
      onPointerLeave={() => {
        rawX.set(0)
        rawY.set(0)
      }}
    >
      <DreamAtmosphere reduceMotion={!!reduceMotion} />

      <div className="hero-stage">
        <motion.div className="hero-copy" {...container}>
          <motion.p className="hero-copy__eyebrow font-hand" {...item}>
            <SatinBow className="hero-copy__mini-bow" />
            ok wait… this is so cuteee
          </motion.p>
          <motion.p className="hero-copy__brand" {...item}>
            socutesyyy
          </motion.p>
          <motion.h1 className="hero-copy__title font-display" {...item}>
            your soft girl era of
            <br className="hidden sm:block" />{' '}
            <em className="font-script">pretty things</em>
          </motion.h1>
          <motion.p className="hero-copy__sub" {...item}>
            Polaroids, magazines, frames &amp; keepsakes — handmade gifts for
            every soft little moment.
          </motion.p>
          <motion.div className="hero-copy__actions" {...item}>
            <motion.a
              href="#products-top"
              className="btn-candy font-hero"
              whileHover={
                reduceMotion
                  ? undefined
                  : { y: -4, scale: 1.04, transition: springSnappy }
              }
              whileTap={reduceMotion ? undefined : { scale: 0.96 }}
            >
              <span>shop the boutique</span>
              <motion.span
                animate={reduceMotion ? undefined : { scale: [1, 1.12, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="inline-flex"
              >
                <HeartIcon className="h-4 w-4" />
              </motion.span>
            </motion.a>
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hero-copy__ig font-hand"
            >
              @socutesyyy_
            </a>
          </motion.div>
          <motion.p
            className="hero-copy__stamp font-hand"
            initial={reduceMotion ? false : { opacity: 0, rotate: -6, y: 8 }}
            animate={{ opacity: 1, rotate: -2, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5, ease: easeOut }}
          >
            made with love
            <HeartIcon className="hero-copy__stamp-heart" />
          </motion.p>
        </motion.div>

        <CollageStage
          reduceMotion={!!reduceMotion}
          parallaxX={parallaxX}
          parallaxY={parallaxY}
        />
      </div>

      <motion.a
        href="#products-top"
        className="hero-scroll font-hand"
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.85 }}
        aria-label="Scroll to products"
      >
        explore the shop
        <motion.span
          animate={reduceMotion ? undefined : { y: [0, 6, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        >
          ↓
        </motion.span>
      </motion.a>

      <div className="hero-edge" aria-hidden>
        <svg viewBox="0 0 1440 90" preserveAspectRatio="none">
          <path
            d="M0,48 C200,90 400,8 720,42 C1040,76 1240,12 1440,48 L1440,90 L0,90 Z"
            fill="#FFF7FA"
          />
        </svg>
      </div>
    </section>
  )
}
