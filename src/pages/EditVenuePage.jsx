import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Loader from "../components/Loader";
import UiAlert from "../components/UiAlert";
import VenueForm from "../components/venues/VenueForm";
import { mapVenueToFormValues } from "../utils/venue-form-utils";

import { getVenueById, updateVenue } from "../api/venues-api";

import "../styles/venue-form.css";

export default function EditVenuePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [initialData, setInitialData] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    /**
     * Loads the current venue and prepares it for the form.
     */
    async function loadVenue() {
      try {
        setIsLoading(true);
        setLoadError("");

        const response = await getVenueById(id);
        const venue = response?.data;

        if (!venue) {
          setLoadError("Could not find this venue.");
          return;
        }

        setInitialData(mapVenueToFormValues(venue));
      } catch (error) {
        setLoadError(error.message || "Could not load venue.");
      } finally {
        setIsLoading(false);
      }
    }

    loadVenue();
  }, [id]);

  /**
   * Sends updated venue data to the API.
   * @param {object} payload - Venue API payload.
   */
  async function handleSubmit(payload) {
    setApiError("");
    setSuccessMessage("");

    try {
      setIsSubmitting(true);

      await updateVenue(id, payload);

      setSuccessMessage("Venue updated. Redirecting...");

      setTimeout(() => {
        navigate(`/venues/${id}`);
      }, 1400);
    } catch (error) {
      setApiError(error.message || "Could not save changes.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="venue-form-page">
      <section className="venue-form-page__hero" aria-label="Edit venue intro">
        <div className="venue-form-page__hero-overlay">
          <h1>Manage your venues</h1>
        </div>
      </section>

      <div className="container venue-form-page__container">
        {isLoading && <Loader />}

        {!isLoading && loadError && (
          <UiAlert
            message={loadError}
            type="error"
            onClose={() => setLoadError("")}
          />
        )}

        {!isLoading && !loadError && initialData && (
          <VenueForm
            title="Edit venue"
            submitLabel="Save changes"
            submittingLabel="Saving changes..."
            initialData={initialData}
            apiError={apiError}
            successMessage={successMessage}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
            onClearApiError={() => setApiError("")}
            onClearSuccessMessage={() => setSuccessMessage("")}
          />
        )}
      </div>
    </div>
  );
}
