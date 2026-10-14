/**
 * Business WhatsApp from env (digits only, with country code).
 * Returns empty string when unset — do not invent a number.
 */
export function getWhatsAppNumber() {
  const n = import.meta.env.VITE_WHATSAPP_NUMBER
  return n ? String(n).replace(/\D/g, '') : ''
}

/** True when VITE_WHATSAPP_NUMBER is set with enough digits. */
export function isWhatsAppConfigured() {
  return getWhatsAppNumber().length >= 10
}

export function whatsappCheckoutUrl(items) {
  const phone = getWhatsAppNumber()
  if (!phone) return null
  const lines = items.map((i) => {
    const lineTotal = i.unitPrice * i.qty
    return `• ${i.name} (${i.summary}) × ${i.qty} — RS. ${lineTotal.toLocaleString()}`
  })
  const text = `Hi SoCutesy! I'd like to order:\n\n${lines.join('\n')}\n\nPlease confirm availability & delivery.`
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
}

/**
 * @param {string} text
 * @returns {string | null}
 */
export function whatsappLink(text) {
  const phone = getWhatsAppNumber()
  if (!phone) return null
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
}
