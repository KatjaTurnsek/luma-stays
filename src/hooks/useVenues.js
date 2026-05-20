import { useEffect, useState } from "react";

import { getVenues } from "../api/venues-api";
import { formatVenueCardData } from "../utils/venue-utils";

/**
 * Loads venues from the API and formats them for venue card components.
 * Used by the home page and the venues listing page.
 * @param {number} [limit=12] - Number of venues to request from the API.
 * @returns {object} Venue loading state and helpers.
 * @returns {Array} returns.venues - Formatted venue card data.
 * @returns {boolean} returns.isLoadingVenues - Whether venues are currently loading.
 * @returns {string} returns.venuesError - Error message from the venue request.
 * @returns {Function} returns.setVenuesError - Setter used to clear or update the venue error.
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
