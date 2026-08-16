/**
 * Product-specific ordering: upload vs contact-only WhatsApp flows.
 */

/** @type {Set<string>} */
export const UPLOAD_PRODUCT_SLUGS = new Set([
  'polaroids',
  'mini-photobook',
  'photobooth-strips',
  'mini-bouquet',
  'keepsake-frame',
  'mini-frame',
])

/**
 * Checkout has no per-product photo caps — customers may upload as many as they need.
 * Kept for API compatibility; always returns no min/max.
 * @param {string | null | undefined} _slug
 * @param {number} [_orderQty]
 * @returns {{ min: number | null, max: number | null }}
 */
export function getUploadPhotoRequirements(_slug, _orderQty = 1) {
  return { min: null, max: null }
}

/** @deprecated Use getUploadPhotoRequirements */
export function getUploadPhotoLimit(slug) {
  return getUploadPhotoRequirements(slug).max
}

/** @type {Set<string>} */
export const CONTACT_PRODUCT_SLUGS = new Set([
  'custom-magazine',
  'newspaper',
  'mini-album',
  'coloring-book',
])

/**
 * @param {string} slug
 * @returns {'upload' | 'contact'}
 */
export function getOrderFlowType(slug) {
  if (UPLOAD_PRODUCT_SLUGS.has(slug)) return 'upload'
  if (CONTACT_PRODUCT_SLUGS.has(slug)) return 'contact'
  return 'contact'
}

/**
 * Whether checkout must collect personal photos for this order.
 * Bookmarks, stickers, cards, etc. are not in UPLOAD_PRODUCT_SLUGS.
 * @param {{
 *   checkoutSource?: string
 *   slug?: string | null
 *   cartSnapshot?: { slug: string, name?: string, qty?: number }[] | null
 * }} p
 */
export function orderNeedsPhotos(p) {
  if (p.checkoutSource === 'cart') {
    return Boolean(p.cartSnapshot?.some((i) => UPLOAD_PRODUCT_SLUGS.has(i.slug)))
  }
  return Boolean(p.slug && UPLOAD_PRODUCT_SLUGS.has(p.slug))
}

/** Max pictures allowed on the checkout details photo step. */
export const CHECKOUT_PHOTO_MAX = 12

/**
 * Checkout photo card: require photos for upload products (max CHECKOUT_PHOTO_MAX).
 * @param {{
 *   checkoutSource?: string
 *   slug?: string | null
 *   cartSnapshot?: { slug: string, name?: string, qty?: number }[] | null
 * }} p
 * @returns {{ needed: boolean, max: number, productLabels: string[] }}
 */
export function getCheckoutPhotoRequirements(p) {
  if (p.checkoutSource === 'cart') {
    const lines = (p.cartSnapshot ?? []).filter((i) =>
      UPLOAD_PRODUCT_SLUGS.has(i.slug),
    )
    if (!lines.length) {
      return { needed: false, max: CHECKOUT_PHOTO_MAX, productLabels: [] }
    }
    return {
      needed: true,
      max: CHECKOUT_PHOTO_MAX,
      productLabels: lines.map((l) => l.name || l.slug),
    }
  }

  if (!p.slug || !UPLOAD_PRODUCT_SLUGS.has(p.slug)) {
    return { needed: false, max: CHECKOUT_PHOTO_MAX, productLabels: [] }
  }
  return { needed: true, max: CHECKOUT_PHOTO_MAX, productLabels: [] }
}

/** Fixed delivery charge (PKR) when customer opts in. */
export const DELIVERY_CHARGE_RS = 300

/**
 * @param {number} unitPrice
 * @param {boolean} includeDelivery
 */
export function getOrderTotalAmount(unitPrice, includeDelivery) {
  const n = typeof unitPrice === 'number' && !Number.isNaN(unitPrice) ? unitPrice : 0
  return n + (includeDelivery ? DELIVERY_CHARGE_RS : 0)
}

/**
 * 50% advance now, 50% on delivery. Uses floor/remainder so amounts sum to full total.
 * @param {number} fullTotal
 * @returns {{ advance: number, balanceOnDelivery: number }}
 */
export function splitAdvancePayment(fullTotal) {
  const n =
    typeof fullTotal === 'number' && !Number.isNaN(fullTotal)
      ? Math.max(0, Math.round(fullTotal))
      : 0
  const advance = Math.floor(n / 2)
  return { advance, balanceOnDelivery: n - advance }
}

/**
 * @param {{
 *   productName: string
 *   selectionLine?: string
 *   unitPrice: number
 *   quantity?: number
 *   includeDelivery?: boolean
 *   customer: { fullName: string; phone: string; city: string; address: string; notes?: string; includeDelivery?: boolean }
 *   imageCount?: number
 *   orderRef?: string | null
 * }} p
 */
export function buildOrderWhatsAppMessage(p) {
  const qty = Math.max(1, Math.min(99, Math.floor(Number(p.quantity) || 1)))
  const unit =
    typeof p.unitPrice === 'number' && !Number.isNaN(p.unitPrice)
      ? p.unitPrice
      : 0
  const subtotal = unit * qty
  const includeDel =
    (p.includeDelivery ?? p.customer.includeDelivery) !== false
  const total = getOrderTotalAmount(subtotal, includeDel)
  const c = p.customer
  const ref =
    p.orderRef && String(p.orderRef).trim()
      ? `\nOrder ref: ${String(p.orderRef).trim()}\n`
      : '\n'
  return `Hey socutesy! I've completed the advance payment — below is the ss.${ref}
Product: ${p.productName}

Total payment: RS. ${total.toLocaleString()}

Customer details:
Name: ${c.fullName}
Phone: ${c.phone}
City: ${c.city}
Address: ${c.address}`
}

/**
 * Contact-only products (no upload) — short WhatsApp intro.
 * @param {{ productName: string; selectionLine?: string; unitPrice?: number }} p
 */
export function buildContactWhatsAppMessage(p) {
  const price =
    p.unitPrice != null
      ? `\nEstimated price: RS. ${p.unitPrice.toLocaleString()}`
      : ''
  const sel = p.selectionLine?.trim()
  const opt = sel ? `\nOptions: ${sel}` : ''
  return `Hi SoCutesy! I'd like to discuss a custom order for: ${p.productName}${opt}${price}

Please advise on next steps. Thank you!`
}
