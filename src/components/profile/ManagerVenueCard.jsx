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
 * @returns {JSX.Element} Manager venue card.
 */
export default function ManagerVenueCard({ venue }) {
  const upcomingBookings = getUpcomingBookings([venue]);
  const bookingCount = upcomingBookings.length;

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
        />
      </Link>

      <div className="profile-page__manager-card-content">
        <h3>
          <Link to={`/venues/${venue.id}`}>{venue.name}</Link>
        </h3>

        <div className="profile-page__manager-location">
          <img src={locationIcon} alt="" aria-hidden="true" />
          <span>{getLocationText(venue.location)}</span>
        </div>
      </div>

      <div className="profile-page__manager-card-meta">
        <p>{venue.price} EUR / night</p>
        <p>{venue.maxGuests} guests</p>
      </div>

      <div className="profile-page__manager-card-actions">
        <button type="button" className="ui-btn-danger" disabled>
          Delete
        </button>

        <Link to={`/venues/${venue.id}/edit`} className="ui-btn-secondary">
          Edit
        </Link>
      </div>
    </article>
  );
}
