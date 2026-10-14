/**
 * Persists orders + uploads. In dev, Vite proxies `/api` to the API server.
 * Production: set VITE_API_URL to your API origin.
 */
function apiBase() {
  const base = import.meta.env.VITE_API_URL?.replace(/\/$/, '') ?? ''
  return base
}

/**
 * @param {object} payload
 * @returns {Promise<{ id: string }>}
 */
export async function createOrder(payload) {
  const url = `${apiBase()}/api/orders`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    let msg = res.statusText
    try {
      const j = await res.json()
      if (j.error) msg = j.error
    } catch {
      /* ignore */
    }
    throw new Error(msg || `Order save failed (${res.status})`)
  }
  const data = await res.json()
  const rawId = data?.id
  if (typeof rawId === 'string' && rawId.length > 12) {
    console.warn(
      '[orders] API returned a long order id — redeploy/restart the server so /api/health includes orderIdScheme "short8".',
    )
  }
  return data
}

/**
 * Upload photos for one order line item.
 * @param {string} orderId
 * @param {Array<{ file: File } | File>} fileEntries
 * @param {{
 *   lineItemId: string
 *   productId?: string
 *   productSlug?: string
 *   productName?: string
 * }} meta
 */
export async function uploadOrderLinePhotos(orderId, fileEntries, meta) {
  if (!fileEntries?.length) return { ok: true, count: 0 }
  const fd = new FormData()
  for (const item of fileEntries) {
    const f = item?.file instanceof File ? item.file : item
    if (f instanceof File) fd.append('photos', f, f.name)
  }
  fd.append('lineItemId', meta.lineItemId || '')
  fd.append('productId', meta.productId || '')
  fd.append('productSlug', meta.productSlug || '')
  fd.append('productName', meta.productName || '')

  const url = `${apiBase()}/api/orders/${encodeURIComponent(orderId)}/uploads`
  const res = await fetch(url, { method: 'POST', body: fd })
  if (!res.ok) {
    let msg = res.statusText
    try {
      const j = await res.json()
      if (j.error) msg = j.error
    } catch {
      /* ignore */
    }
    throw new Error(msg || `Upload failed (${res.status})`)
  }
  return res.json()
}

/**
 * @deprecated Prefer uploadOrderLinePhotos for per-line association
 * @param {string} orderId
 * @param {Array<{ file: File }>} fileEntries
 */
export async function uploadOrderPhotos(orderId, fileEntries) {
  return uploadOrderLinePhotos(orderId, fileEntries, {
    lineItemId: 'legacy',
    productSlug: '',
    productName: '',
  })
}

/**
 * Submit order with payment screenshot.
 * This records submission + screenshot — it does NOT verify JazzCash payment.
 * @param {string} orderId
 * @param {File} paymentFile
 */
export async function confirmOrder(orderId, paymentFile) {
  if (!(paymentFile instanceof File)) {
    throw new Error('Payment screenshot is required')
  }
  const fd = new FormData()
  fd.append('paymentProof', paymentFile, paymentFile.name)
  const url = `${apiBase()}/api/orders/${encodeURIComponent(orderId)}/confirm`
  const res = await fetch(url, { method: 'POST', body: fd })
  if (!res.ok) {
    let msg = res.statusText
    try {
      const j = await res.json()
      if (j.error) msg = j.error
    } catch {
      /* ignore */
    }
    throw new Error(msg || `Submit failed (${res.status})`)
  }
  return res.json()
}
