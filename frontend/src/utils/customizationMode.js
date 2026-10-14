/**
 * Product customization workflows.
 * A = WhatsApp after order submission
 * B = on-site photo upload (per cart line)
 */

/** @type {ReadonlySet<string>} */
export const PHOTO_UPLOAD_SLUGS = new Set([
  'polaroids',
  'photobooth-strips',
  'mini-photobook',
])

/** @type {ReadonlySet<string>} */
export const WHATSAPP_CUSTOM_SLUGS = new Set([
  'custom-magazine',
  'mini-album',
  'songbook',
  'coloring-book',
  'newspaper',
  'cd-journal',
  'phone-case',
  'tote-bag',
  'cards',
  'scrapbook-card',
  'stickers',
  'bookmarks',
  'mini-bouquet',
  'mini-frame',
  'keepsake-frame',
])

/**
 * @param {string | null | undefined} slug
 * @returns {'photos' | 'whatsapp' | 'none'}
 */
export function getCustomizationMode(slug) {
  if (!slug) return 'none'
  if (PHOTO_UPLOAD_SLUGS.has(slug)) return 'photos'
  if (WHATSAPP_CUSTOM_SLUGS.has(slug)) return 'whatsapp'
  return 'none'
}

/**
 * @param {string | null | undefined} slug
 */
export function isPhotoUploadProduct(slug) {
  return getCustomizationMode(slug) === 'photos'
}

/**
 * @param {string | null | undefined} slug
 */
export function isWhatsAppCustomProduct(slug) {
  return getCustomizationMode(slug) === 'whatsapp'
}

/**
 * Photo quantity rules for a cart/order line.
 * Uses catalog photosRequired / photosPerUnit when available — no universal cap of 12.
 *
 * @param {{
 *   slug: string
 *   qty?: number
 *   designPhotosRequired?: number | null
 *   photosPerUnit?: number | null
 * }} p
 * @returns {{ min: number, max: number }}
 */
export function getLinePhotoRequirements(p) {
  const qty = Math.max(1, Math.min(99, Math.floor(Number(p.qty)) || 1))
  const perDesign =
    typeof p.designPhotosRequired === 'number' && p.designPhotosRequired > 0
      ? Math.floor(p.designPhotosRequired)
      : null
  const perUnit =
    typeof p.photosPerUnit === 'number' && p.photosPerUnit > 0
      ? Math.floor(p.photosPerUnit)
      : null

  if (perDesign != null) {
    const min = perDesign * qty
    return { min, max: min }
  }

  if (perUnit != null) {
    const min = perUnit * qty
    return { min, max: min }
  }

  if (p.slug === 'polaroids') {
    return { min: qty, max: qty }
  }

  if (p.slug === 'mini-photobook') {
    return { min: 10 * qty, max: 10 * qty }
  }

  // Configurable fallback — require at least one photo, generous max
  return { min: 1, max: Math.max(20, qty * 10) }
}

/**
 * Prefill WhatsApp message after order submission (no sensitive PII).
 * @param {{
 *   orderRef: string
 *   customerFirstName?: string | null
 *   products: { name: string; summary?: string }[]
 * }} p
 */
export function buildCustomizationWhatsAppMessage(p) {
  const ref = String(p.orderRef || '').trim() || 'your order'
  const productList = (p.products || [])
    .map((x) => {
      const name = x.name || 'product'
      const sum = x.summary?.trim()
      return sum ? `${name} (${sum})` : name
    })
    .join(', ')
  const who = p.customerFirstName?.trim()
  const intro = who
    ? `Hi SoCutesy! 💗 I'm ${who}. I've placed order #${ref}`
    : `Hi SoCutesy! 💗 I've placed order #${ref}`
  const forPart = productList
    ? ` for ${productList}`
    : ' for a personalized gift'
  return `${intro}${forPart}. I'd like to share my pictures, text, and customization details here.`
}
