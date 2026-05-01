import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Loader from "../components/Loader";
import UiAlert from "../components/UiAlert";

import { getVenueById } from "../api/venues-api";

import placeholderImage from "../assets/images/venue-01.webp";
import locationIcon from "../assets/icons/location.svg";
import usersIcon from "../assets/icons/users.svg";
import starIcon from "../assets/icons/star.svg";
import parkingIcon from "../assets/icons/parking.svg";
import petsIcon from "../assets/icons/pets.svg";
import breakfastIcon from "../assets/icons/breakfast.svg";
import wifiIcon from "../assets/icons/wifi.svg";
import userIcon from "../assets/icons/user.svg";
import calendarIcon from "../assets/icons/calendar.svg";
import chevronLeftIcon from "../assets/icons/chevron-left.svg";
import chevronRightIcon from "../assets/icons/chevron-right.svg";

import "../styles/venue-details.css";

/**
 * Gets image URL from a venue media item.
 * @param {object} mediaItem - API media item
 * @returns {string} Image URL
 */
function getMediaUrl(mediaItem) {
  return mediaItem?.url || placeholderImage;
}

/**
 * Gets readable location text from venue data.
 * @param {object} location - API location object
 * @returns {string} Location text
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
 * Gets available venue features from API meta data.
 * @param {object} meta - API meta object
 * @returns {Array} Feature list
 */
function getVenueFeatures(meta) {
  const features = [];

  if (meta?.parking) {
    features.push({ label: "Parking", icon: parkingIcon });
  }

  if (meta?.pets) {
    features.push({ label: "Pets", icon: petsIcon });
  }

  if (meta?.wifi) {
    features.push({ label: "Wifi", icon: wifiIcon });
  }

  if (meta?.breakfast) {
    features.push({ label: "Breakfast", icon: breakfastIcon });
  }

  return features;
}

export default function VenueDetailsPage() {
  const { id } = useParams();

  const [venue, setVenue] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadVenue() {
      try {
        const response = await getVenueById(id);
        setVenue(response.data);
      } catch (error) {
        setErrorMessage(error.message);
      } finally {
        setIsLoading(false);
      }
    }

    loadVenue();
  }, [id]);

  if (isLoading) {
    return (
      <div className="container venue-details">
        <Loader text="Loading venue..." />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="container venue-details">
        <UiAlert message={errorMessage} type="error" />

        <Link to="/venues" className="ui-btn-secondary">
          Back to venues
        </Link>
      </div>
    );
  }

  if (!venue) {
    return (
      <div className="container venue-details">
        <UiAlert message="Venue could not be found." type="error" />

        <Link to="/venues" className="ui-btn-secondary">
          Back to venues
        </Link>
      </div>
    );
  }

  const images = venue.media?.length
    ? venue.media
    : [{ url: placeholderImage }];
  const activeImage = images[activeImageIndex] || images[0];
  const locationText = getLocationText(venue.location);
  const features = getVenueFeatures(venue.meta);
  const owner = venue.owner;

  function showPreviousImage() {
    setActiveImageIndex((currentIndex) =>
      currentIndex === 0 ? images.length - 1 : currentIndex - 1
    );
  }

  function showNextImage() {
    setActiveImageIndex((currentIndex) =>
      currentIndex === images.length - 1 ? 0 : currentIndex + 1
    );
  }

  return (
    <div className="venue-details">
      <section className="venue-details__gallery">
        <button
          type="button"
          className="venue-details__gallery-button venue-details__gallery-button--left"
          onClick={showPreviousImage}
          aria-label="Show previous image"
        >
          <img src={chevronLeftIcon} alt="" aria-hidden="true" />
        </button>

        <img
          src={getMediaUrl(activeImage)}
          alt={activeImage?.alt || venue.name}
          className="venue-details__main-image"
        />

        <button
          type="button"
          className="venue-details__gallery-button venue-details__gallery-button--right"
          onClick={showNextImage}
          aria-label="Show next image"
        >
          <img src={chevronRightIcon} alt="" aria-hidden="true" />
        </button>
      </section>

      <div className="container">
        <div className="venue-details__thumbnails">
          {images.slice(0, 4).map((image, index) => (
            <button
              type="button"
              className={
                index === activeImageIndex
                  ? "venue-details__thumbnail venue-details__thumbnail--active"
                  : "venue-details__thumbnail"
              }
              onClick={() => setActiveImageIndex(index)}
              key={`${image.url}-${index}`}
              aria-label={`Show image ${index + 1}`}
            >
              <img src={getMediaUrl(image)} alt="" aria-hidden="true" />
            </button>
          ))}
        </div>

        <div className="venue-details__layout">
          <main className="venue-details__content">
            <section className="venue-details__intro">
              <div>
                <h1>{venue.name}</h1>

                <div className="venue-details__location">
                  <img src={locationIcon} alt="" aria-hidden="true" />
                  <span>{locationText}</span>
                </div>
              </div>

              <div className="venue-details__rating">
                <img src={starIcon} alt="" aria-hidden="true" />
                <span>{venue.rating || 0}</span>
              </div>
            </section>

            <section className="venue-details__section">
              <p>{venue.description || "No description has been added yet."}</p>
            </section>

            <section className="venue-details__section">
              <div className="venue-details__facts">
                <div className="venue-details__fact">
                  <img src={usersIcon} alt="" aria-hidden="true" />
                  <span>Guests: {venue.maxGuests}</span>
                </div>

                <div className="venue-details__fact">
                  <span>Price: {venue.price} EUR / night</span>
                </div>
              </div>
            </section>

            <section className="venue-details__section">
              <h2>Facilities:</h2>

              {features.length > 0 ? (
                <>
                  <ul className="venue-details__features-list">
                    {features.map((feature) => (
                      <li key={feature.label}>{feature.label}</li>
                    ))}
                  </ul>

                  <div className="venue-details__feature-icons">
                    {features.map((feature) => (
                      <img
                        src={feature.icon}
                        alt=""
                        aria-hidden="true"
                        key={feature.label}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <p>No facilities have been added yet.</p>
              )}
            </section>

            <section className="venue-details__section">
              <p>
                {venue.description || "No extra description has been added."}
              </p>
            </section>

            <section className="venue-details__section venue-details__host-section">
              <h2>Hosted by:</h2>

              <div className="venue-details__host">
                <img
                  src={owner?.avatar?.url || userIcon}
                  alt={owner?.name ? `${owner.name} avatar` : ""}
                />

                <div>
                  <h3>{owner?.name || "Host not added"}</h3>
                  {owner?.email && <p>{owner.email}</p>}
                </div>
              </div>
            </section>
          </main>

          <aside className="venue-details__booking-card">
            <p className="venue-details__price">{venue.price} EUR / night</p>
            <p className="venue-details__booking-title">Check availability:</p>

            <div className="venue-details__booking-divider"></div>

            <label className="venue-details__booking-field">
              <span className="visually-hidden">Select dates</span>
              <input type="text" placeholder="Select dates" disabled />
              <span>
                <img src={calendarIcon} alt="" aria-hidden="true" />
              </span>
            </label>

            <label className="venue-details__booking-field">
              <span className="visually-hidden">Select guests</span>
              <input
                type="text"
                placeholder={`Select guests, max ${venue.maxGuests}`}
                disabled
              />
              <span>
                <img src={usersIcon} alt="" aria-hidden="true" />
              </span>
            </label>

            <button
              type="button"
              className="ui-btn-primary venue-details__book-button"
            >
              Book now
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}
