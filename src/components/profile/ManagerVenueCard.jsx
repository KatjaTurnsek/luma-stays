import { useState } from "react";
import { Link } from "react-router-dom";

import {
  getLocationText,
  getUpcomingBookings,
  getVenueImage,
} from "../../utils/profile-utils";

import locationIcon from "../../assets/icons/location.svg";

/**
 * Displays one managed venue card.
 * @param {object} props - Component props.
 * @param {object} props.venue - Venue data.
 * @param {boolean} props.isDeleting - Delete loading state.
 * @param {Function} props.onDeleteVenue - Delete handler.
 * @returns {JSX.Element} Manager venue card.
 */
export default function ManagerVenueCard({ venue, isDeleting, onDeleteVenue }) {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const upcomingBookings = getUpcomingBookings([venue]);
  const bookingCount = upcomingBookings.length;

  /**
   * Opens delete confirmation.
   */
  function handleOpenDeleteConfirm() {
    setIsConfirmingDelete(true);
  }

  /**
   * Closes delete confirmation.
   */
  function handleCancelDelete() {
    setIsConfirmingDelete(false);
  }

  /**
   * Confirms venue deletion.
   */
  function handleConfirmDelete() {
    onDeleteVenue(venue.id);
  }

  return (
    <article className="profile-page__manager-card">
      <p className="profile-page__manager-card-label">
        {bookingCount > 0
          ? `${bookingCount} upcoming booking${bookingCount === 1 ? "" : "s"}`
          : "No upcoming bookings"}
      </p>

      <Link to={`/venues/${venue.id}`} className="profile-page__manager-image">
        <img
          src={getVenueImage(venue)}
          alt={venue.media?.[0]?.alt || venue.name}
          width="600"
          height="400"
          loading="lazy"
        />
      </Link>

      <div className="profile-page__manager-card-content">
        <h3>
          <Link to={`/venues/${venue.id}`}>{venue.name}</Link>
        </h3>

        <div className="profile-page__manager-location">
          <img
            src={locationIcon}
            alt=""
            aria-hidden="true"
            width="24"
            height="24"
          />
          <span>{getLocationText(venue.location)}</span>
        </div>
      </div>

      <div className="profile-page__manager-card-meta">
        <p>{venue.price} EUR / night</p>
        <p>{venue.maxGuests} guests</p>
      </div>

      {isConfirmingDelete ? (
        <div className="profile-page__delete-confirm">
          <p>Delete this venue?</p>

          <div className="profile-page__delete-confirm-actions">
            <button
              type="button"
              className="ui-btn-secondary"
              onClick={handleCancelDelete}
              disabled={isDeleting}
            >
              Cancel
            </button>

            <button
              type="button"
              className="ui-btn-danger"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Yes, delete"}
            </button>
          </div>
        </div>
      ) : (
        <div className="profile-page__manager-card-actions">
          <button
            type="button"
            className="ui-btn-danger"
            onClick={handleOpenDeleteConfirm}
          >
            Delete
          </button>

          <Link to={`/venues/${venue.id}/edit`} className="ui-btn-primary">
            Edit
          </Link>
        </div>
      )}
    </article>
  );
}
