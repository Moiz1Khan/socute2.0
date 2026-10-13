import { Link, useLocation } from 'react-router-dom'

/**
 * Product detail link that records the current listing location for Back.
 * preventDefault on mousedown avoids focus scroll-into-view before navigation
 * (which would corrupt listing scroll restore). Click still fires normally.
 */
export function ProductLink({ slug, children, className, onMouseDown, ...rest }) {
  const location = useLocation()

  return (
    <Link
      to={`/product/${slug}`}
      state={{
        from: {
          pathname: location.pathname,
          search: location.search,
          hash: location.hash,
        },
      }}
      className={className}
      onMouseDown={(event) => {
        if (event.button === 0) event.preventDefault()
        onMouseDown?.(event)
      }}
      {...rest}
    >
      {children}
    </Link>
  )
}
