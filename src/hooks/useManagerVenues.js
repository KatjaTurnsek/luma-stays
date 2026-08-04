import { useEffect, useState } from "react";

import { deleteVenue, getProfileVenues } from "../api/venues-api";

/**
 * Loads and manages venues owned by a venue manager profile.
 * @param {string} profileName - Logged-in venue manager profile name.
 * @returns {object} Manager venue state and handlers.
 */
export default function useManagerVenues(profileName) {
  const [venues, setVenues] = useState([]);
  const [isLoadingVenues, setIsLoadingVenues] = useState(true);
  const [venuesError, setVenuesError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deleteSuccess, setDeleteSuccess] = useState("");
  const [deletingVenueId, setDeletingVenueId] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadOwnedVenues() {
      setIsLoadingVenues(true);
      setVenuesError("");

      try {
        const response = await getProfileVenues(profileName);

        if (isMounted) {
          setVenues(response?.data || []);
        }
      } catch (error) {
        if (isMounted) {
          setVenuesError(error.message || "Could not load your venues.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingVenues(false);
        }
      }
    }

    if (profileName) {
      loadOwnedVenues();
    }

    return () => {
      isMounted = false;
    };
  }, [profileName]);

  /**
   * Deletes a venue and removes it from the profile UI.
   * @param {string} venueId - Venue ID.
   * @returns {Promise<void>}
   */
  async function handleDeleteVenue(venueId) {
    setDeleteError("");
    setDeleteSuccess("");
    setDeletingVenueId(venueId);

    try {
      await deleteVenue(venueId);

      setVenues((currentVenues) =>
        currentVenues.filter((venue) => venue.id !== venueId)
      );

      setDeleteSuccess("Venue deleted successfully.");
    } catch (error) {
      setDeleteError(error.message || "Could not delete venue.");
    } finally {
      setDeletingVenueId("");
    }
  }

  return {
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
  };
}
