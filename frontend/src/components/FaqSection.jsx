import { useId, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { whatsappLink } from '../utils/whatsapp'
import { EMAIL } from '../utils/shopConfig'

/**
 * Existing FAQ content — do not invent or alter answers.
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

const WHATSAPP_HREF = whatsappLink('Hi SoCutesy! I have a question about an order.')
const EMAIL_HREF = `mailto:${EMAIL}`

function FaqItem({ item, open, onToggle, reduceMotion }) {
  const panelId = useId()
  const buttonId = useId()

  return (
    <div className={`store-faq__item${open ? ' is-open' : ''}`}>
      <button
        type="button"
        id={buttonId}
        onClick={onToggle}
        className="store-faq__btn"
        aria-expanded={open}
        aria-controls={panelId}
      >
        <span className="store-faq__q">{item.q}</span>
        <span className="store-faq__icon" aria-hidden>
          {open ? '−' : '+'}
        </span>
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
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    height: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
                    opacity: { duration: 0.2 },
                  }
            }
            className="store-faq__panel"
          >
            <p className="store-faq__a">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0)
  const reduceMotion = useReducedMotion()

  if (!faqs.length) return null

  return (
    <section id="faqs" className="store-faq" aria-labelledby="faq-heading">
      <div className="store-wrap">
        <header className="store-section-head store-section-head--row">
          <div>
            <p className="store-section-head__label">Help</p>
            <h2 id="faq-heading" className="store-section-head__title">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="store-faq__contact">
            {WHATSAPP_HREF ? (
              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="store-faq__chip"
              >
                WhatsApp
              </a>
            ) : null}
            <a href={EMAIL_HREF} className="store-faq__chip">
              Email
            </a>
          </div>
        </header>

        <div className="store-faq__list">
          {faqs.map((item, i) => (
            <FaqItem
              key={`${i}-${item.q}`}
              item={item}
              open={openIndex === i}
              reduceMotion={!!reduceMotion}
              onToggle={() => setOpenIndex((prev) => (prev === i ? -1 : i))}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
