import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getProductBySlug } from '../utils/products'
import {
  DELIVERY_CHARGE_RS,
  getOrderTotalAmount,
  splitAdvancePayment,
} from '../utils/orderFlow'
import { useOrderFlow } from '../context/OrderFlowContext'
import { formatOrderRef } from '../utils/formatOrderRef'
import { useCart } from '../context/CartContext'
import { confirmOrder } from '../api/ordersApi'
import { IconCamera } from '../components/icons'

const PAYMENT_ACCOUNT = {
  method: 'JazzCash',
  number: '0322 7784397',
  name: 'Sehar Naseer',
}

export default function PaymentPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const isCartCheckout = location.pathname === '/checkout/payment'
  const product = !isCartCheckout && slug ? getProductBySlug(slug) : null
  const { clearCart } = useCart()
  const {
    productName,
    unitPrice,
    orderQty,
    checkoutSource,
    cartSnapshot,
    customer,
    serverOrderId,
    clearOrder,
  } = useOrderFlow()

  const [paymentFile, setPaymentFile] = useState(null)
  const [paymentPreview, setPaymentPreview] = useState(null)
  const [confirming, setConfirming] = useState(false)
  const [confirmError, setConfirmError] = useState(null)
  const [showConfirmed, setShowConfirmed] = useState(false)

  useEffect(() => {
    if (isCartCheckout) {
      if (checkoutSource !== 'cart' || !cartSnapshot?.length) {
        navigate('/', { replace: true })
      }
      return
    }
    if (!product) {
      navigate('/', { replace: true })
    }
  }, [isCartCheckout, checkoutSource, cartSnapshot, product, navigate])

  useEffect(() => {
    if (isCartCheckout) {
      if (!customer) {
        navigate('/checkout/customer', { replace: true })
      }
      return
    }
    if (!product) return
    if (!customer) {
      navigate(`/order/${slug}/customer`, { replace: true })
    }
  }, [isCartCheckout, product, slug, customer, navigate])

  useEffect(() => {
    return () => {
      if (paymentPreview) URL.revokeObjectURL(paymentPreview)
    }
  }, [paymentPreview])

  const ready =
    customer &&
    (isCartCheckout
      ? checkoutSource === 'cart' && cartSnapshot?.length
      : Boolean(product))
  if (!ready || !customer) return null

  const includeDelivery = customer.includeDelivery !== false
  const qty = Math.max(1, orderQty || 1)
  const lineSubtotal = unitPrice * qty
  const orderTotal = getOrderTotalAmount(lineSubtotal, includeDelivery)
  const { advance, balanceOnDelivery } = splitAdvancePayment(orderTotal)

  const customerPath = isCartCheckout
    ? '/checkout/customer'
    : `/order/${slug}/customer`

  const onPickProof = (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setConfirmError('Please upload an image of your payment screenshot.')
      return
    }
    setConfirmError(null)
    if (paymentPreview) URL.revokeObjectURL(paymentPreview)
    setPaymentFile(file)
    setPaymentPreview(URL.createObjectURL(file))
  }

  const clearProof = () => {
    if (paymentPreview) URL.revokeObjectURL(paymentPreview)
    setPaymentFile(null)
    setPaymentPreview(null)
  }

  const handleConfirm = async () => {
    if (!paymentFile || !serverOrderId || confirming) return
    setConfirmError(null)
    setConfirming(true)
    try {
      await confirmOrder(serverOrderId, paymentFile)
      setShowConfirmed(true)
    } catch (e) {
      setConfirmError(
        e instanceof Error ? e.message : 'Could not confirm your order',
      )
    } finally {
      setConfirming(false)
    }
  }

  const finishAndGoHome = () => {
    if (isCartCheckout) clearCart()
    clearOrder()
    clearProof()
    setShowConfirmed(false)
    navigate('/')
  }

  return (
    <main className="min-h-[70vh] bg-[#fffcfd] px-4 py-10 sm:px-6 lg:py-14">
      <div className="mx-auto max-w-2xl">
        <Link
          to={customerPath}
          className="mb-6 inline-flex text-sm font-semibold text-[#e66f98] transition hover:text-[#e66f98]"
        >
          ← Back to details
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-5"
        >
          <div className="overflow-hidden rounded-[2rem] border border-[#f6b6cc]/90 bg-[#fffcfd] shadow-xl shadow-[#e66f98]/15">
            <div className="bg-[#e66f98] px-6 py-6 sm:px-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/75">
                Step 2 of 2
              </p>
              <h1 className="mt-1 font-display text-3xl font-semibold text-white sm:text-4xl">
                Advance payment
              </h1>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-white/90">
                Pay{' '}
                <span className="font-semibold text-white">50% now</span> to
                confirm your order, then upload your payment screenshot below.
              </p>
            </div>

            <div className="space-y-5 px-6 py-6 sm:px-8 sm:py-8">
              {serverOrderId && (
                <div className="rounded-2xl border border-[#f6b6cc] bg-[#fffcfd] px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[#e66f98]">
                    Order reference
                  </p>
                  <p className="mt-1 font-mono text-lg tracking-wide text-[#493c43]">
                    {formatOrderRef(serverOrderId)}
                  </p>
                  <p className="mt-1 text-[11px] text-[#9ca3af]">
                    Keep this ID handy for your records.
                  </p>
                </div>
              )}

              <div className="rounded-2xl border border-[#fdf0f5] bg-[#fffcfd] px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#e66f98]">
                  How payment works
                </p>
                <ul className="mt-3 space-y-2.5 text-sm text-[#4b5563]">
                  <li className="flex gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#fdf0f5] text-xs font-bold text-[#e66f98]">
                      1
                    </span>
                    <span>
                      Pay{' '}
                      <strong className="font-semibold text-[#493c43]">
                        50% advance
                      </strong>{' '}
                      now to confirm your order.
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#fdf0f5] text-xs font-bold text-[#e66f98]">
                      2
                    </span>
                    <span>
                      Remaining{' '}
                      <strong className="font-semibold text-[#493c43]">
                        50% is due on delivery
                      </strong>
                      .
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#fdf0f5] text-xs font-bold text-[#e66f98]">
                      3
                    </span>
                    <span>
                      Payment is{' '}
                      <strong className="font-semibold text-[#493c43]">
                        fully online via JazzCash
                      </strong>
                      . We do not offer cash on delivery.
                    </span>
                  </li>
                </ul>
              </div>

              <div className="rounded-2xl border border-[#fdf0f5] bg-[#fffcfd] px-4 py-4 text-sm">
                {isCartCheckout && cartSnapshot ? (
                  <>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-[#e66f98]">
                      Cart items
                    </p>
                    <ul className="mt-2 space-y-2 border-b border-[#fdf0f5] pb-3">
                      {cartSnapshot.map((line) => (
                        <li
                          key={line.lineId}
                          className="flex justify-between gap-4 text-xs sm:text-sm"
                        >
                          <span className="text-[#6b7280]">
                            {line.name}
                            {line.summary ? ` (${line.summary})` : ''} ×{' '}
                            {line.qty}
                          </span>
                          <span className="shrink-0 tabular-nums text-[#493c43]">
                            RS. {(line.unitPrice * line.qty).toLocaleString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-3 flex justify-between gap-4 font-medium">
                      <span className="text-[#6b7280]">Subtotal</span>
                      <span className="tabular-nums text-[#493c43]">
                        RS. {lineSubtotal.toLocaleString()}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between gap-4">
                      <span className="text-[#6b7280]">
                        {productName || 'Subtotal'}
                        {qty > 1 ? ` (${qty}×)` : ''}
                      </span>
                      <span className="font-medium tabular-nums text-[#493c43]">
                        RS. {lineSubtotal.toLocaleString()}
                      </span>
                    </div>
                    {qty > 1 && (
                      <div className="mt-1 flex justify-between gap-4 text-xs text-[#9ca3af]">
                        <span>Unit price</span>
                        <span className="tabular-nums">
                          RS. {unitPrice.toLocaleString()} each
                        </span>
                      </div>
                    )}
                  </>
                )}
                <div className="mt-2 flex justify-between gap-4">
                  <span className="text-[#6b7280]">Delivery</span>
                  <span className="font-medium tabular-nums text-[#493c43]">
                    {includeDelivery
                      ? `RS. ${DELIVERY_CHARGE_RS.toLocaleString()}`
                      : '—'}
                  </span>
                </div>
                <div className="mt-3 flex justify-between gap-4 border-t border-[#fdf0f5] pt-3 font-medium">
                  <span className="text-[#6b7280]">Order total</span>
                  <span className="tabular-nums text-[#493c43]">
                    RS. {orderTotal.toLocaleString()}
                  </span>
                </div>
                <div className="mt-3 flex justify-between gap-4 rounded-2xl bg-gradient-to-r from-[#fdf0f5] to-[#fdf0f5] px-4 py-3 font-semibold">
                  <span className="text-[#e66f98]">Pay now (50% advance)</span>
                  <span className="tabular-nums text-[#e66f98]">
                    RS. {advance.toLocaleString()}
                  </span>
                </div>
                <div className="mt-2 flex justify-between gap-4 text-[#6b7280]">
                  <span>Due on delivery (50%)</span>
                  <span className="tabular-nums">
                    RS. {balanceOnDelivery.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#f6b6cc]/80 bg-[#fffcfd] p-6 shadow-lg shadow-[rgba(73,60,67,0.08)] sm:p-8">
            <h2 className="font-display text-xl font-semibold text-[#493c43]">
              JazzCash details
            </h2>
            <p className="mt-2 text-sm text-[#6b7280]">
              Send the{' '}
              <span className="font-semibold text-[#493c43]">
                50% advance (RS. {advance.toLocaleString()})
              </span>{' '}
              to this account.
            </p>

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl border border-[#fdf0f5] bg-[#fffcfd] px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#e66f98]">
                  Method
                </p>
                <p className="mt-1 text-base font-semibold text-[#493c43]">
                  {PAYMENT_ACCOUNT.method}
                </p>
              </div>
              <div className="rounded-2xl border border-[#fdf0f5] bg-[#fffcfd] px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#e66f98]">
                  Account number
                </p>
                <p className="mt-1 font-mono text-lg tracking-wide text-[#493c43]">
                  {PAYMENT_ACCOUNT.number}
                </p>
              </div>
              <div className="rounded-2xl border border-[#fdf0f5] bg-[#fffcfd] px-4 py-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-[#e66f98]">
                  Account name
                </p>
                <p className="mt-1 text-base font-semibold text-[#493c43]">
                  {PAYMENT_ACCOUNT.name}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#f6b6cc]/80 bg-[#fffcfd] p-6 shadow-lg shadow-[rgba(73,60,67,0.08)] sm:p-8">
            <h2 className="font-display text-xl font-semibold text-[#493c43]">
              Payment screenshot
            </h2>
            <p className="mt-2 text-sm text-[#6b7280]">
              Upload a clear screenshot of your JazzCash payment to confirm this
              order.
            </p>

            <div className="mt-5">
              {paymentPreview ? (
                <div className="relative overflow-hidden rounded-2xl border border-[#fdf0f5] bg-[#fffcfd]">
                  <img
                    src={paymentPreview}
                    alt="Payment screenshot preview"
                    className="max-h-64 w-full object-contain bg-[#fffcfd]"
                  />
                  <button
                    type="button"
                    onClick={clearProof}
                    className="absolute right-3 top-3 rounded-full bg-black/50 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-black/70"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#f6b6cc] bg-[#fffcfd] px-4 py-10 transition hover:border-[#f6b6cc] hover:bg-[#fdf0f5]">
                  <IconCamera className="h-9 w-9 text-[#f6b6cc]" />
                  <span className="mt-2 text-sm font-semibold text-[#493c43]">
                    Tap to upload payment screenshot
                  </span>
                  <span className="mt-1 text-xs text-[#9ca3af]">PNG, JPG</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={onPickProof}
                  />
                </label>
              )}
            </div>

            {confirmError && (
              <p
                className="mt-4 rounded-2xl border border-[#f6b6cc] bg-[#fdf0f5] px-4 py-3 text-sm text-[#493c43]"
                role="alert"
              >
                {confirmError}
              </p>
            )}

            <button
              type="button"
              disabled={!paymentFile || !serverOrderId || confirming}
              onClick={handleConfirm}
              className="mt-6 w-full rounded-2xl bg-[#e66f98] px-6 py-4 text-sm font-semibold text-white shadow-lg shadow-[rgba(73,60,67,0.12)] transition hover:brightness-105 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {confirming ? 'Confirming order…' : 'Confirm order'}
            </button>
            {!serverOrderId && (
              <p className="mt-3 text-xs text-[#e66f98]">
                Order was not saved. Go back to details and try again.
              </p>
            )}
          </div>
        </motion.div>
      </div>

      {showConfirmed && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="order-confirmed-title"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="w-full max-w-md overflow-hidden rounded-[2rem] border border-[#f6b6cc]/80 bg-[#fffcfd] shadow-2xl shadow-[rgba(73,60,67,0.12)]"
          >
            <div className="bg-[#e66f98] px-6 py-5">
              <h2
                id="order-confirmed-title"
                className="font-display text-2xl font-semibold text-white"
              >
                Your order is confirmed
              </h2>
            </div>
            <div className="px-6 py-6">
              <p className="text-sm leading-relaxed text-[#493c43]">
                You will be notified shortly after verification.
              </p>
              {serverOrderId && (
                <p className="mt-3 text-xs text-[#6b7280]">
                  Order ref:{' '}
                  <span className="font-mono font-semibold text-[#493c43]">
                    {formatOrderRef(serverOrderId)}
                  </span>
                </p>
              )}
              <button
                type="button"
                onClick={finishAndGoHome}
                className="mt-6 w-full rounded-2xl bg-[#e66f98] px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-[rgba(73,60,67,0.12)] transition hover:brightness-105"
              >
                Back to shop
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  )
}
