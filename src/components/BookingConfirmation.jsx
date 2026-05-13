import { Link } from "react-router-dom";

import checkCircleIcon from "../assets/icons/check-circle.svg";

/**
 * Shows a successful booking confirmation.
 * @param {object} props - Component props.
 * @param {object} props.booking - Confirmed booking data.
 * @param {object} props.venue - Venue data.
 * @param {number} props.totalPrice - Total booking price.
 * @param {Function} props.onClose - Close handler.
 * @returns {JSX.Element|null} Booking confirmation component.
 */
export default function BookingConfirmation({
  booking,
  venue,
  totalPrice,
  onClose,
}) {
  if (!booking) {
    return null;
  }

  const dateFrom = new Date(booking.dateFrom).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });

  const dateTo = new Date(booking.dateTo).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
  });

  return (
    <div className="booking-confirmation" role="status" aria-live="polite">
      <div className="booking-confirmation__top">
        <button
          type="button"
          className="booking-confirmation__close"
          onClick={onClose}
          aria-label="Close booking confirmation"
        >
          ×
        </button>
      </div>

      <div className="booking-confirmation__content">
        <div className="booking-confirmation__title-row">
          <img src={checkCircleIcon} alt="" aria-hidden="true" />
          <h2>Booking confirmed</h2>
        </div>

        <dl className="booking-confirmation__details">
          <div>
            <dt>Venue name:</dt>
            <dd>{venue.name}</dd>
          </div>

          <div>
            <dt>Dates:</dt>
            <dd>
              {dateFrom}–{dateTo}
            </dd>
          </div>

          <div>
            <dt>Guests:</dt>
            <dd>{booking.guests}</dd>
          </div>

          <div>
            <dt>Total price:</dt>
            <dd>{totalPrice} EUR</dd>
          </div>
        </dl>

        <Link
          to="/profile"
          className="ui-btn-primary booking-confirmation__link"
        >
          View bookings
        </Link>
      </div>
    </div>
  );
}
