import { Link } from "react-router-dom";

import Loader from "../Loader";
import UiAlert from "../UiAlert";

import useManagerVenues from "../../hooks/useManagerVenues";

import BookingOverview from "./BookingOverview";
import EmptyState from "./EmptyState";
import ManagerVenueCard from "./ManagerVenueCard";

/**
 * Displays venue manager-specific profile content.
 * @param {object} props - Component props.
 * @param {object} props.auth - Saved auth data.
 * @returns {JSX.Element} Manager view.
 */
export default function VenueManagerProfileView({ auth }) {
  const {
    venues,
    isLoadingVenues,
    venuesError,
    deleteError,
    deleteSuccess,
    deletingVenueId,
    setVenuesError,
    setDeleteError,
    setDeleteSuccess,
    handleDeleteVenue,
  } = useManagerVenues(auth.name);

  const hasVenues = venues.length > 0;

  if (isLoadingVenues) {
    return (
      <section className="profile-page__section profile-page__role-section">
        <Loader text="Loading your venues..." />
      </section>
    );
  }

  if (venuesError) {
    return (
      <section className="profile-page__section profile-page__role-section">
        <UiAlert
          message={venuesError}
          type="error"
          onClose={() => setVenuesError("")}
        />
      </section>
    );
  }

  return (
    <>
      <BookingOverview venues={venues} />

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

        {deleteError && (
          <UiAlert
            message={deleteError}
            type="error"
            onClose={() => setDeleteError("")}
          />
        )}

        {deleteSuccess && (
          <UiAlert
            message={deleteSuccess}
            type="success"
            onClose={() => setDeleteSuccess("")}
          />
        )}

        {hasVenues ? (
          <div className="profile-page__venues-grid">
            {venues.map((venue) => (
              <ManagerVenueCard
                venue={venue}
                key={venue.id}
                isDeleting={deletingVenueId === venue.id}
                onDeleteVenue={handleDeleteVenue}
              />
            ))}
          </div>
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
