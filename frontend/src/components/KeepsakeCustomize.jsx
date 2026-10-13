import { whatsappLink } from '../utils/whatsapp'

/**
 * Product page: template, size, required text only.
 * Photos are collected on Place order → checkout details page.
 */
export function KeepsakeCustomize({
  product,
  selection,
  onSelectionChange,
  fieldValues,
  onFieldChange,
}) {
  const designs = product.designs ?? []
  const sizes = product.sizes ?? []
  const design = designs[selection.designIndex] ?? designs[0]
  const isCustom = Boolean(design?.whatsappCustom)

  const customWhatsAppHref = whatsappLink(
    `Hi SoCutesy! I want a *custom ${product.name}* template.\n\nSize: ${sizes[selection.sizeIndex]?.size ?? 'standard'}\n\nI will send my reference layout / photos here.`,
  )

  const showSizePicker = sizes.length > 1
  const singleSize = sizes.length === 1 ? sizes[0] : null

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold text-[#e66f98]">Choose template</p>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {designs.map((d, i) => {
            const active = selection.designIndex === i
            return (
              <button
                key={d.id}
                type="button"
                onClick={() =>
                  onSelectionChange({ ...selection, designIndex: i })
                }
                className={`overflow-hidden rounded-2xl border text-left transition ${
                  active
                    ? 'border-[#e66f98] ring-2 ring-[#e66f98]/30'
                    : 'border-[#fdf0f5] hover:border-[#f6b6cc]'
                }`}
              >
                <div className="aspect-square bg-[#fdf0f5]">
                  {d.image ? (
                    <img
                      src={d.image}
                      alt=""
                      className={`h-full w-full ${
                        product.slug === 'photobooth-strips'
                          ? 'object-contain p-1'
                          : 'object-cover'
                      }`}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-[#9ca3af]">
                      Custom
                    </div>
                  )}
                </div>
                <p
                  className={`px-2 py-2 text-[11px] font-semibold leading-snug ${
                    active ? 'text-[#e66f98]' : 'text-[#493c43]'
                  }`}
                >
                  {d.label}
                </p>
              </button>
            )
          })}
        </div>
      </div>

      {showSizePicker ? (
        <div>
          <p className="text-sm font-semibold text-[#e66f98]">Size</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {sizes.map((s, i) => {
              const active = selection.sizeIndex === i
              return (
                <button
                  key={s.size}
                  type="button"
                  onClick={() =>
                    onSelectionChange({ ...selection, sizeIndex: i })
                  }
                  className={`rounded-2xl border px-4 py-2.5 text-sm font-semibold transition ${
                    active
                      ? 'border-[#e66f98] bg-[#e66f98] text-white'
                      : 'border-[#f6b6cc] bg-[#fffcfd] text-[#493c43] hover:bg-[#fdf0f5]'
                  }`}
                >
                  {s.size}
                  <span className="ml-2 font-medium opacity-80">
                    RS. {s.price.toLocaleString()}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      ) : singleSize ? (
        <p className="text-xs text-[#6b7280]">
          Size:{' '}
          <span className="font-semibold text-[#493c43]">{singleSize.size}</span>
          {' · '}
          <span className="font-semibold text-[#493c43]">
            RS. {singleSize.price.toLocaleString()}
          </span>
        </p>
      ) : null}

      {isCustom ? (
        <div className="rounded-2xl border border-dashed border-[#f6b6cc] bg-[#fffcfd] px-4 py-5 text-center">
          <p className="text-sm font-semibold text-[#493c43]">
            Custom template
          </p>
          <p className="mt-2 text-xs leading-relaxed text-[#6b7280]">
            {design.description ??
              'Send your own layout or reference on WhatsApp and we will make it for you.'}
          </p>
          <a
            href={customWhatsAppHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center justify-center rounded-2xl bg-[#e66f98] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[rgba(73,60,67,0.12)] transition hover:brightness-105"
          >
            Send template on WhatsApp
          </a>
        </div>
      ) : (
        <>
          {(design.fields?.length > 0 || design.fieldHint) && (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-[#e66f98]">
                Required text
              </p>
              {design.fieldHint && (
                <p className="text-xs text-[#6b7280]">{design.fieldHint}</p>
              )}
              {design.fields?.map((field) => (
                <label
                  key={field.key}
                  className="block text-xs font-medium text-[#493c43]"
                >
                  {field.label}
                  {field.required ? (
                    <span className="text-[#e66f98]"> *</span>
                  ) : (
                    <span className="font-normal text-[#9ca3af]"> (optional)</span>
                  )}
                  {field.multiline ? (
                    <textarea
                      rows={3}
                      value={fieldValues[field.key] ?? ''}
                      onChange={(e) => onFieldChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="mt-1 w-full rounded-2xl border border-[#f6b6cc] bg-[#fffcfd] px-4 py-3 text-sm font-medium text-[#493c43] shadow-sm outline-none placeholder:text-[#9ca3af] focus:border-[#f6b6cc] focus:ring-2 focus:ring-[#f6b6cc]"
                    />
                  ) : (
                    <input
                      type="text"
                      value={fieldValues[field.key] ?? ''}
                      onChange={(e) => onFieldChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="mt-1 w-full rounded-2xl border border-[#f6b6cc] bg-[#fffcfd] px-4 py-3 text-sm font-medium text-[#493c43] shadow-sm outline-none placeholder:text-[#9ca3af] focus:border-[#f6b6cc] focus:ring-2 focus:ring-[#f6b6cc]"
                    />
                  )}
                </label>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

/**
 * Validate keepsake form before Place order.
 * Photos for the order are collected on the checkout details page.
 * @returns {string | null} error message
 */
export function validateKeepsakeOrder(design, fieldValues) {
  if (!design || design.whatsappCustom) {
    return 'Choose a ready template, or use WhatsApp for a custom design.'
  }
  for (const field of design.fields ?? []) {
    if (field.required && !String(fieldValues[field.key] ?? '').trim()) {
      return `Please fill in: ${field.label}`
    }
  }
  return null
}

export function buildKeepsakeNotes(design, fieldValues, sizeLabel) {
  const lines = [
    `Template: ${design.label}`,
    `Size: ${sizeLabel}`,
  ]
  for (const field of design.fields ?? []) {
    const val = String(fieldValues[field.key] ?? '').trim()
    if (val) lines.push(`${field.label}: ${val}`)
  }
  if (design.photosRequired) {
    lines.push(`Template photos: ${design.photosRequired}`)
  }
  return lines.join('\n')
}
