import { Link, Navigate } from "react-router-dom";

import { getAuth } from "../utils/auth-storage";

import userIcon from "../assets/icons/user.svg";

import "../styles/profile.css";

/**
 * Gets the best available avatar URL from auth data.
 * @param {object} auth - Saved auth data.
 * @returns {string|null} Avatar URL or null.
 */
function getAvatarUrl(auth) {
  return auth?.avatar?.url || null;
}

/**
 * Displays the shared profile summary.
 * @param {object} props - Component props.
 * @param {object} props.auth - Saved auth data.
 * @returns {JSX.Element} Profile summary section.
 */
function ProfileSummary({ auth }) {
  const avatarUrl = getAvatarUrl(auth);
  const accountType = auth?.venueManager ? "Venue manager" : "Customer";

  return (
    <section className="profile-page__section profile-page__summary-section">
      <h2>Profile summary</h2>

      <div className="profile-page__section-line"></div>

      <div className="profile-page__summary">
        <div className="profile-page__avatar-wrap">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={`${auth.name} avatar`}
              className="profile-page__avatar"
            />
          ) : (
            <div className="profile-page__avatar profile-page__avatar--fallback">
              <img src={userIcon} alt="" aria-hidden="true" />
            </div>
          )}
        </div>

        <div>
          <h3>{auth?.name || "UserName"}</h3>
          <p>{auth?.email || "yourname@stud.noroff.no"}</p>
          <p className="profile-page__account-type">{accountType}</p>
        </div>
      </div>

      <div className="profile-page__summary-actions">
        <Link to="/profile/avatar" className="ui-btn-secondary">
          Edit profile
        </Link>
      </div>
    </section>
  );
}

/**
 * Displays an empty state card.
 * @param {object} props - Component props.
 * @param {string} props.title - Empty state title.
 * @param {string} props.text - Empty state text.
 * @param {string} props.linkTo - Link path.
 * @param {string} props.linkText - Link text.
 * @returns {JSX.Element} Empty state.
 */
function EmptyState({ title, text, linkTo, linkText }) {
  return (
    <div className="profile-page__empty-state">
      <h3>{title}</h3>
      <p>{text}</p>
      <Link to={linkTo} className="ui-btn-primary profile-page__empty-link">
        {linkText}
      </Link>
    </div>
  );
}

/**
 * Displays customer-specific profile content.
 * @returns {JSX.Element} Customer view.
 */
function CustomerProfileView() {
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

/**
 * Displays venue manager-specific profile content.
 * @returns {JSX.Element} Manager view.
 */
function VenueManagerProfileView() {
  const venues = [];
  const hasVenues = venues.length > 0;

  return (
    <>
      <section className="profile-page__section profile-page__role-section">
        <h2>Booking overview</h2>

        <div className="profile-page__section-line"></div>

        <h3 className="profile-page__subheading">Upcoming bookings</h3>

        <div className="profile-page__empty-state profile-page__empty-state--simple">
          <h3>No upcoming bookings yet</h3>
          <p>
            Bookings for your venues will show here when customers book a stay.
          </p>
        </div>
      </section>

      <section className="profile-page__section profile-page__venues-section">
        <div className="profile-page__section-header">
          <h2>My venues</h2>

          {hasVenues && (
            <Link to="/venues/create" className="ui-btn-primary">
              Create venue
            </Link>
          )}
        </div>

        <div className="profile-page__section-line"></div>

        {hasVenues ? (
          <div className="profile-page__venues-grid"></div>
        ) : (
          <EmptyState
            title="No venues created yet"
            text="Create your first venue so customers can find and book it."
            linkTo="/venues/create"
            linkText="Create venue"
          />
        )}
      </section>
    </>
  );
}

export default function ProfilePage() {
  const auth = getAuth();

  if (!auth?.accessToken) {
    return <Navigate to="/login" replace />;
  }

  const isVenueManager = Boolean(auth?.venueManager);
  const heroText = isVenueManager
    ? "Manage your venues"
    : `Welcome back, ${auth?.name || "UserName"}`;

  return (
    <div className="profile-page">
      <section className="profile-page__hero" aria-label="Profile page intro">
        <div className="profile-page__hero-overlay">
          <h1>{heroText}</h1>
        </div>
      </section>

      <div className="container profile-page__container">
        <div className="profile-page__grid">
          <ProfileSummary auth={auth} />

          {isVenueManager ? (
            <VenueManagerProfileView />
          ) : (
            <CustomerProfileView />
          )}
        </div>
      </div>
    </div>
  );
}
