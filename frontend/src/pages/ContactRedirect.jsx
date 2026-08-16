import { Navigate, useParams, useLocation } from 'react-router-dom'
import { getProductBySlug } from '../utils/products'

/** Legacy `/order/:slug/contact` — all products use customer → payment checkout. */
export default function ContactRedirect() {
  const { slug } = useParams()
  const location = useLocation()
  const product = getProductBySlug(slug)

  if (!product) {
    return <Navigate to="/" replace />
  }

  return (
    <Navigate
      to={`/order/${slug}/customer`}
      replace
      state={location.state}
    />
  )
}
