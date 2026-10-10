import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Returns to the previous history entry when possible (restores listing scroll),
 * otherwise falls back to the homepage (direct product links / new tabs).
 */
export function useShopBack() {
  const navigate = useNavigate()

  return useCallback(() => {
    const idx = window.history.state?.idx
    if (typeof idx === 'number' && idx > 0) {
      navigate(-1)
      return
    }
    navigate('/')
  }, [navigate])
}
