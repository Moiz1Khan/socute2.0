import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { HeroBanner } from '../components/HeroBanner'
import { PolaroidsSection } from '../components/PolaroidsSection'
import { PrintablesSection } from '../components/PrintablesSection'
import { MagazinesAlbumsSection } from '../components/MagazinesAlbumsSection'
import { FramesSection } from '../components/FramesSection'
import { ToteBagsSection } from '../components/ToteBagsSection'
import { ProductCarouselSection } from '../components/ProductCarouselSection'
import { FaqSection } from '../components/FaqSection'
import { SiteFooter } from '../components/SiteFooter'
import { ScallopDivider } from '../components/ScallopDivider'
import { categories } from '../utils/products'

export default function HomePage() {
  const location = useLocation()

  useEffect(() => {
    if (location.hash !== '#faqs') return
    const el = document.getElementById('faqs')
    if (!el) return
    const t = setTimeout(() => {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
    return () => clearTimeout(t)
  }, [location.hash])

  return (
    <div className="bg-[#FFF7FA]">
      <HeroBanner />
      <ScallopDivider fill="#FFF7FA" />
      <div id="products-top" className="relative">
        {categories.map((c) => {
          if (c.id === 'polaroids') return <PolaroidsSection key={c.id} />
          if (c.id === 'stationery') return <PrintablesSection key={c.id} />
          if (c.id === 'albums') return <MagazinesAlbumsSection key={c.id} />
          if (c.id === 'frames') return <FramesSection key={c.id} />
          if (c.id === 'tote-bags') return <ToteBagsSection key={c.id} />
          return (
            <ProductCarouselSection
              key={c.id}
              categoryId={c.id}
              title={c.title}
            />
          )
        })}
      </div>
      <ScallopDivider fill="#FFF0F6" />
      <FaqSection />
      <SiteFooter />
    </div>
  )
}
