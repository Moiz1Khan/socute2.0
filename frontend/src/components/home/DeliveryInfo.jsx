import {
  IconAlbumOutline,
  IconBookOutline,
  IconCardOutline,
  IconPolicyOutline,
  IconShieldOutline,
  IconTruckOutline,
} from '../icons'

/**
 * Delivery & customization — same six topics and wording.
 */
const CARDS = [
  {
    id: 'payment',
    title: 'Payment',
    body: 'Payment is completely online. We take 50% advance payment and the remaining 50% once you receive your order.',
    Icon: IconCardOutline,
  },
  {
    id: 'delivery',
    title: 'Delivery',
    body: 'Delivery usually takes 4–7 working days. Delivery charges are fixed according to courier services.',
    Icon: IconTruckOutline,
  },
  {
    id: 'magazines',
    title: 'Magazines',
    body: 'Our magazines are A4 sized and available in two paper types: soft and hard. The difference is in the texture and thickness of the paper.',
    Icon: IconBookOutline,
  },
  {
    id: 'albums',
    title: 'Albums',
    body: 'Our albums are A5 sized and fully customizable. You can personalize them however you like.',
    Icon: IconAlbumOutline,
  },
  {
    id: 'privacy',
    title: 'Picture privacy',
    body: 'Your privacy is our priority. All pictures are deleted right after your order is completed. Plus, SoCutesy is girl-owned and handled with care.',
    Icon: IconShieldOutline,
  },
  {
    id: 'refunds',
    title: 'Refund policy',
    body: 'Once your order is confirmed, refunds are not available.',
    Icon: IconPolicyOutline,
  },
]

export function DeliveryInfo() {
  return (
    <section
      id="order-info"
      className="store-info store-info--blush"
      aria-labelledby="order-info-heading"
    >
      <div className="store-wrap">
        <header className="store-section-head">
          <p className="store-section-head__label">Details</p>
          <h2 id="order-info-heading" className="store-section-head__title">
            Delivery & Customization
          </h2>
        </header>

        <ul className="store-info-grid">
          {CARDS.map((card) => (
            <li key={card.id} className="store-info-card">
              <span className="store-info-card__icon" aria-hidden>
                <card.Icon className="store-info-card__svg" />
              </span>
              <h3 className="store-info-card__title">{card.title}</h3>
              <p className="store-info-card__body">{card.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
