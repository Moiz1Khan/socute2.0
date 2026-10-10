import { IconCamera } from './icons'
import { CHECKOUT_PHOTO_MAX } from '../utils/orderFlow'

/**
 * Photo upload card for checkout (buy-now + cart).
 * Enforces max silently — no min/max copy in the UI.
 * @param {{
 *   files: { file: File; previewUrl: string }[]
 *   onAddFiles: (files: File[]) => void
 *   onRemoveAt: (index: number) => void
 *   onClear: () => void
 *   photoMax?: number
 *   productLabels?: string[]
 *   error?: string | null
 * }} props
 */
export function CheckoutPhotoUpload({
  files,
  onAddFiles,
  onRemoveAt,
  onClear,
  photoMax = CHECKOUT_PHOTO_MAX,
  productLabels = [],
  error = null,
}) {
  const atPhotoLimit = files.length >= photoMax
  const remainingSlots = Math.max(0, photoMax - files.length)

  const onPick = (e) => {
    const list = e.target.files
    if (!list?.length) return
    const incoming = Array.from(list).slice(0, remainingSlots)
    if (incoming.length) onAddFiles(incoming)
    e.target.value = ''
  }

  return (
    <div className="rounded-2xl border border-[#fbcfe8] bg-[#fff7fa] p-4 shadow-sm sm:p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#ffe4ef] text-[#E77DA8]">
          <IconCamera className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-[#704456]">Your pictures</h2>
          <p className="mt-1 text-xs leading-relaxed text-[#a85c7b]/90">
            Add pictures that you want on your product — otherwise the order
            won&apos;t proceed.
          </p>
          {productLabels.length > 0 && (
            <p className="mt-1.5 text-xs text-[#6b7280]">
              Needed for:{' '}
              <span className="font-medium text-[#a85c7b]">
                {productLabels.join(', ')}
              </span>
            </p>
          )}
        </div>
      </div>

      <div className="mt-4">
        {atPhotoLimit ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#fbcfe8] bg-[#ffe4ef] px-4 py-8 text-center">
            <p className="text-sm font-semibold text-[#704456]">
              Enough pictures added
            </p>
            <p className="mt-1 text-xs text-[#9ca3af]">
              Remove a photo below to add a different one.
            </p>
          </div>
        ) : (
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#fbcfe8] bg-[#fff7fa] px-4 py-8 transition hover:border-[#f9a8d4] hover:bg-[#ffe4ef]">
            <IconCamera className="h-9 w-9 text-[#f9a8d4]" />
            <span className="mt-2 text-sm font-semibold text-[#704456]">
              Tap to upload images
            </span>
            <span className="mt-1 text-xs text-[#9ca3af]">PNG, JPG</span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={onPick}
            />
          </label>
        )}
      </div>

      {files.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#be185d]">
            Preview
          </p>
          <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {files.map((item, i) => (
              <li
                key={item.previewUrl}
                className="relative overflow-hidden rounded-2xl border border-[#fce7f3] bg-[#fff7fa] shadow-sm"
              >
                <img
                  src={item.previewUrl}
                  alt=""
                  className="aspect-square w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => onRemoveAt(i)}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/50 text-sm font-bold text-white transition hover:bg-black/70"
                  aria-label={`Remove image ${i + 1}`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={onClear}
            className="mt-3 text-xs font-medium text-[#db2777] underline hover:text-[#be185d]"
          >
            Clear all
          </button>
        </div>
      )}

      {error && (
        <p className="mt-3 text-xs font-medium text-[#e11d48]" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
