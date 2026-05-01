import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import VenueCard from "../components/VenueCard";
import Loader from "../components/Loader";
import UiAlert from "../components/UiAlert";

import { getVenues } from "../api/venues-api";

import heroDesktop from "../assets/images/hero-desktop.webp";
import heroMobile from "../assets/images/hero-mobile.webp";
import locationIcon from "../assets/icons/location.svg";
import calendarIcon from "../assets/icons/calendar.svg";
import guestsIcon from "../assets/icons/users.svg";
import chevronDownIcon from "../assets/icons/chevron-down.svg";
import placeholderImage from "../assets/images/venue-01.webp";

import "../styles/home.css";

/**
 * Converts API venue data into the format used by VenueCard.
 * @param {object} venue - Venue from API
 * @returns {object} Formatted venue card data
 */
function formatVenueCardData(venue) {
  return {
    id: venue.id,
    title: venue.name,
    location: venue.location?.city
      ? `${venue.location.city}, ${venue.location.country}`
      : "Location not added",
    price: `${venue.price} EUR / night`,
    guests: `${venue.maxGuests} guests`,
    rating: venue.rating ? venue.rating.toString().replace(".", ",") : "0",
    image: venue.media?.[0]?.url || placeholderImage,
    amenities: getVenueAmenities(venue.meta),
  };
}

/**
 * Gets venue amenity names from API meta data.
 * @param {object} meta - Venue meta data
 * @returns {string[]} Amenity names
 */
function getVenueAmenities(meta) {
  const amenities = [];

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
 * Checks if a venue matches the search text.
 * @param {object} venue - Formatted venue card data
 * @param {string} searchText - Search input value
 * @returns {boolean} True if venue matches search
 */
function venueMatchesSearch(venue, searchText) {
  const normalizedSearch = searchText.trim().toLowerCase();

  if (!normalizedSearch) {
    return true;
  }

  return (
    venue.title.toLowerCase().includes(normalizedSearch) ||
    venue.location.toLowerCase().includes(normalizedSearch)
  );
}

export default function HomePage() {
  const [venues, setVenues] = useState([]);
  const [visibleVenues, setVisibleVenues] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadVenues() {
      try {
        const response = await getVenues();
        const formattedVenues = response.data.map(formatVenueCardData);

        setVenues(formattedVenues);
        setVisibleVenues(formattedVenues.slice(0, 3));
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadVenues();
  }, []);

  function handleSearchSubmit(event) {
    event.preventDefault();

    const matchingVenues = venues.filter((venue) =>
      venueMatchesSearch(venue, searchValue)
    );

    setVisibleVenues(matchingVenues.slice(0, 3));
  }

  return (
    <>
      <section className="home-hero">
        <picture>
          <source srcSet={heroMobile} media="(max-width: 767px)" />
          <img src={heroDesktop} alt="Wooden cabin in nature" />
        </picture>

        <div className="home-hero__text">
          <h1>Stay somewhere worth remembering</h1>
          <p>
            Find beautiful stays with space to relax, reconnect, and make the
            trip feel special.
          </p>
        </div>

        <form
          className="home-search"
          aria-label="Search stays"
          onSubmit={handleSearchSubmit}
        >
          <h2>Find your next stay</h2>

          <div className="home-search__line"></div>

          <label className="home-search__field">
            <span className="visually-hidden">Location or stay name</span>
            <input
              type="search"
              placeholder="Location"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
            />
            <span>
              <img src={locationIcon} alt="" aria-hidden="true" />
            </span>
          </label>

          <label className="home-search__field">
            <span className="visually-hidden">Dates</span>
            <input type="text" placeholder="Dates" />
            <span>
              <img src={calendarIcon} alt="" aria-hidden="true" />
            </span>
          </label>

          <label className="home-search__field">
            <span className="visually-hidden">Guests</span>
            <input type="text" placeholder="Guests" />
            <span>
              <img src={guestsIcon} alt="" aria-hidden="true" />
            </span>
          </label>

          <button type="submit" className="ui-btn-primary home-search__button">
            Search
          </button>
        </form>
      </section>

      <section className="home-venues">
        <div className="container">
          <div className="home-venues__header">
            <div>
              <h2>Recently added stays</h2>
              <div className="home-venues__title-line"></div>
            </div>

            <div className="home-sort">
              <button type="button" className="home-sort__button">
                <span>Sort by</span>
                <span className="home-sort__icon">
                  <img src={chevronDownIcon} alt="" aria-hidden="true" />
                </span>
              </button>

              <ul className="home-sort__menu">
                <li>Recently added</li>
                <li>Price: low to high</li>
                <li>Price: high to low</li>
                <li>Rating: highest first</li>
              </ul>
            </div>
          </div>

          {isLoading && <Loader text="Loading stays..." />}

          {errorMessage && <UiAlert message={errorMessage} type="error" />}

          {!isLoading && !errorMessage && visibleVenues.length === 0 && (
            <UiAlert
              message="No stays found. Try another search."
              type="error"
            />
          )}

          {!isLoading && !errorMessage && visibleVenues.length > 0 && (
            <div className="home-venues__grid">
              {visibleVenues.map((venue) => (
                <VenueCard venue={venue} key={venue.id} />
              ))}
            </div>
          )}

          <div className="home-venues__cta">
            <Link to="/venues" className="ui-btn-secondary">
              View more stays
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
