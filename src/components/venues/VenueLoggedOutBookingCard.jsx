import { Link } from "react-router-dom";

/**
 * Shows a booking teaser when a logged-out visitor views a venue.
 * @param {object} props - Component props.
 * @param {number|string} props.price - Venue price per night.
 * @param {number|string} props.maxGuests - Maximum guests allowed.
 * @returns {JSX.Element} Logged-out booking teaser card.
 */
export default function VenueLoggedOutBookingCard({ price, maxGuests }) {
  return (
    <aside
      className="venue-details__manager-card"
      aria-labelledby="logged-out-booking-title"
    >
      <div className="venue-details__manager-top">
        <p className="venue-details__manager-label">Guest view</p>

        <h2 id="logged-out-booking-title">Ready to book this stay?</h2>
      </div>

      <div className="venue-details__manager-content">
        <p>
          Log in to check available dates and book this venue with Luma Stays.
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
          <Link to="/login" className="ui-btn-primary">
            Log in to book
          </Link>

          <Link to="/register" className="ui-btn-secondary">
            Create account
          </Link>
        </div>
      </div>
    </aside>
  );
}
