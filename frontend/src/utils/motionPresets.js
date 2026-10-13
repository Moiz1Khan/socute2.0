/** Shared boutique motion — opacity/transform only, editorial restraint. */

export const easeOut = [0.22, 1, 0.36, 1]
export const easeSoft = [0.25, 0.1, 0.25, 1]

/** Soft settle — less bounce than a snappy spring. */
export const springSoft = { type: 'spring', stiffness: 260, damping: 28 }
export const springSnappy = { type: 'spring', stiffness: 380, damping: 28 }

const viewport = { once: true, margin: '-48px', amount: 0.18 }

/** Empty props when reduced-motion is on. */
export const still = {}

export const fadeUp = (reduceMotion, delay = 0) =>
  reduceMotion
    ? still
    : {
        initial: { opacity: 0, y: 14 },
        whileInView: { opacity: 1, y: 0 },
        viewport,
        transition: { duration: 0.5, delay, ease: easeOut },
      }

export const fadeScale = (reduceMotion, delay = 0) =>
  reduceMotion
    ? still
    : {
        initial: { opacity: 0, scale: 0.97 },
        whileInView: { opacity: 1, scale: 1 },
        viewport,
        transition: { duration: 0.5, delay, ease: easeOut },
      }

/** Polaroid / scrapbook entry — light tilt settle. */
export const scrapbookTilt = (tilt, reduceMotion, delay = 0) =>
  reduceMotion
    ? still
    : {
        initial: { opacity: 0, y: 16, rotate: tilt * 0.85, scale: 0.98 },
        whileInView: { opacity: 1, y: 0, rotate: 0, scale: 1 },
        viewport,
        transition: { duration: 0.55, delay, ease: easeOut },
      }

/** Printables / paper editorial. */
export const paperReveal = (reduceMotion, delay = 0) =>
  reduceMotion
    ? still
    : {
        initial: { opacity: 0, y: 14, rotate: -0.8 },
        whileInView: { opacity: 1, y: 0, rotate: 0 },
        viewport,
        transition: { duration: 0.5, delay, ease: easeOut },
      }

/** Magazines & albums — soft editorial rise. */
export const editorialReveal = (reduceMotion, delay = 0) =>
  reduceMotion
    ? still
    : {
        initial: { opacity: 0, y: 18, scale: 0.985 },
        whileInView: { opacity: 1, y: 0, scale: 1 },
        viewport: { once: true, margin: '-50px', amount: 0.14 },
        transition: { duration: 0.55, delay, ease: easeOut },
      }

/** Frames gallery — quiet fade-up. */
export const galleryReveal = (reduceMotion, delay = 0) =>
  reduceMotion
    ? still
    : {
        initial: { opacity: 0, y: 12, scale: 0.98 },
        whileInView: { opacity: 1, y: 0, scale: 1 },
        viewport,
        transition: { duration: 0.5, delay, ease: easeOut },
      }

/** Tote photography — spacious soft lift. */
export const photoReveal = (reduceMotion, delay = 0) =>
  reduceMotion
    ? still
    : {
        initial: { opacity: 0, y: 16 },
        whileInView: { opacity: 1, y: 0 },
        viewport,
        transition: { duration: 0.55, delay, ease: easeOut },
      }

export const hoverLift = (reduceMotion, y = -4) =>
  reduceMotion ? undefined : { y, transition: springSoft }

export const hoverStraighten = (reduceMotion) =>
  reduceMotion
    ? undefined
    : { y: -5, rotate: 0, transition: springSoft }

export const tapPress = (reduceMotion) =>
  reduceMotion ? undefined : { scale: 0.985 }

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
              transition: { staggerChildren: 0.07, delayChildren: 0.04 },
            },
          },
        },
  item: (reduceMotion) =>
    reduceMotion
      ? {}
      : {
          variants: {
            hidden: { opacity: 0, y: 12 },
            show: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.48, ease: easeOut },
            },
          },
        },
}

export const staggerDelay = (index, step = 0.06, cap = 0.28) =>
  Math.min((index % 6) * step, cap)
