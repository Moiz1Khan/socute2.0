import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { GiftIcon } from './GiftIcon'
import { IconInstagram, IconMail, IconWhatsApp } from './icons'
import { whatsappLink } from '../utils/whatsapp'
import { categories } from '../utils/products'
import { SatinBow } from './decor/SatinBow'

const INSTAGRAM_URL = 'https://www.instagram.com/socutesyyy_/'
const WHATSAPP_DISPLAY = '0371 6912402'
const EMAIL = 'socutesy124@gmail.com'

const contactLinks = [
  {
    label: '@socutesyyy_',
    href: INSTAGRAM_URL,
    external: true,
    icon: IconInstagram,
  },
  {
    label: WHATSAPP_DISPLAY,
    href: whatsappLink('Hi SoCutesy!'),
    external: true,
    icon: IconWhatsApp,
  },
  {
    label: EMAIL,
    href: `mailto:${EMAIL}`,
    external: false,
    icon: IconMail,
  },
]

export function SiteFooter() {
  const year = new Date().getFullYear()
  const reduceMotion = useReducedMotion()

  return (
    <footer className="relative overflow-hidden bg-gradient-to-b from-[#E77DA8] via-[#c96b95] to-[#704456] px-4 pb-10 pt-14 sm:px-6 sm:pb-12 sm:pt-16">
      <SatinBow
        className="pointer-events-none absolute left-1/2 top-3 w-16 -translate-x-1/2 opacity-90 sm:w-20"
        opacity={0.95}
      />
      <motion.div
        className="relative mx-auto max-w-6xl"
        initial={reduceMotion ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="overflow-hidden rounded-[2rem] border border-[#f5b5cf]/90 bg-gradient-to-b from-[#ffe4ef] to-[#fadce8] shadow-2xl shadow-pink-900/25 backdrop-blur-md sm:rounded-[2.5rem]">
          <div className="border-b border-[#f5b5cf]/80 bg-gradient-to-r from-[#fadce8] via-[#ffe4ef] to-[#f5b5cf]/70 px-6 py-8 sm:px-10 sm:py-10">
            <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
              <div className="shrink-0 lg:max-w-xs">
                <div className="inline-flex items-center gap-3 rounded-2xl bg-[#fadce8]/90 px-4 py-3 ring-1 ring-[#f5b5cf]/80">
                  <SatinBow className="hidden h-8 w-11 sm:block" opacity={0.95} />
                  <GiftIcon className="h-10 w-10 shrink-0" />
                  <div>
                    <p className="font-logo-wordmark text-2xl lowercase leading-tight text-[#e77da8] sm:text-3xl">
                      socutesyyy
                    </p>
                    <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.35em] text-[#704456]/70 sm:text-xs">
                      GIFT SHOP
                    </p>
                  </div>
                </div>
                <p className="mt-5 max-w-xs font-script text-[1.45rem] leading-snug text-[#e77da8] sm:text-[1.65rem]">
                  made with love ♡
                </p>
                <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#704456]/80">
                  Personalized magazines, polaroids, stickers, and cute gifts.
                </p>
              </div>

              <div className="grid min-w-0 flex-1 grid-cols-3 gap-4 sm:gap-8">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e77da8]">
                    Shop
                  </p>
                  <ul className="mt-4 space-y-2.5">
                    <li>
                      <a
                        href="#products-top"
                        className="text-sm font-medium text-[#704456] transition hover:text-[#e77da8]"
                      >
                        Shop All
                      </a>
                    </li>
                    {categories.map((c) => (
                      <li key={c.id}>
                        <a
                          href={`#section-${c.id}`}
                          className="text-sm font-medium text-[#704456] transition hover:text-[#e77da8]"
                        >
                          {c.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e77da8]">
                    Help
                  </p>
                  <ul className="mt-4 space-y-2.5">
                    <li>
                      <Link
                        to="/#faqs"
                        className="text-sm font-medium text-[#704456] transition hover:text-[#e77da8]"
                      >
                        FAQs
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/checkout/customer"
                        className="text-sm font-medium text-[#704456] transition hover:text-[#e77da8]"
                      >
                        Checkout
                      </Link>
                    </li>
                    <li>
                      <a
                        href={whatsappLink(
                          'Hi SoCutesy! I have a question about my order.',
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-[#704456] transition hover:text-[#e77da8]"
                      >
                        Order support
                      </a>
                    </li>
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#e77da8]">
                    Contact
                  </p>
                  <ul className="mt-4 space-y-3">
                    {contactLinks.map((item) => {
                      const Icon = item.icon
                      const className =
                        'group flex items-center gap-2 rounded-2xl border border-[#f5b5cf]/90 bg-[#fff7fa] px-2.5 py-2.5 text-xs font-medium text-[#704456] shadow-sm transition hover:border-[#e77da8] hover:bg-[#ffe4ef] hover:shadow-md sm:gap-3 sm:px-3 sm:text-sm'
                      const content = (
                        <>
                          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#fdeef4] text-[#e77da8] transition group-hover:bg-[#e77da8] group-hover:text-white sm:h-9 sm:w-9">
                            <Icon className="h-4 w-4" />
                          </span>
                          <span className="min-w-0 truncate">{item.label}</span>
                        </>
                      )
                      return (
                        <li key={item.label}>
                          {item.external ? (
                            <a
                              href={item.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={className}
                            >
                              {content}
                            </a>
                          ) : (
                            <a href={item.href} className={className}>
                              {content}
                            </a>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center justify-between gap-3 bg-[#fdeef4]/50 px-6 py-4 text-center sm:flex-row sm:px-10 sm:text-left">
            <p className="text-xs text-[#9ca3af]">
              © {year} socutesy. All rights reserved.
            </p>
            <p className="text-xs font-medium text-[#c49aa8]">
              Made with care in Pakistan
            </p>
          </div>
        </div>
      </motion.div>
    </footer>
  )
}
