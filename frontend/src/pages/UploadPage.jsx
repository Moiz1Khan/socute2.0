import { Navigate, useParams, useLocation } from 'react-router-dom'
import { getProductBySlug } from '../utils/products'

/**
 * Legacy `/order/:slug/upload` — photos are collected on the checkout details page.
 */
export default function UploadPage() {
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
