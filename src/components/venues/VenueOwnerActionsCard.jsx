import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import UiAlert from "../UiAlert";

import { deleteVenue } from "../../api/venues-api";

/**
 * Shows edit and delete actions for a venue owned by the logged-in manager.
 * @param {object} props - Component props.
 * @param {string} props.venueId - Venue ID.
 * @returns {JSX.Element} Owner manager actions card.
 */
export default function VenueOwnerActionsCard({ venueId }) {
  const navigate = useNavigate();

  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);

  /**
   * Deletes the current venue and redirects the manager back to profile.
   */
  async function handleDeleteVenue() {
    setDeleteError("");
    setIsDeleting(true);

    try {
      await deleteVenue(venueId);
      navigate("/profile", { replace: true });
    } catch (error) {
      setDeleteError(error.message || "Could not delete venue.");
      setIsDeleting(false);
      setIsDeleteConfirmVisible(false);
    }
  }

  return (
    <aside
      className="venue-details__manager-card"
      aria-labelledby="manager-actions-title"
    >
      <div className="venue-details__manager-top">
        <p className="venue-details__manager-label">Manager view</p>

        <h2 id="manager-actions-title">Manage this venue</h2>
      </div>

      <div className="venue-details__manager-content">
        <p>
          You own this venue. Edit the listing details or remove it from Luma
          Stays.
        </p>

        {deleteError && (
          <UiAlert
            message={deleteError}
            type="error"
            onClose={() => setDeleteError("")}
          />
        )}

        <div className="venue-details__manager-actions">
          <Link to={`/venues/${venueId}/edit`} className="ui-btn-primary">
            Edit venue
          </Link>

          {!isDeleteConfirmVisible && (
            <button
              type="button"
              className="ui-btn-danger"
              onClick={() => setIsDeleteConfirmVisible(true)}
            >
              Delete venue
            </button>
          )}
        </div>

        {isDeleteConfirmVisible && (
          <div className="venue-details__delete-confirmation">
            <p>
              Deleting this venue cannot be undone. Are you sure you want to
              continue?
            </p>

            <div className="venue-details__manager-actions">
              <button
                type="button"
                className="ui-btn-secondary"
                onClick={() => setIsDeleteConfirmVisible(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>

              <button
                type="button"
                className="ui-btn-danger"
                onClick={handleDeleteVenue}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Confirm delete"}
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
