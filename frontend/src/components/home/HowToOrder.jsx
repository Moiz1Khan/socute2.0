import { motion, useReducedMotion } from 'framer-motion'
import { fadeUp } from '../../utils/motionPresets'

/**
 * How to Order — matches WhatsApp vs photo-upload workflows.
 */
export function HowToOrder() {
  const reduceMotion = useReducedMotion()

  const steps = [
    {
      n: '1',
      title: 'Pick your gift',
      body: 'Browse the shop and choose your options (size, paper, design, quantity).',
    },
    {
      n: '2',
      title: 'Photos or WhatsApp',
      body: 'Photo-only gifts (Polaroids, Photobooth Strips, Mini Photobook): upload pictures on the product page. Detailed gifts: we collect customization on WhatsApp after you submit your order.',
    },
    {
      n: '3',
      title: 'Checkout & submit',
      body: 'Enter your details, pay 50% advance via JazzCash, and upload your payment screenshot. The remaining 50% is paid when you receive your order.',
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
            Complete checkout on the website. Personalized details for magazines,
            albums, and similar gifts are finished on WhatsApp after submission.
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
