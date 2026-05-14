import { getUpcomingBookings } from "../../utils/profile-utils";

import BookingCard from "./BookingCard";

/**
 * Displays booking overview for manager-owned venues.
 * @param {object} props - Component props.
 * @param {Array} props.venues - Owned venue list.
 * @returns {JSX.Element} Booking overview.
 */
export default function BookingOverview({ venues }) {
  const upcomingBookings = getUpcomingBookings(venues).slice(0, 4);

  return (
    <section className="profile-page__section profile-page__role-section">
      <h2>Booking overview</h2>

      <div className="profile-page__section-line"></div>

      <h3 className="profile-page__subheading">Upcoming bookings</h3>

      {upcomingBookings.length > 0 ? (
        <div className="profile-page__booking-card-list">
          {upcomingBookings.map((booking) => (
            <BookingCard booking={booking} variant="manager" key={booking.id} />
          ))}
        </div>
      ) : (
        <div className="profile-page__empty-state profile-page__empty-state--simple">
          <h3>No upcoming bookings yet</h3>
          <p>
            Bookings for your venues will show here when customers book a stay.
          </p>
        </div>
      )}
    </section>
  );
}
