import { useEffect, useState } from "react";

import { getVenues } from "../api/venues-api";
import { formatVenueCardData } from "../utils/venue-utils";

/**
 * Loads and formats venues for venue card views.
 * @param {number} limit - Number of venues to request.
 * @returns {object} Venue loading state and helpers.
 */
export default function useVenues(limit = 12) {
  const [venues, setVenues] = useState([]);
  const [isLoadingVenues, setIsLoadingVenues] = useState(true);
  const [venuesError, setVenuesError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadVenues() {
      setIsLoadingVenues(true);
      setVenuesError("");

      try {
        const response = await getVenues(limit);
        const formattedVenues = (response?.data || []).map(formatVenueCardData);

        if (isMounted) {
          setVenues(formattedVenues);
        }
      } catch (error) {
        if (isMounted) {
          setVenuesError(error.message || "Could not load stays.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingVenues(false);
        }
      }
    }

    loadVenues();

    return () => {
      isMounted = false;
    };
  }, [limit]);

  return {
    venues,
    isLoadingVenues,
    venuesError,
    setVenuesError,
  };
}
