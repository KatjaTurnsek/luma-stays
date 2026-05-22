import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import VenueCard from "../components/VenueCard";
import Loader from "../components/Loader";
import UiAlert from "../components/UiAlert";

import useVenues from "../hooks/useVenues";
import { filterVenues } from "../utils/venue-utils";

import heroDesktop from "../assets/images/hero-desktop.webp";
import heroMobile from "../assets/images/hero-mobile.webp";
import locationIcon from "../assets/icons/location.svg";
import guestsIcon from "../assets/icons/users.svg";

import "../styles/home.css";

export default function HomePage() {
  const navigate = useNavigate();

  const { venues, isLoadingVenues, venuesError, setVenuesError } =
    useVenues(100);

  const [searchValue, setSearchValue] = useState("");
  const [guestValue, setGuestValue] = useState("");

  const visibleVenues = filterVenues(venues, {
    search: searchValue,
    guests: guestValue,
  }).slice(0, 3);

  function handleSearchSubmit(event) {
    event.preventDefault();

    const params = new URLSearchParams();

    if (searchValue.trim()) {
      params.set("search", searchValue.trim());
    }

    if (guestValue) {
      params.set("guests", guestValue);
    }

    navigate(`/venues${params.toString() ? `?${params.toString()}` : ""}`);
  }

  function handleSearchValueChange(event) {
    setSearchValue(event.target.value);
  }

  function handleGuestValueChange(event) {
    setGuestValue(event.target.value);
  }

  return (
    <>
      <section className="home-hero">
        <picture>
          <source srcSet={heroMobile} media="(max-width: 767px)" />
          <img
            src={heroDesktop}
            alt="Wooden cabin in nature"
            width="1600"
            height="900"
            fetchPriority="high"
          />
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
              name="search"
              placeholder="Location or stay name"
              value={searchValue}
              onChange={handleSearchValueChange}
            />
            <span>
              <img
                src={locationIcon}
                alt=""
                aria-hidden="true"
                width="24"
                height="24"
              />
            </span>
          </label>

          <label className="home-search__field">
            <span className="visually-hidden">Guests</span>
            <input
              type="number"
              name="guests"
              min="1"
              placeholder="Guests"
              value={guestValue}
              onChange={handleGuestValueChange}
            />
            <span>
              <img
                src={guestsIcon}
                alt=""
                aria-hidden="true"
                width="24"
                height="24"
              />
            </span>
          </label>

          <button type="submit" className="ui-btn-primary home-search__button">
            Search all stays
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
          </div>

          {isLoadingVenues && <Loader text="Loading stays..." />}

          {venuesError && (
            <UiAlert
              message={venuesError}
              type="error"
              onClose={() => setVenuesError("")}
            />
          )}

          {!isLoadingVenues && !venuesError && visibleVenues.length === 0 && (
            <UiAlert
              message="No stays found. Try another search."
              type="info"
            />
          )}

          {!isLoadingVenues && !venuesError && visibleVenues.length > 0 && (
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
