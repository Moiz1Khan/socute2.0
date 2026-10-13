/**
 * Editorial section heading — refined eyebrow, serif title, soft rule.
 */
export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  align = 'center',
  className = '',
}) {
  const isLeft = align === 'left'

  return (
    <header
      className={`section-heading ${isLeft ? 'section-heading--left' : ''} ${className}`}
    >
      {eyebrow ? <p className="section-heading__eyebrow">{eyebrow}</p> : null}

      <div className="section-heading__title-row">
        <h2 id={id} className="section-heading__title font-display">
          {title}
        </h2>
      </div>

      <div className="section-heading__rule" aria-hidden />

      {description && <p className="section-heading__desc">{description}</p>}
    </header>
  )
}
