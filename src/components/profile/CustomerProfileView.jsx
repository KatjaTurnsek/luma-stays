import EmptyState from "./EmptyState";

/**
 * Displays customer-specific profile content.
 * @returns {JSX.Element} Customer view.
 */
export default function CustomerProfileView() {
  return (
    <section className="profile-page__section profile-page__role-section">
      <h2>My bookings</h2>

      <div className="profile-page__section-line"></div>

      <h3 className="profile-page__subheading">Upcoming bookings</h3>

      <EmptyState
        title="No upcoming bookings yet"
        text="When you book a stay, your upcoming bookings will show here."
        linkTo="/venues"
        linkText="Explore stays"
      />
    </section>
  );
}
