import { SatinBow } from './decor/SatinBow'

/**
 * Slim boutique announcement — preserve functional messaging.
 */
export function AnnouncementBar() {
  return (
    <div className="announce-bar" role="region" aria-label="Shop announcement">
      <div className="announce-bar__inner">
        <SatinBow className="announce-bar__bow" opacity={0.9} />
        <p className="announce-bar__text">
          soft girl gifts just dropped · custom orders welcome · Pakistan shipping · so cute it hurts ♡
        </p>
        <span className="announce-bar__heart" aria-hidden>
          ♡
        </span>
      </div>
    </div>
  )
}
