import { motion, useReducedMotion } from 'framer-motion'
import { fadeUp } from '../../utils/motionPresets'

/**
 * How to Order — plain three-step guide matching the real checkout flow.
 * Process and payment policy unchanged.
 */
export function HowToOrder() {
  const reduceMotion = useReducedMotion()

  const steps = [
    {
      n: '1',
      title: 'Pick your gift',
      body: 'Browse the shop, open a product, and choose your options (size, paper, design, quantity). Then tap Place order or Add to cart.',
    },
    {
      n: '2',
      title: 'Add details & photos',
      body: 'At checkout, enter your name, phone, and address. If the product needs photos, upload them on the same page — we show how many you need.',
    },
    {
      n: '3',
      title: 'Pay 50% to confirm',
      body: 'Pay half online and upload your payment screenshot. The remaining 50% is paid when you receive your order.',
    },
  ]

  return (
    <section
      id="how-to-order"
      className="order-guide"
      aria-labelledby="how-to-order-heading"
    >
      <div className="store-wrap">
        <motion.header className="order-guide__head" {...fadeUp(reduceMotion, 0)}>
          <p className="order-guide__eyebrow">Order in 3 steps</p>
          <h2 id="how-to-order-heading" className="order-guide__title font-display">
            How to Order
          </h2>
          <p className="order-guide__lead">
            Follow these steps on the website — no WhatsApp order needed.
          </p>
        </motion.header>

        <ol className="order-guide__steps">
          {steps.map((step, i) => (
            <motion.li
              key={step.n}
              className="order-guide__step"
              {...fadeUp(reduceMotion, 0.06 + i * 0.07)}
            >
              <div className="order-guide__marker">
                <span className="order-guide__n" aria-hidden>
                  {step.n}
                </span>
                {i < steps.length - 1 ? (
                  <span className="order-guide__line" aria-hidden />
                ) : null}
              </div>
              <div className="order-guide__copy">
                <p className="order-guide__step-label">Step {step.n}</p>
                <h3 className="order-guide__step-title">{step.title}</h3>
                <p className="order-guide__step-body">{step.body}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  )
}
