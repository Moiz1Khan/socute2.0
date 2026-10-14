import { Link } from 'react-router-dom'
import { IconInstagram, IconMail, IconWhatsApp } from './icons'
import { whatsappLink } from '../utils/whatsapp'
import { categories } from '../utils/products'
import {
  EMAIL,
  INSTAGRAM_URL,
  WHATSAPP_DISPLAY,
  getCategoryLabel,
} from '../utils/shopConfig'

const WA_HOME = whatsappLink('Hi SoCutesy!')
const WA_SUPPORT = whatsappLink('Hi SoCutesy! I need order support.')

const contactLinks = [
  {
    label: '@socutesyyy_',
    href: INSTAGRAM_URL,
    external: true,
    icon: IconInstagram,
  },
  ...(WA_HOME
    ? [
        {
          label: WHATSAPP_DISPLAY,
          href: WA_HOME,
          external: true,
          icon: IconWhatsApp,
        },
      ]
    : []),
  {
    label: EMAIL,
    href: `mailto:${EMAIL}`,
    external: false,
    icon: IconMail,
  },
]

export function SiteFooter() {
  const year = new Date().getFullYear()

  return (
    <footer className="studio-footer">
      <div className="studio-footer__inner">
        <div className="studio-footer__brand">
          <img
            src="/logo-socutesy.png"
            alt="SoCutesy"
            className="studio-footer__logo"
            width={96}
            height={96}
            loading="lazy"
            decoding="async"
          />
          <p className="studio-footer__tag">
            Personalized gifts made to order in Pakistan.
          </p>
        </div>

        <div className="studio-footer__cols">
          <div>
            <p className="studio-footer__label">Shop</p>
            <ul>
              <li>
                <Link to={{ pathname: '/', hash: '#products-top' }}>
                  Shop All
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <Link to={{ pathname: '/', hash: `#section-${c.id}` }}>
                    {getCategoryLabel(c.id)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="studio-footer__label">Help</p>
            <ul>
              <li>
                <Link to={{ pathname: '/', hash: '#how-to-order' }}>
                  How to Order
                </Link>
              </li>
              <li>
                <Link to={{ pathname: '/', hash: '#faqs' }}>FAQs</Link>
              </li>
              <li>
                <Link to="/checkout/customer">Checkout</Link>
              </li>
              {WA_SUPPORT ? (
                <li>
                  <a
                    href={WA_SUPPORT}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Order support
                  </a>
                </li>
              ) : null}
            </ul>
          </div>
          <div>
            <p className="studio-footer__label">Contact</p>
            <ul>
              {contactLinks.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noopener noreferrer' : undefined}
                      className="studio-footer__contact"
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
      <div className="studio-footer__base">
        <p>© {year} SoCutesy. All rights reserved.</p>
        <p>Ships across Pakistan</p>
      </div>
    </footer>
  )
}
