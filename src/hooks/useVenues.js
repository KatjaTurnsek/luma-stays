import { useEffect, useState } from "react";

import { getVenues } from "../api/venues-api";
import { formatVenueCardData } from "../utils/venue-utils";

/**
 * Gets normalized venue loading options.
 * Keeps old useVenues(12) calls working while allowing useVenues({ limit, pages }).
 * @param {number|object} options - Venue loading options or old limit value.
 * @returns {{ limit: number, pages: number }} Normalized venue options.
 */
function getVenueLoadOptions(options) {
  if (typeof options === "number") {
    return {
      limit: options,
      pages: 1,
    };
  }

  return {
    limit: options?.limit || 12,
    pages: options?.pages || 1,
  };
}

/**
 * Removes duplicate venues by ID.
 * @param {Array<object>} venues - Venue data from the API.
 * @returns {Array<object>} Unique venues.
 */
function getUniqueVenues(venues) {
  const uniqueVenues = new Map();

  venues.forEach((venue) => {
    if (venue?.id) {
      uniqueVenues.set(venue.id, venue);
    }
  });

  return Array.from(uniqueVenues.values());
}

/**
 * Loads venues from the API and formats them for venue card components.
 * Used by the home page and the venues listing page.
 * @param {number|object} [options=12] - Number limit or loading options.
 * @returns {object} Venue loading state and helpers.
 * @returns {Array} returns.venues - Formatted venue card data.
 * @returns {boolean} returns.isLoadingVenues - Whether venues are currently loading.
 * @returns {string} returns.venuesError - Error message from the venue request.
 * @returns {Function} returns.setVenuesError - Setter used to clear or update the venue error.
 */
export default function useVenues(options = 12) {
  const [venues, setVenues] = useState([]);
  const [isLoadingVenues, setIsLoadingVenues] = useState(true);
  const [venuesError, setVenuesError] = useState("");

  const { limit, pages } = getVenueLoadOptions(options);

  useEffect(() => {
    let isMounted = true;

    async function loadVenues() {
      setIsLoadingVenues(true);
      setVenuesError("");

      try {
        const venueResults = [];

        for (let page = 1; page <= pages; page += 1) {
          const response = await getVenues(limit, page);
          venueResults.push(...(response?.data || []));

          if (response?.meta?.isLastPage) {
            break;
          }
        }

        const formattedVenues =
          getUniqueVenues(venueResults).map(formatVenueCardData);

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
  }, [limit, pages]);

  return {
    venues,
    isLoadingVenues,
    venuesError,
    setVenuesError,
  };
}
