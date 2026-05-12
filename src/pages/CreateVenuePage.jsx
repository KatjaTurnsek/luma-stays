import { useState } from "react";
import { useNavigate } from "react-router-dom";

import VenueForm from "../components/venues/VenueForm";
import { createVenue } from "../api/venues-api";

import "../styles/venue-form.css";

export default function CreateVenuePage() {
  const navigate = useNavigate();

  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Submits new venue data to the API.
   * @param {object} payload - Venue API payload.
   */
  async function handleSubmit(payload) {
    setApiError("");
    setSuccessMessage("");

    try {
      setIsSubmitting(true);

      const response = await createVenue({
        ...payload,
        rating: 0,
      });

      const venueId = response?.data?.id;

      setSuccessMessage("Venue created. Redirecting...");

      setTimeout(() => {
        if (venueId) {
          navigate(`/venues/${venueId}`);
        } else {
          navigate("/profile");
        }
      }, 1000);
    } catch (error) {
      setApiError(error.message || "Could not create venue.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="venue-form-page">
      <section
        className="venue-form-page__hero"
        aria-label="Create venue intro"
      >
        <div className="venue-form-page__hero-overlay">
          <h1>Manage your venues</h1>
        </div>
      </section>

      <div className="container venue-form-page__container">
        <VenueForm
          title="Create new venue"
          submitLabel="Create venue"
          submittingLabel="Creating venue..."
          apiError={apiError}
          successMessage={successMessage}
          isSubmitting={isSubmitting}
          onSubmit={handleSubmit}
          onClearApiError={() => setApiError("")}
          onClearSuccessMessage={() => setSuccessMessage("")}
        />
      </div>
    </div>
  );
}
