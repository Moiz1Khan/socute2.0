/**
 * Checkout no longer enforces per-product photo min/max.
 * Kept for API compatibility with the upload route.
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
