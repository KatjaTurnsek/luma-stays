import { Link } from "react-router-dom";

/**
 * Formats a booking date for display.
 * @param {string} value - ISO date string.
 * @returns {string} Formatted date.
 */
function formatBookingDate(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Date not added";
  }

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/**
 * Gets a timestamp from a booking start date.
 * Invalid dates are placed last when sorting.
 * @param {object} booking - Customer booking.
 * @returns {number} Booking start timestamp.
 */
function getBookingStartTime(booking) {
  const date = new Date(booking?.dateFrom);

  if (Number.isNaN(date.getTime())) {
    return Number.MAX_SAFE_INTEGER;
  }

  return date.getTime();
}

/**
 * Sorts bookings by start date.
 * @param {Array<object>} bookings - Customer bookings for this venue.
 * @returns {Array<object>} Sorted bookings.
 */
function sortBookingsByDate(bookings) {
  return [...bookings].sort(
    (firstBooking, secondBooking) =>
      getBookingStartTime(firstBooking) - getBookingStartTime(secondBooking)
  );
}

/**
 * Gets a stable key for a booking item.
 * @param {object} booking - Customer booking.
 * @returns {string} Booking key.
 */
function getBookingKey(booking) {
  return booking?.id || `${booking?.dateFrom}-${booking?.dateTo}`;
}

/**
 * Gets readable guest count text.
 * @param {number|string} guests - Booking guest count.
 * @returns {string} Guest count text.
 */
function getGuestText(guests) {
  const guestCount = Number(guests);

  if (guestCount === 1) {
    return "1 guest";
  }

  return `${guestCount || 0} guests`;
}

/**
 * Shows a customer's existing booking summary for the current venue.
 * @param {object} props - Component props.
 * @param {Array<object>} [props.bookings=[]] - Customer bookings for this venue.
 * @returns {JSX.Element|null} Customer booking notice.
 */
export default function CustomerVenueBookingNotice({ bookings = [] }) {
  if (bookings.length === 0) {
    return null;
  }

  const sortedBookings = sortBookingsByDate(bookings);
  const bookingCountText =
    bookings.length === 1
      ? "You have 1 upcoming booking for this stay."
      : `You have ${bookings.length} upcoming bookings for this stay.`;

  return (
    <section
      className="venue-booking-card__customer-booking-notice"
      aria-labelledby="customer-booking-notice-title"
    >
      <h3 id="customer-booking-notice-title">Your bookings</h3>

      <p>{bookingCountText}</p>

      <div className="venue-booking-card__customer-booking-list">
        {sortedBookings.map((booking, index) => (
          <article
            className="venue-booking-card__customer-booking-item"
            key={getBookingKey(booking)}
          >
            <h4>Booking {index + 1}</h4>

            <dl className="venue-booking-card__customer-booking-details">
              <div>
                <dt>Check-in</dt>
                <dd>{formatBookingDate(booking.dateFrom)}</dd>
              </div>

              <div>
                <dt>Check-out</dt>
                <dd>{formatBookingDate(booking.dateTo)}</dd>
              </div>

              <div>
                <dt>Guests</dt>
                <dd>{getGuestText(booking.guests)}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>

      <Link
        to="/profile"
        className="ui-btn-secondary venue-booking-card__notice-link"
      >
        View my bookings
      </Link>
    </section>
  );
}
