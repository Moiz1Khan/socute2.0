import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { formatOrderRef } from '../utils/formatOrderRef'
import { buildCustomizationWhatsAppMessage } from '../utils/customizationMode'
import { isWhatsAppConfigured, whatsappLink } from '../utils/whatsapp'
import { INSTAGRAM_URL } from '../utils/shopConfig'
import { useOrderFlow } from '../context/OrderFlowContext'
import { useCart } from '../context/CartContext'

const STORAGE_PREFIX = 'socutesy:confirm:'

/**
 * @returns {object | null}
 */
export function readConfirmationPayload(orderId) {
  try {
    const raw = sessionStorage.getItem(STORAGE_PREFIX + orderId)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

/**
 * @param {string} orderId
 * @param {object} payload
 */
export function writeConfirmationPayload(orderId, payload) {
  try {
    sessionStorage.setItem(STORAGE_PREFIX + orderId, JSON.stringify(payload))
  } catch {
    /* ignore */
  }
}

export default function OrderConfirmationPage() {
  const { orderId } = useParams()
  const navigate = useNavigate()
  const { clearOrder } = useOrderFlow()
  const { clearCart } = useCart()
  const [payload, setPayload] = useState(() =>
    orderId ? readConfirmationPayload(orderId) : null,
  )

  useEffect(() => {
    if (!orderId) {
      navigate('/', { replace: true })
      return
    }
    const p = readConfirmationPayload(orderId)
    if (!p) {
      setPayload(null)
      return
    }
    setPayload(p)
  }, [orderId, navigate])

  const whatsappProducts = payload?.whatsappProducts || []
  const photoProducts = payload?.photoProducts || []
  const needsWhatsApp = whatsappProducts.length > 0
  const orderRef = formatOrderRef(orderId)

  const waHref = useMemo(() => {
    if (!needsWhatsApp || !isWhatsAppConfigured()) return null
    const text = buildCustomizationWhatsAppMessage({
      orderRef,
      customerFirstName: payload?.customerFirstName || null,
      products: whatsappProducts,
    })
    return whatsappLink(text)
  }, [needsWhatsApp, orderRef, payload, whatsappProducts])

  const finish = () => {
    if (payload?.clearCart) clearCart()
    clearOrder()
    navigate('/')
  }

  if (!payload) {
    return (
      <main className="min-h-[70vh] bg-[#fffcfd] px-4 py-16 text-center">
        <p className="font-display text-2xl text-[#493c43]">
          Confirmation details unavailable
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm text-[#6b7280]">
          If you already submitted your order, keep your order reference handy
          and message us on WhatsApp if you still need to share customization
          details.
        </p>
        {orderId && (
          <p className="mt-4 font-mono text-sm text-[#493c43]">
            {formatOrderRef(orderId)}
          </p>
        )}
        <Link
          to="/"
          className="mt-6 inline-block text-sm font-semibold text-[#e66f98]"
        >
          ← Back to shop
        </Link>
      </main>
    )
  }

  return (
    <main className="min-h-[70vh] bg-[#fffcfd] px-4 py-10 sm:px-6 lg:py-14">
      <div className="mx-auto max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="overflow-hidden rounded-[2rem] border border-[#f6b6cc]/80 bg-[#fffcfd] shadow-xl shadow-[rgba(73,60,67,0.08)]"
        >
          <div className="bg-[#e66f98] px-6 py-7 sm:px-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/75">
              Order submitted
            </p>
            <h1 className="mt-1 font-display text-3xl font-semibold text-white sm:text-4xl">
              Your order has been placed! 💗
            </h1>
            <p className="mt-3 font-mono text-sm tracking-wide text-white/95">
              {orderRef}
            </p>
          </div>

          <div className="space-y-5 px-6 py-6 sm:px-8 sm:py-8">
            <p className="text-sm leading-relaxed text-[#493c43]">
              We received your order details and payment screenshot. JazzCash
              payment is checked manually — this page does not mean payment is
              verified yet.
            </p>

            {photoProducts.length > 0 && (
              <div className="rounded-2xl border border-[#fdf0f5] bg-[#fdf0f5]/60 px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#e66f98]">
                  Photos received
                </p>
                <p className="mt-1 text-sm text-[#493c43]">
                  We saved the pictures you uploaded for:{' '}
                  <span className="font-semibold">
                    {photoProducts.map((p) => p.name).join(', ')}
                  </span>
                  .
                </p>
              </div>
            )}

            {needsWhatsApp && (
              <div className="rounded-2xl border border-[#f6b6cc] bg-[#fffcfd] px-4 py-5">
                <p className="font-display text-xl font-semibold text-[#493c43]">
                  Let&apos;s personalize your gift
                </p>
                <p className="mt-2 text-sm leading-relaxed text-[#755f69]">
                  Send us your pictures, text, and customization details on
                  WhatsApp for:{' '}
                  <span className="font-semibold text-[#493c43]">
                    {whatsappProducts.map((p) => p.name).join(', ')}
                  </span>
                  .
                </p>

                {waHref ? (
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 flex w-full items-center justify-center rounded-2xl bg-[#25D366] px-6 py-4 text-sm font-semibold text-white shadow-lg transition hover:brightness-105"
                  >
                    Send Customization Details on WhatsApp
                  </a>
                ) : (
                  <p
                    className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
                    role="alert"
                  >
                    WhatsApp is not configured. Set{' '}
                    <code className="rounded bg-white/80 px-1">
                      VITE_WHATSAPP_NUMBER
                    </code>{' '}
                    (digits with country code) and rebuild the frontend.
                  </p>
                )}

                {waHref && (
                  <p className="mt-3 text-center text-xs text-[#9ca3af]">
                    You can reopen WhatsApp anytime from this page — keep your
                    order reference handy.
                  </p>
                )}

                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 flex w-full items-center justify-center rounded-2xl border border-[#f6b6cc] bg-[#fffcfd] px-6 py-3 text-sm font-semibold text-[#e66f98] transition hover:bg-[#fdf0f5]"
                >
                  Or message us on Instagram
                </a>
                <p className="mt-2 text-center text-[11px] text-[#9ca3af]">
                  Instagram does not support the same prefilled order message as
                  WhatsApp — please include your order reference manually.
                </p>
              </div>
            )}

            {!needsWhatsApp && photoProducts.length > 0 && (
              <p className="text-sm text-[#755f69]">
                You&apos;re all set for now — we&apos;ll review your photos and
                payment screenshot shortly.
              </p>
            )}

            <button
              type="button"
              onClick={finish}
              className="w-full rounded-2xl bg-[#e66f98] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[rgba(73,60,67,0.12)] transition hover:brightness-105"
            >
              Back to shop
            </button>
          </div>
        </motion.div>
      </div>
    </main>
  )
}
