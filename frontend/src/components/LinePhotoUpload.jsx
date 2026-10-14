import { useCallback, useState } from 'react'
import { IconCamera } from './icons'

const ACCEPT = 'image/jpeg,image/png,image/webp,image/jpg'
const ACCEPT_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/jpg'])
const MAX_BYTES = 15 * 1024 * 1024

/**
 * Per–line-item photo uploader (Workflow B).
 * @param {{
 *   title?: string
 *   hint?: string
 *   files: { file: File; previewUrl: string }[]
 *   min: number
 *   max: number
 *   onAddFiles: (files: File[]) => void
 *   onRemoveAt: (index: number) => void
 *   onClear: () => void
 *   error?: string | null
 * }} props
 */
export function LinePhotoUpload({
  title = 'Upload your pictures',
  hint = 'Upload your pictures here before placing your order.',
  files,
  min,
  max,
  onAddFiles,
  onRemoveAt,
  onClear,
  error = null,
}) {
  const [localError, setLocalError] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const remaining = Math.max(0, max - files.length)
  const atLimit = remaining <= 0
  const displayError = error || localError

  const ingest = useCallback(
    (fileList) => {
      setLocalError(null)
      const incoming = Array.from(fileList || [])
      if (!incoming.length) return
      const accepted = []
      for (const f of incoming) {
        const type = (f.type || '').toLowerCase()
        if (!ACCEPT_TYPES.has(type) && !/\.(jpe?g|png|webp)$/i.test(f.name)) {
          setLocalError('Only JPEG, PNG, or WebP images are allowed.')
          continue
        }
        if (f.size > MAX_BYTES) {
          setLocalError(`Each image must be under ${MAX_BYTES / (1024 * 1024)} MB.`)
          continue
        }
        accepted.push(f)
      }
      if (!accepted.length) return
      onAddFiles(accepted.slice(0, remaining))
    },
    [onAddFiles, remaining],
  )

  const onPick = (e) => {
    ingest(e.target.files)
    e.target.value = ''
  }

  const onDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    if (atLimit) return
    ingest(e.dataTransfer.files)
  }

  return (
    <div className="rounded-2xl border border-[#f6b6cc] bg-[#fffcfd] p-4 shadow-sm sm:p-5">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#fdf0f5] text-[#e66f98]">
          <IconCamera className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-[#493c43]">{title}</h2>
          <p className="mt-1 text-xs leading-relaxed text-[#755f69]">{hint}</p>
          <p className="mt-2 text-xs font-medium text-[#e66f98]">
            {files.length} / {max} selected
            {min > 0 ? ` · need at least ${min}` : ''}
          </p>
        </div>
      </div>

      <div className="mt-4">
        {atLimit ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#f6b6cc] bg-[#fdf0f5] px-4 py-8 text-center">
            <p className="text-sm font-semibold text-[#493c43]">
              All required pictures added
            </p>
            <p className="mt-1 text-xs text-[#9ca3af]">
              Remove a photo below to replace one.
            </p>
          </div>
        ) : (
          <label
            onDragOver={(e) => {
              e.preventDefault()
              setDragOver(true)
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-8 transition ${
              dragOver
                ? 'border-[#e66f98] bg-[#fdf0f5]'
                : 'border-[#f6b6cc] bg-[#fffcfd] hover:border-[#e66f98]/70 hover:bg-[#fdf0f5]'
            }`}
          >
            <IconCamera className="h-9 w-9 text-[#f6b6cc]" />
            <span className="mt-2 text-sm font-semibold text-[#493c43]">
              Tap to upload · or drag & drop
            </span>
            <span className="mt-1 text-xs text-[#9ca3af]">
              JPEG, PNG, WebP · up to 15 MB each · original quality kept
            </span>
            <input
              type="file"
              accept={ACCEPT}
              multiple
              capture="environment"
              className="sr-only"
              onChange={onPick}
            />
          </label>
        )}
      </div>

      {files.length > 0 && (
        <div className="mt-4">
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
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

      {displayError && (
        <p className="mt-3 text-xs font-medium text-[#e11d48]" role="alert">
          {displayError}
        </p>
      )}
    </div>
  )
}
