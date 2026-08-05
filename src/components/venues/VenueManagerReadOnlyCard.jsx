import { Link } from "react-router-dom";

/**
 * Gets readable owner name text.
 * @param {object} [owner] - Venue owner.
 * @returns {string} Owner name or fallback text.
 */
function getOwnerName(owner) {
  return owner?.name || "another host";
}

/**
 * Gets readable price text.
 * @param {number|string} price - Venue price per night.
 * @returns {string} Price text.
 */
function getPriceText(price) {
  const priceValue = Number(price);

  if (Number.isNaN(priceValue)) {
    return "Price not added";
  }

  return `${priceValue} EUR`;
}

/**
 * Gets readable max guests text.
 * @param {number|string} maxGuests - Maximum guests allowed.
 * @returns {string} Max guests text.
 */
function getMaxGuestsText(maxGuests) {
  const guestCount = Number(maxGuests);

  if (guestCount === 1) {
    return "1 guest";
  }

  if (Number.isNaN(guestCount) || guestCount < 1) {
    return "Guests not added";
  }

  return `${guestCount} guests`;
}

/**
 * Shows a read-only card when a venue manager views a venue they do not own.
 * @param {object} props - Component props.
 * @param {object} [props.owner] - Venue owner.
 * @param {number|string} props.price - Venue price per night.
 * @param {number|string} props.maxGuests - Maximum guests allowed.
 * @returns {JSX.Element} Read-only manager card.
 */
export default function VenueManagerReadOnlyCard({ owner, price, maxGuests }) {
  return (
    <aside
      className="venue-details__manager-card"
      aria-labelledby="manager-readonly-title"
    >
      <div className="venue-details__manager-top">
        <p className="venue-details__manager-label">Manager view</p>

        <h2 id="manager-readonly-title">Viewing another venue</h2>
      </div>

      <div className="venue-details__manager-content">
        <p>
          This venue is managed by <strong>{getOwnerName(owner)}</strong>. You
          can view the listing, but bookings are only available from customer
          accounts.
        </p>

        <div className="venue-details__manager-meta">
          <div>
            <span>Price per night</span>
            <strong>{getPriceText(price)}</strong>
          </div>

          <div>
            <span>Max guests</span>
            <strong>{getMaxGuestsText(maxGuests)}</strong>
          </div>
        </div>

        <div className="venue-details__manager-actions">
          <Link to="/venues" className="ui-btn-secondary">
            Back to venues
          </Link>
        </div>
      </div>
    </aside>
  );
}
