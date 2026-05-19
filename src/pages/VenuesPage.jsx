import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Loader from "../components/Loader";
import UiAlert from "../components/UiAlert";
import VenueCard from "../components/VenueCard";

import { getVenues } from "../api/venues-api";
import { filterVenues, formatVenueCardData } from "../utils/venue-utils";

import locationIcon from "../assets/icons/location.svg";
import guestsIcon from "../assets/icons/users.svg";

import "../styles/venues.css";

export default function VenuesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [venues, setVenues] = useState([]);
  const [visibleCount, setVisibleCount] = useState(9);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const searchValue = searchParams.get("search") || "";
  const guestValue = searchParams.get("guests") || "";

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

  const filteredVenues = filterVenues(venues, {
    search: searchValue,
    guests: guestValue,
  });

  const visibleVenues = filteredVenues.slice(0, visibleCount);
  const hasMoreVenues = visibleCount < filteredVenues.length;

  function handleSearchSubmit(event) {
    event.preventDefault();
  }

  function handleLoadMore() {
    setVisibleCount((currentCount) => currentCount + 9);
  }

  function handleSearchChange(event) {
    const nextSearchParams = new URLSearchParams(searchParams);
    const value = event.target.value;

    if (value.trim()) {
      nextSearchParams.set("search", value);
    } else {
      nextSearchParams.delete("search");
    }

    setVisibleCount(9);
    setSearchParams(nextSearchParams);
  }

  function handleGuestsChange(event) {
    const nextSearchParams = new URLSearchParams(searchParams);
    const value = event.target.value;

    if (value) {
      nextSearchParams.set("guests", value);
    } else {
      nextSearchParams.delete("guests");
    }

    setVisibleCount(9);
    setSearchParams(nextSearchParams);
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
          <form
            className="venues-page__search"
            aria-label="Filter stays"
            onSubmit={handleSearchSubmit}
          >
            <label className="venues-page__search-field">
              <span className="visually-hidden">Location or stay name</span>
              <input
                type="search"
                value={searchValue}
                onChange={handleSearchChange}
                placeholder="Location"
              />
              <span className="venues-page__search-icon">
                <img src={locationIcon} alt="" aria-hidden="true" />
              </span>
            </label>

            <label className="venues-page__search-field">
              <span className="visually-hidden">Guests</span>
              <input
                type="number"
                min="1"
                value={guestValue}
                onChange={handleGuestsChange}
                placeholder="Guests"
              />
              <span className="venues-page__search-icon">
                <img src={guestsIcon} alt="" aria-hidden="true" />
              </span>
            </label>

            <button
              type="submit"
              className="ui-btn-primary venues-page__search-button"
            >
              Search
            </button>
          </form>

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
                <h2>
                  {filteredVenues.length}{" "}
                  {filteredVenues.length === 1 ? "stay" : "stays"} found
                </h2>
              </div>

              {filteredVenues.length === 0 ? (
                <UiAlert
                  message="No stays match your search. Try another location or guest count."
                  type="info"
                />
              ) : (
                <>
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
            </>
          )}
        </div>
      </section>
    </div>
  );
}
