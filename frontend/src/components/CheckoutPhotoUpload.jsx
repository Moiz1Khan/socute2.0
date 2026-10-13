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
    <div className="rounded-2xl border border-[#f6b6cc] bg-[#fffcfd] p-4 shadow-sm sm:p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#fdf0f5] text-[#e66f98]">
          <IconCamera className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-[#493c43]">Your pictures</h2>
          <p className="mt-1 text-xs leading-relaxed text-[#e66f98]/90">
            Add pictures that you want on your product — otherwise the order
            won&apos;t proceed.
          </p>
          {productLabels.length > 0 && (
            <p className="mt-1.5 text-xs text-[#6b7280]">
              Needed for:{' '}
              <span className="font-medium text-[#e66f98]">
                {productLabels.join(', ')}
              </span>
            </p>
          )}
        </div>
      </div>

      <div className="mt-4">
        {atPhotoLimit ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#f6b6cc] bg-[#fdf0f5] px-4 py-8 text-center">
            <p className="text-sm font-semibold text-[#493c43]">
              Enough pictures added
            </p>
            <p className="mt-1 text-xs text-[#9ca3af]">
              Remove a photo below to add a different one.
            </p>
          </div>
        ) : (
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#f6b6cc] bg-[#fffcfd] px-4 py-8 transition hover:border-[#f6b6cc] hover:bg-[#fdf0f5]">
            <IconCamera className="h-9 w-9 text-[#f6b6cc]" />
            <span className="mt-2 text-sm font-semibold text-[#493c43]">
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
          <p className="text-xs font-semibold uppercase tracking-wide text-[#e66f98]">
            Preview
          </p>
          <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {files.map((item, i) => (
              <li
                key={item.previewUrl}
                className="relative overflow-hidden rounded-2xl border border-[#fdf0f5] bg-[#fffcfd] shadow-sm"
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
            className="mt-3 text-xs font-medium text-[#e66f98] underline hover:text-[#d45a88]"
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
