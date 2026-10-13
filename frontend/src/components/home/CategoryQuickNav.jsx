import { categories } from '../../utils/products'
import { getCategoryLabel } from '../../utils/shopConfig'

/**
 * Compact jump links to existing homepage category sections.
 * Does not invent categories — uses catalog order only.
 */
export function CategoryQuickNav({ onSelect }) {
  return (
    <nav className="cat-quick" aria-label="Shop by category">
      <div className="store-wrap cat-quick__inner">
        <p className="cat-quick__label">Shop by category</p>
        <ul className="cat-quick__list">
          {categories.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                className="cat-quick__chip"
                onClick={() => onSelect?.(c.id)}
              >
                {getCategoryLabel(c.id)}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
