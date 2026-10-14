/**
 * Order totals + checkout helpers.
 * Customization mode lives in customizationMode.js
 */

import {
  getCustomizationMode,
  getLinePhotoRequirements,
  isPhotoUploadProduct,
  isWhatsAppCustomProduct,
  PHOTO_UPLOAD_SLUGS,
  WHATSAPP_CUSTOM_SLUGS,
} from './customizationMode'

export {
  getCustomizationMode,
  getLinePhotoRequirements,
  isPhotoUploadProduct,
  isWhatsAppCustomProduct,
  PHOTO_UPLOAD_SLUGS,
  WHATSAPP_CUSTOM_SLUGS,
}

/** @deprecated Use PHOTO_UPLOAD_SLUGS */
export const UPLOAD_PRODUCT_SLUGS = PHOTO_UPLOAD_SLUGS

/** @deprecated Use WHATSAPP_CUSTOM_SLUGS */
export const CONTACT_PRODUCT_SLUGS = WHATSAPP_CUSTOM_SLUGS

/**
 * @param {string} slug
 * @returns {'upload' | 'contact' | 'none'}
 */
export function getOrderFlowType(slug) {
  const mode = getCustomizationMode(slug)
  if (mode === 'photos') return 'upload'
  if (mode === 'whatsapp') return 'contact'
  return 'none'
}

/**
 * @deprecated Prefer getLinePhotoRequirements
 * @param {string | null | undefined} slug
 * @param {number} [_orderQty]
 */
export function getUploadPhotoRequirements(slug, _orderQty = 1) {
  if (!slug || !isPhotoUploadProduct(slug)) {
    return { min: null, max: null }
  }
  const r = getLinePhotoRequirements({ slug, qty: _orderQty })
  return { min: r.min, max: r.max }
}

/** @deprecated */
export function getUploadPhotoLimit(slug) {
  return getUploadPhotoRequirements(slug).max
}

/**
 * Whether this checkout needs on-site photos (any photo-upload product).
 * @param {{
 *   checkoutSource?: string
 *   slug?: string | null
 *   cartSnapshot?: { slug: string, name?: string, qty?: number, lineId?: string }[] | null
 * }} p
 */
export function orderNeedsPhotos(p) {
  if (p.checkoutSource === 'cart') {
    return Boolean(p.cartSnapshot?.some((i) => isPhotoUploadProduct(i.slug)))
  }
  return Boolean(p.slug && isPhotoUploadProduct(p.slug))
}

/**
 * Lines that need WhatsApp customization after submission.
 * @param {{
 *   checkoutSource?: string
 *   slug?: string | null
 *   productName?: string
 *   selectionSummary?: string
 *   cartSnapshot?: { slug: string, name?: string, summary?: string }[] | null
 * }} p
 */
export function getWhatsAppCustomLines(p) {
  if (p.checkoutSource === 'cart') {
    return (p.cartSnapshot ?? [])
      .filter((i) => isWhatsAppCustomProduct(i.slug))
      .map((i) => ({
        name: i.name || i.slug,
        summary: i.summary || '',
        slug: i.slug,
      }))
  }
  if (p.slug && isWhatsAppCustomProduct(p.slug)) {
    return [
      {
        name: p.productName || p.slug,
        summary: p.selectionSummary || '',
        slug: p.slug,
      },
    ]
  }
  return []
}

/**
 * Photo-upload lines for checkout validation / UI.
 * @param {{
 *   checkoutSource?: string
 *   slug?: string | null
 *   productName?: string
 *   orderQty?: number
 *   cartSnapshot?: {
 *     lineId: string
 *     slug: string
 *     name?: string
 *     qty?: number
 *     productId?: string
 *     designPhotosRequired?: number | null
 *     photosPerUnit?: number | null
 *   }[] | null
 * }} p
 */
export function getPhotoUploadLines(p) {
  if (p.checkoutSource === 'cart') {
    return (p.cartSnapshot ?? [])
      .filter((i) => isPhotoUploadProduct(i.slug))
      .map((i) => {
        const req = getLinePhotoRequirements({
          slug: i.slug,
          qty: i.qty ?? 1,
          designPhotosRequired: i.designPhotosRequired,
          photosPerUnit: i.photosPerUnit,
        })
        return {
          lineId: i.lineId,
          slug: i.slug,
          name: i.name || i.slug,
          productId: i.productId || '',
          qty: i.qty ?? 1,
          min: req.min,
          max: req.max,
        }
      })
  }

  if (!p.slug || !isPhotoUploadProduct(p.slug)) return []
  const req = getLinePhotoRequirements({
    slug: p.slug,
    qty: p.orderQty ?? 1,
  })
  return [
    {
      lineId: `buy-now:${p.slug}`,
      slug: p.slug,
      name: p.productName || p.slug,
      productId: '',
      qty: p.orderQty ?? 1,
      min: req.min,
      max: req.max,
    },
  ]
}

/**
 * @deprecated Prefer getPhotoUploadLines
 */
export function getCheckoutPhotoRequirements(p) {
  const lines = getPhotoUploadLines(p)
  if (!lines.length) {
    return { needed: false, max: 0, min: 0, productLabels: [], lines: [] }
  }
  const max = lines.reduce((s, l) => s + l.max, 0)
  const min = lines.reduce((s, l) => s + l.min, 0)
  return {
    needed: true,
    max,
    min,
    productLabels: lines.map((l) => l.name),
    lines,
  }
}

/** @deprecated Prefer per-line getLinePhotoRequirements — kept for legacy UI */
export const CHECKOUT_PHOTO_MAX = 50

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
 * 50% advance now, 50% on delivery.
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
 * @deprecated Legacy payment WhatsApp message — prefer confirmation WhatsApp CTA
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
 * @deprecated
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
