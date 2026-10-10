import { useId, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { whatsappLink } from '../utils/whatsapp'
import { SatinBow } from './decor/SatinBow'

/**
 * Add your Q&As here — { q: string, a: string }
 * @type {{ q: string, a: string }[]}
 */
export const faqs = [
  {
    q: 'Payment method',
    a: 'Payment is completely online. We take 50% advance payment and the remaining 50% once you receive your order.',
  },
  {
    q: 'Delivery time',
    a: 'Delivery usually takes 4–7 working days. Delivery charges are fixed according to courier services.',
  },
  {
    q: 'About our magazines',
    a: 'Our magazines are A4 sized and available in two paper types: soft and hard. The difference is in the texture and thickness of the paper.',
  },
  {
    q: 'About our albums',
    a: 'Our albums are A5 sized and fully customizable. You can personalize them however you like.',
  },
  {
    q: 'Picture privacy',
    a: 'Your privacy is our priority. All pictures are deleted right after your order is completed. Plus, SoCutesy is girl-owned and handled with care.',
  },
  {
    q: 'Refund policy',
    a: 'Once your order is confirmed, refunds are not available.',
  },
]

const WHATSAPP_HREF = whatsappLink('Hi SoCutesy! I have a little question ♡')
const EMAIL_HREF = 'mailto:socutesy124@gmail.com'

function HeartIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  )
}

function Sparkle({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 1.5l1.4 7.1L20.5 10 13.4 11.4 12 18.5l-1.4-7.1L3.5 10l7.1-1.4L12 1.5z" />
    </svg>
  )
}

function FaqItem({ item, open, onToggle, index, reduceMotion }) {
  const panelId = useId()
  const buttonId = useId()

  return (
    <motion.div
      className={`faq-row ${open ? 'faq-row--open' : ''}`}
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ delay: Math.min(index * 0.04, 0.2), duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <button
        type="button"
        id={buttonId}
        onClick={onToggle}
        className="faq-row__btn"
        aria-expanded={open}
        aria-controls={panelId}
      >
        <span className="faq-row__index font-hand" aria-hidden>
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="faq-row__q font-hero">{item.q}</span>
        <motion.span
          className={`faq-row__icon ${open ? 'faq-row__icon--open' : ''}`}
          aria-hidden
          animate={open ? { rotate: 180 } : { rotate: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {open ? <span className="faq-row__minus" /> : <span className="faq-row__plus" />}
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={reduceMotion ? undefined : { height: 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p className="faq-row__a">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0)
  const reduceMotion = useReducedMotion()

  if (!faqs.length) return null

  return (
    <section id="faqs" className="faq-section" aria-labelledby="faq-heading">
      <div className="faq-section__glow" aria-hidden />

      <div className="faq-editorial">
        {/* Left: editorial heading + scrapbook note */}
        <motion.aside
          className="faq-aside"
          initial={reduceMotion ? false : { opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="faq-aside__label font-hand">
            <Sparkle className="faq-aside__spark" />
            before you spiral… faqs
          </p>

          <h2 id="faq-heading" className="faq-aside__title font-display">
            Frequently Asked Questions
          </h2>

          <p className="faq-aside__sub">
            Soft answers about ordering, delivery, and custom gifts — no stress, just cute clarity.
          </p>

          <div className="faq-sticker" aria-hidden>
            <SatinBow className="faq-sticker__bow" />
            <p className="faq-sticker__hand font-hand">we got u bestie ♡</p>
            <HeartIcon className="faq-sticker__heart" />
          </div>

          <div className="faq-aside__contact">
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              className="faq-aside__btn font-hero"
            >
              still need help?
              <HeartIcon className="h-3.5 w-3.5" />
            </a>
            <a href={EMAIL_HREF} className="faq-aside__mail font-hand">
              email us →
            </a>
          </div>
        </motion.aside>

        {/* Right: elegant accordion list */}
        <motion.div
          className="faq-list"
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.55, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          {faqs.map((item, i) => (
            <FaqItem
              key={`${i}-${item.q}`}
              item={item}
              index={i}
              open={openIndex === i}
              reduceMotion={!!reduceMotion}
              onToggle={() => setOpenIndex((prev) => (prev === i ? -1 : i))}
            />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
