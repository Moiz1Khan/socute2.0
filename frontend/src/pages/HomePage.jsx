import { useEffect } from 'react'
import { useLocation, useNavigate, useNavigationType } from 'react-router-dom'
import { ReelStudioHero } from '../components/home/ReelStudioHero'
import { CategoryQuickNav } from '../components/home/CategoryQuickNav'
import { CategoryShelf } from '../components/home/CategoryShelf'
import { HowToOrder } from '../components/home/HowToOrder'
import { ReviewsBlock } from '../components/home/ReviewsBlock'
import { FaqSection } from '../components/FaqSection'
import { SiteFooter } from '../components/SiteFooter'
import { hasSavedScrollPosition } from '../components/ListingScrollMemory'
import { useShop } from '../context/ShopContext'
import { getCategoryLabel } from '../utils/shopConfig'
import { categories } from '../utils/products'

/**
 * Soft section rhythm — warm white dominant, blush used sparingly.
 * Original category order preserved.
 */
const CATEGORY_TONES = {
  polaroids: 'ivory',
  stationery: 'soft',
  cards: 'ivory',
  albums: 'soft',
  frames: 'ivory',
  gifting: 'soft',
}

function scrollToElement(id, behavior = 'smooth') {
  const el = document.getElementById(id)
  if (!el) return
  const offset = 96
  const top = el.getBoundingClientRect().top + window.scrollY - offset
  window.scrollTo({ top: Math.max(0, top), left: 0, behavior })
}

export default function HomePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const navigationType = useNavigationType()
  const { setCategoryFilter, setFilterLabel, clearProductFilters } = useShop()

  useEffect(() => {
    const hash = location.hash?.replace(/^#/, '')
    if (!hash) return undefined

    // Browser Back/Forward: ListingScrollMemory restores exact Y. Re-scrolling
    // to the hash section caused the upward jump. Initial loads / direct hash
    // links still use POP with no saved Y — those should jump to the section.
    if (navigationType === 'POP' && hasSavedScrollPosition(location.key)) {
      return undefined
    }

    const behavior = navigationType === 'POP' ? 'auto' : 'smooth'
    const run = () => {
      if (behavior === 'auto') {
        const html = document.documentElement
        const prev = html.style.scrollBehavior
        html.style.scrollBehavior = 'auto'
        scrollToElement(hash, 'auto')
        html.style.scrollBehavior = prev
      } else {
        scrollToElement(hash, 'smooth')
      }
    }
    run()
    const t = window.setTimeout(run, navigationType === 'POP' ? 40 : 80)
    return () => window.clearTimeout(t)
  }, [location.hash, location.key, navigationType])

  const selectCategory = (id) => {
    clearProductFilters()
    setCategoryFilter(id)
    setFilterLabel(getCategoryLabel(id))
    navigate(
      {
        pathname: '/',
        hash: `#section-${id}`,
        search: location.search,
      },
      { preventScrollReset: true },
    )
  }

  return (
    <div className="store-home">
      <ReelStudioHero onCategory={selectCategory} />
      <CategoryQuickNav onSelect={selectCategory} />

      {categories.map((c, i) => (
        <CategoryShelf
          key={c.id}
          categoryId={c.id}
          tone={CATEGORY_TONES[c.id] ?? (i % 2 === 0 ? 'ivory' : 'soft')}
          isFirst={i === 0}
        />
      ))}

      <HowToOrder />
      <ReviewsBlock />
      <FaqSection />
      <SiteFooter />
    </div>
  )
}
