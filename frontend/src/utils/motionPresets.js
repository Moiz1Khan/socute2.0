/** Shared boutique motion — transforms/opacity only for smooth 60fps. */

export const easeOut = [0.22, 1, 0.36, 1]
export const springSoft = { type: 'spring', stiffness: 320, damping: 22 }
export const springSnappy = { type: 'spring', stiffness: 420, damping: 18 }

const viewport = { once: true, margin: '-40px', amount: 0.15 }

/** Empty props when reduced-motion is on. */
export const still = {}

export const fadeUp = (reduceMotion, delay = 0) =>
  reduceMotion
    ? still
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport,
        transition: { duration: 0.58, delay, ease: easeOut },
      }

export const fadeScale = (reduceMotion, delay = 0) =>
  reduceMotion
    ? still
    : {
        initial: { opacity: 0, scale: 0.94 },
        whileInView: { opacity: 1, scale: 1 },
        viewport,
        transition: { duration: 0.58, delay, ease: easeOut },
      }

/** Polaroid / scrapbook entry — tilt then settle. */
export const scrapbookTilt = (tilt, reduceMotion, delay = 0) =>
  reduceMotion
    ? still
    : {
        initial: { opacity: 0, y: 26, rotate: tilt * 1.45, scale: 0.95 },
        whileInView: { opacity: 1, y: 0, rotate: 0, scale: 1 },
        viewport,
        transition: { duration: 0.64, delay, ease: easeOut },
      }

/** Printables / paper editorial. */
export const paperReveal = (reduceMotion, delay = 0) =>
  reduceMotion
    ? still
    : {
        initial: { opacity: 0, y: 22, rotate: -1.8 },
        whileInView: { opacity: 1, y: 0, rotate: 0 },
        viewport,
        transition: { duration: 0.58, delay, ease: easeOut },
      }

/** Magazines & albums — deeper editorial rise. */
export const editorialReveal = (reduceMotion, delay = 0) =>
  reduceMotion
    ? still
    : {
        initial: { opacity: 0, y: 30, scale: 0.96 },
        whileInView: { opacity: 1, y: 0, scale: 1 },
        viewport: { once: true, margin: '-50px', amount: 0.12 },
        transition: { duration: 0.68, delay, ease: easeOut },
      }

/** Frames gallery — soft scale-in. */
export const galleryReveal = (reduceMotion, delay = 0) =>
  reduceMotion
    ? still
    : {
        initial: { opacity: 0, scale: 0.92, y: 16 },
        whileInView: { opacity: 1, scale: 1, y: 0 },
        viewport,
        transition: { duration: 0.6, delay, ease: easeOut },
      }

/** Tote photography — spacious lift. */
export const photoReveal = (reduceMotion, delay = 0) =>
  reduceMotion
    ? still
    : {
        initial: { opacity: 0, y: 24, scale: 0.97 },
        whileInView: { opacity: 1, y: 0, scale: 1 },
        viewport,
        transition: { duration: 0.62, delay, ease: easeOut },
      }

export const hoverLift = (reduceMotion, y = -8) =>
  reduceMotion ? undefined : { y, transition: springSoft }

export const hoverStraighten = (reduceMotion) =>
  reduceMotion
    ? undefined
    : { y: -10, rotate: 0, transition: springSoft }

export const tapPress = (reduceMotion) =>
  reduceMotion ? undefined : { scale: 0.97 }

/** Hero copy stagger — CTA appears quickly so shopping isn’t delayed. */
export const heroStagger = {
  container: (reduceMotion) =>
    reduceMotion
      ? {}
      : {
          initial: 'hidden',
          animate: 'show',
          variants: {
            hidden: {},
            show: {
              transition: { staggerChildren: 0.08, delayChildren: 0.06 },
            },
          },
        },
  item: (reduceMotion) =>
    reduceMotion
      ? {}
      : {
          variants: {
            hidden: { opacity: 0, y: 16 },
            show: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.55, ease: easeOut },
            },
          },
        },
}

export const staggerDelay = (index, step = 0.07, cap = 0.35) =>
  Math.min((index % 6) * step, cap)
