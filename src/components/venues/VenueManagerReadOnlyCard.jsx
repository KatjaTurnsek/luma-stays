import { Link } from "react-router-dom";

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
          This venue is managed by{" "}
          <strong>{owner?.name || "another host"}</strong>. You can view the
          listing, but bookings are only available from customer accounts.
        </p>

        <div className="venue-details__manager-meta">
          <div>
            <span>Price per night</span>
            <strong>{price} EUR</strong>
          </div>

          <div>
            <span>Max guests</span>
            <strong>{maxGuests}</strong>
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
