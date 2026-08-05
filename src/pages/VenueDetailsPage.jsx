import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import PageMeta from "../components/PageMeta";
import Loader from "../components/Loader";
import UiAlert from "../components/UiAlert";
import VenueGallery from "../components/VenueGallery";
import VenueBookingCard from "../components/VenueBookingCard";

import { deleteVenue, getVenueById } from "../api/venues-api";
import { getAuth } from "../utils/auth-storage";
import { getVenueLocationText } from "../utils/venue-utils";

import locationIcon from "../assets/icons/location.svg";
import usersIcon from "../assets/icons/users.svg";
import starIcon from "../assets/icons/star.svg";
import parkingIcon from "../assets/icons/parking.svg";
import petsIcon from "../assets/icons/pets.svg";
import breakfastIcon from "../assets/icons/breakfast.svg";
import wifiIcon from "../assets/icons/wifi.svg";
import userIcon from "../assets/icons/user.svg";

import "../styles/venue-details.css";

/**
 * Gets available venue features from API meta data.
 * @param {object} meta - API meta object.
 * @returns {Array} Feature list.
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
  const navigate = useNavigate();
  const auth = getAuth();

  const [venue, setVenue] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);

  useEffect(() => {
    async function loadVenue() {
      try {
        const response = await getVenueById(id);
        setVenue(response.data);
      } catch (error) {
        setErrorMessage(error.message || "Could not load venue.");
      } finally {
        setIsLoading(false);
      }
    }

    loadVenue();
  }, [id]);

  /**
   * Deletes the current venue and redirects the manager back to profile.
   */
  async function handleDeleteVenue() {
    setDeleteError("");
    setIsDeleting(true);

    try {
      await deleteVenue(id);
      navigate("/profile", { replace: true });
    } catch (error) {
      setDeleteError(error.message || "Could not delete venue.");
      setIsDeleting(false);
      setIsDeleteConfirmVisible(false);
    }
  }

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

  const locationText = getVenueLocationText(venue.location);
  const features = getVenueFeatures(venue.meta);
  const owner = venue.owner;
  const isVenueManager = Boolean(auth?.venueManager);
  const isOwnedByCurrentManager = isVenueManager && auth?.name === owner?.name;
  const isOtherManagerVenue = isVenueManager && !isOwnedByCurrentManager;

  return (
    <>
      <PageMeta
        title={`${venue.name} | Luma Stays`}
        description={`View details for ${venue.name}, including location, facilities, price, host information, and booking options.`}
      />

      <div className="venue-details">
        <div className="container">
          <VenueGallery images={venue.media} title={venue.name} />

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
                <p>
                  {venue.description || "No description has been added yet."}
                </p>
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

              <section className="venue-details__section venue-details__host-section">
                <h2>Hosted by:</h2>

                <div className="venue-details__host">
                  <img
                    src={owner?.avatar?.url || userIcon}
                    alt={
                      owner?.name
                        ? `${owner.name} avatar`
                        : "Default user avatar"
                    }
                  />

                  <div>
                    <h3>{owner?.name || "Host not added"}</h3>
                    {owner?.email && <p>{owner.email}</p>}
                  </div>
                </div>
              </section>
            </main>

            {isOwnedByCurrentManager && (
              <aside
                className="venue-details__manager-card"
                aria-labelledby="manager-actions-title"
              >
                <div className="venue-details__manager-top">
                  <p className="venue-details__manager-label">Manager view</p>

                  <h2 id="manager-actions-title">Manage this venue</h2>
                </div>

                <div className="venue-details__manager-content">
                  <p>
                    You own this venue. Edit the listing details or remove it
                    from Luma Stays.
                  </p>

                  {deleteError && (
                    <UiAlert
                      message={deleteError}
                      type="error"
                      onClose={() => setDeleteError("")}
                    />
                  )}

                  <div className="venue-details__manager-actions">
                    <Link
                      to={`/venues/${venue.id}/edit`}
                      className="ui-btn-primary"
                    >
                      Edit venue
                    </Link>

                    {!isDeleteConfirmVisible && (
                      <button
                        type="button"
                        className="ui-btn-danger"
                        onClick={() => setIsDeleteConfirmVisible(true)}
                      >
                        Delete venue
                      </button>
                    )}
                  </div>

                  {isDeleteConfirmVisible && (
                    <div className="venue-details__delete-confirmation">
                      <p>
                        Deleting this venue cannot be undone. Are you sure you
                        want to continue?
                      </p>

                      <div className="venue-details__manager-actions">
                        <button
                          type="button"
                          className="ui-btn-secondary"
                          onClick={() => setIsDeleteConfirmVisible(false)}
                          disabled={isDeleting}
                        >
                          Cancel
                        </button>

                        <button
                          type="button"
                          className="ui-btn-danger"
                          onClick={handleDeleteVenue}
                          disabled={isDeleting}
                        >
                          {isDeleting ? "Deleting..." : "Confirm delete"}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </aside>
            )}

            {isOtherManagerVenue && (
              <aside
                className="venue-details__manager-card"
                aria-labelledby="manager-readonly-title"
              >
                <div className="venue-details__manager-top">
                  <p className="venue-details__manager-label">Manager view</p>

                  <h2 id="manager-readonly-title">Viewing another venue</h2>
                </div>

                <div className="venue-details__manager-content">
                  <p>
                    This venue is managed by{" "}
                    <strong>{owner?.name || "another host"}</strong>. You can
                    view the listing, but bookings are only available from
                    customer accounts.
                  </p>

                  <div className="venue-details__manager-meta">
                    <div>
                      <span>Price per night</span>
                      <strong>{venue.price} EUR</strong>
                    </div>

                    <div>
                      <span>Max guests</span>
                      <strong>{venue.maxGuests}</strong>
                    </div>
                  </div>

                  <div className="venue-details__manager-actions">
                    <Link to="/venues" className="ui-btn-secondary">
                      Back to venues
                    </Link>
                  </div>
                </div>
              </aside>
            )}

            {!isVenueManager && (
              <VenueBookingCard
                venue={venue}
                onBookingCreated={(booking) =>
                  setVenue((currentVenue) => ({
                    ...currentVenue,
                    bookings: [...(currentVenue.bookings || []), booking],
                  }))
                }
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
