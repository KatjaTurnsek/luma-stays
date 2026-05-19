import { useEffect, useState } from "react";

import Loader from "../components/Loader";
import UiAlert from "../components/UiAlert";
import VenueCard from "../components/VenueCard";

import { getVenues } from "../api/venues-api";

import placeholderImage from "../assets/images/venue-01.webp";

import "../styles/venues.css";

/**
 * Gets readable location text from API location data.
 * @param {object} location - Venue location data.
 * @returns {string} Location text.
 */
function getLocationText(location) {
  const city = location?.city;
  const country = location?.country;

  if (city && country) {
    return `${city}, ${country}`;
  }

  if (city) {
    return city;
  }

  if (country) {
    return country;
  }

  return "Location not added";
}

/**
 * Gets venue amenity names from API meta data.
 * @param {object} meta - Venue meta data.
 * @returns {string[]} Amenity names.
 */
function getVenueAmenities(meta) {
  const amenities = [];

  if (meta?.wifi) {
    amenities.push("wifi");
  }

  if (meta?.parking) {
    amenities.push("parking");
  }

  if (meta?.pets) {
    amenities.push("pets");
  }

  if (meta?.breakfast) {
    amenities.push("breakfast");
  }

  return amenities;
}

/**
 * Converts API venue data into the format used by VenueCard.
 * @param {object} venue - Venue from API.
 * @returns {object} Formatted venue card data.
 */
function formatVenueCardData(venue) {
  return {
    id: venue.id,
    title: venue.name,
    location: getLocationText(venue.location),
    price: `${venue.price} EUR / night`,
    guests: `${venue.maxGuests} guests`,
    rating: venue.rating ? venue.rating.toString().replace(".", ",") : "0",
    image: venue.media?.[0]?.url || placeholderImage,
    amenities: getVenueAmenities(venue.meta),
  };
}

export default function VenuesPage() {
  const [venues, setVenues] = useState([]);
  const [visibleCount, setVisibleCount] = useState(9);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadVenues() {
      try {
        const response = await getVenues(100);
        const formattedVenues = (response?.data || []).map(formatVenueCardData);

        setVenues(formattedVenues);
      } catch (error) {
        setErrorMessage(error.message || "Could not load venues.");
      } finally {
        setIsLoading(false);
      }
    }

    loadVenues();
  }, []);

  const visibleVenues = venues.slice(0, visibleCount);
  const hasMoreVenues = visibleCount < venues.length;

  function handleLoadMore() {
    setVisibleCount((currentCount) => currentCount + 9);
  }

  return (
    <div className="venues-page">
      <section className="venues-page__intro">
        <div className="container">
          <h1>Explore stays</h1>
          <p>Find the perfect place for your next trip.</p>
        </div>
      </section>

      <section className="venues-page__content">
        <div className="container">
          {isLoading && <Loader text="Loading stays..." />}

          {!isLoading && errorMessage && (
            <UiAlert
              message={errorMessage}
              type="error"
              onClose={() => setErrorMessage("")}
            />
          )}

          {!isLoading && !errorMessage && venues.length === 0 && (
            <UiAlert
              message="No stays are available right now. Please check again later."
              type="info"
            />
          )}

          {!isLoading && !errorMessage && venues.length > 0 && (
            <>
              <div className="venues-page__header">
                <h2>{venues.length} stays found</h2>
              </div>

              <div className="venues-page__grid">
                {visibleVenues.map((venue) => (
                  <VenueCard venue={venue} key={venue.id} />
                ))}
              </div>

              {hasMoreVenues && (
                <div className="venues-page__cta">
                  <button
                    type="button"
                    className="ui-btn-secondary"
                    onClick={handleLoadMore}
                  >
                    Load more stays
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
