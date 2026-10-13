import { motion, useReducedMotion } from 'framer-motion'
import { fadeUp } from '../../utils/motionPresets'

/**
 * How to Order — compact editorial three-step guide.
 * Process and payment policy unchanged.
 */
export function HowToOrder() {
  const reduceMotion = useReducedMotion()

  const steps = [
    {
      n: '01',
      title: 'Choose your gift',
      body: 'Browse the shop and open a product to pick size, paper, design, or other options.',
    },
    {
      n: '02',
      title: 'Personalize your order',
      body: 'Add your selections and place the order. Photos and details are collected at checkout when needed.',
    },
    {
      n: '03',
      title: 'Checkout & pay',
      body: 'Complete your details online. Payment is online with 50% advance and the remaining 50% when you receive your order.',
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
          <p className="order-guide__eyebrow">A little guide</p>
          <h2 id="how-to-order-heading" className="order-guide__title font-display">
            How to Order
          </h2>
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
