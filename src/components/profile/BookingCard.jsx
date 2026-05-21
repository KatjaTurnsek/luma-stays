import { useState } from "react";
import { Link } from "react-router-dom";

import {
  formatBookingDateRange,
  getLocationText,
  getVenueImage,
} from "../../utils/profile-utils";

/**
 * Displays one booking card.
 * @param {object} props - Component props.
 * @param {object} props.booking - Booking data.
 * @param {"customer" | "manager"} props.variant - Card context.
 * @param {Function} [props.onCancelBooking] - Cancel booking handler.
 * @param {boolean} [props.isCancelling] - Cancel loading state.
 * @returns {JSX.Element} Booking card.
 */
export default function BookingCard({
  booking,
  variant = "customer",
  onCancelBooking,
  isCancelling = false,
}) {
  const [isConfirmingCancel, setIsConfirmingCancel] = useState(false);

  const venue = booking.venue || {};
  const venueName = venue.name || booking.venueName || "Venue not added";
  const venueId = venue.id || booking.venueId;
  const imageAlt = venue.media?.[0]?.alt || venueName;
  const locationText = getLocationText(venue.location);
  const dateRange = formatBookingDateRange(booking);
  const guests = booking.guests || 1;
  const customerName = booking.customer?.name || booking.customerName;
  const canCancel = variant === "customer" && onCancelBooking;

  /**
   * Opens cancel confirmation.
   */
  function handleOpenCancelConfirm() {
    setIsConfirmingCancel(true);
  }

  /**
   * Closes cancel confirmation.
   */
  function handleCloseCancelConfirm() {
    setIsConfirmingCancel(false);
  }

  /**
   * Confirms booking cancellation.
   */
  function handleConfirmCancel() {
    onCancelBooking?.(booking.id);
  }

  const imageElement = (
    <img
      src={getVenueImage(venue)}
      alt={imageAlt}
      width="600"
      height="400"
      loading="lazy"
    />
  );

  return (
    <article className="profile-page__booking-card">
      {venueId ? (
        <Link
          to={`/venues/${venueId}`}
          className="profile-page__booking-card-image"
        >
          {imageElement}
        </Link>
      ) : (
        <div className="profile-page__booking-card-image">{imageElement}</div>
      )}

      <div className="profile-page__booking-card-content">
        <p className="profile-page__booking-card-label">
          {variant === "manager" ? "Customer booking" : "Upcoming stay"}
        </p>

        <h4>
          {venueId ? (
            <Link to={`/venues/${venueId}`}>{venueName}</Link>
          ) : (
            venueName
          )}
        </h4>

        <dl className="profile-page__booking-card-details">
          <div>
            <dt>Dates:</dt>
            <dd>{dateRange}</dd>
          </div>

          <div>
            <dt>Guests:</dt>
            <dd>{guests}</dd>
          </div>

          {locationText !== "Location not added" && (
            <div>
              <dt>Location:</dt>
              <dd>{locationText}</dd>
            </div>
          )}

          {variant === "manager" && customerName && (
            <div>
              <dt>Customer:</dt>
              <dd>{customerName}</dd>
            </div>
          )}
        </dl>

        {canCancel && !isConfirmingCancel && (
          <div className="profile-page__booking-card-actions">
            <button
              type="button"
              className="ui-btn-danger"
              onClick={handleOpenCancelConfirm}
            >
              Cancel booking
            </button>
          </div>
        )}

        {canCancel && isConfirmingCancel && (
          <div className="profile-page__booking-cancel-confirm">
            <p>Cancel this booking?</p>

            <div className="profile-page__booking-cancel-actions">
              <button
                type="button"
                className="ui-btn-secondary"
                onClick={handleCloseCancelConfirm}
                disabled={isCancelling}
              >
                Keep booking
              </button>

              <button
                type="button"
                className="ui-btn-danger"
                onClick={handleConfirmCancel}
                disabled={isCancelling}
              >
                {isCancelling ? "Cancelling..." : "Yes, cancel"}
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
