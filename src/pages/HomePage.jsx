import { Link } from "react-router-dom";

import heroDesktop from "../assets/images/hero-desktop.webp";
import heroMobile from "../assets/images/hero-mobile.webp";
import locationIcon from "../assets/icons/location.svg";
import calendarIcon from "../assets/icons/calendar.svg";
import guestsIcon from "../assets/icons/users.svg";
import chevronDownIcon from "../assets/icons/chevron-down.svg";
import starIcon from "../assets/icons/star.svg";
import parkingIcon from "../assets/icons/parking.svg";
import petsIcon from "../assets/icons/pets.svg";
import breakfastIcon from "../assets/icons/breakfast.svg";

import venue1 from "../assets/images/venue-01.webp";
import venue2 from "../assets/images/venue-02.webp";
import venue3 from "../assets/images/venue-03.webp";

import "../styles/home.css";

const featuredVenues = [
  {
    id: "nordic-lake-cabin",
    title: "Nordic Lake Cabin",
    location: "Bled, Slovenia",
    price: "149 EUR / night",
    guests: "4 guests",
    rating: "4,5",
    image: venue1,
    amenities: [parkingIcon, petsIcon],
  },
  {
    id: "casa-luma-terrace",
    title: "Casa Luma Terrace",
    location: "Piran, Slovenia",
    price: "200 EUR / night",
    guests: "2 guests",
    rating: "4,7",
    image: venue2,
    amenities: [parkingIcon, petsIcon, breakfastIcon],
  },
  {
    id: "alpine-hideaway-loft",
    title: "Alpine Hideaway Loft",
    location: "Kranjska Gora, Slovenia",
    price: "400 EUR / night",
    guests: "6 guests",
    rating: "4,9",
    image: venue3,
    amenities: [parkingIcon, breakfastIcon],
  },
];

export default function HomePage() {
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

        <form className="home-search" aria-label="Search stays">
          <h2>Find your next stay</h2>

          <div className="home-search__line"></div>

          <label className="home-search__field">
            <span className="visually-hidden">Location</span>
            <input type="text" placeholder="Location" />
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

          <div className="home-venues__grid">
            {featuredVenues.map((venue) => (
              <article className="home-card" key={venue.id}>
                <div className="home-card__image-wrap">
                  <img src={venue.image} alt={venue.title} />

                  <div className="home-card__location">
                    <img src={locationIcon} alt="" aria-hidden="true" />
                    <span>{venue.location}</span>
                  </div>
                </div>

                <div className="home-card__content">
                  <div>
                    <h3>{venue.title}</h3>
                    <p>
                      {venue.price} • {venue.guests}
                    </p>
                  </div>

                  <div className="home-card__rating">
                    <img src={starIcon} alt="" aria-hidden="true" />
                    <span>{venue.rating}</span>
                  </div>
                </div>

                <div className="home-card__footer">
                  <div className="home-card__amenities">
                    {venue.amenities.map((icon) => (
                      <img src={icon} alt="" aria-hidden="true" key={icon} />
                    ))}
                  </div>

                  <Link
                    to={`/venues/${venue.id}`}
                    className="ui-btn-primary home-card__button"
                  >
                    View details
                  </Link>
                </div>
              </article>
            ))}
          </div>

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
