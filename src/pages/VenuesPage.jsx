import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Loader from "../components/Loader";
import UiAlert from "../components/UiAlert";
import VenueCard from "../components/VenueCard";

import { getVenues } from "../api/venues-api";
import {
  filterVenues,
  formatVenueCardData,
  sortVenues,
} from "../utils/venue-utils";

import locationIcon from "../assets/icons/location.svg";
import guestsIcon from "../assets/icons/users.svg";
import chevronDownIcon from "../assets/icons/chevron-down.svg";

import "../styles/venues.css";

const SORT_OPTIONS = [
  {
    value: "created-desc",
    label: "Recently added",
  },
  {
    value: "price-asc",
    label: "Price: low to high",
  },
  {
    value: "price-desc",
    label: "Price: high to low",
  },
  {
    value: "rating-desc",
    label: "Rating: highest first",
  },
];

export default function VenuesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [venues, setVenues] = useState([]);
  const [visibleCount, setVisibleCount] = useState(9);
  const [sortValue, setSortValue] = useState("created-desc");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const searchValue = searchParams.get("search") || "";
  const guestValue = searchParams.get("guests") || "";

  const selectedSort =
    SORT_OPTIONS.find((option) => option.value === sortValue) ||
    SORT_OPTIONS[0];

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

  const sortedVenues = sortVenues(filteredVenues, sortValue);
  const visibleVenues = sortedVenues.slice(0, visibleCount);
  const hasMoreVenues = visibleCount < sortedVenues.length;

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

  function toggleSortMenu() {
    setIsSortOpen((isOpen) => !isOpen);
  }

  function handleSortChange(nextSortValue) {
    setSortValue(nextSortValue);
    setVisibleCount(9);
    setIsSortOpen(false);
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
                  {sortedVenues.length}{" "}
                  {sortedVenues.length === 1 ? "stay" : "stays"} found
                </h2>

                <div className="venues-page__sort">
                  <button
                    type="button"
                    className="venues-page__sort-button"
                    onClick={toggleSortMenu}
                    aria-expanded={isSortOpen}
                    aria-controls="venues-sort-menu"
                  >
                    <span>{selectedSort.label}</span>
                    <span className="venues-page__sort-icon">
                      <img src={chevronDownIcon} alt="" aria-hidden="true" />
                    </span>
                  </button>

                  {isSortOpen && (
                    <ul
                      id="venues-sort-menu"
                      className="venues-page__sort-menu"
                    >
                      {SORT_OPTIONS.map((option) => (
                        <li key={option.value}>
                          <button
                            type="button"
                            onClick={() => handleSortChange(option.value)}
                            aria-current={
                              option.value === sortValue ? "true" : undefined
                            }
                          >
                            {option.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {sortedVenues.length === 0 ? (
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
