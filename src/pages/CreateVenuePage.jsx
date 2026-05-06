import { useState } from "react";
import { useNavigate } from "react-router-dom";

import UiAlert from "../components/UiAlert";
import { createVenue } from "../api/venues-api";

import addIcon from "../assets/icons/add.svg";

import "../styles/venue-form.css";

const INITIAL_FORM_VALUES = {
  name: "",
  description: "",
  price: "",
  maxGuests: "",
  cityCountry: "",
  meta: {
    wifi: true,
    parking: true,
    pets: true,
    breakfast: true,
  },
};

const INITIAL_MEDIA = [
  {
    url: "",
    alt: "",
  },
];

/**
 * Checks if a string is a valid URL.
 * @param {string} value - URL value.
 * @returns {boolean} True if the value is a valid URL.
 */
function isValidUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Splits city/country input into location parts.
 * @param {string} value - City and country value.
 * @returns {object} Location object.
 */
function getLocationFromInput(value) {
  const parts = value.split(",").map((part) => part.trim());

  return {
    city: parts[0] || "",
    country: parts[1] || "",
  };
}

/**
 * Validates create venue form values.
 * @param {object} values - Main form values.
 * @param {Array} mediaFields - Media fields.
 * @returns {object} Validation errors.
 */
function validateVenueForm(values, mediaFields) {
  const errors = {};
  const price = Number(values.price);
  const maxGuests = Number(values.maxGuests);
  const location = getLocationFromInput(values.cityCountry);

  if (!values.name.trim()) {
    errors.name = "Venue name is required.";
  }

  if (!values.description.trim()) {
    errors.description = "Description is required.";
  }

  if (!values.price) {
    errors.price = "Price is required.";
  } else if (Number.isNaN(price) || price <= 0) {
    errors.price = "Price must be more than 0.";
  }

  if (!values.maxGuests) {
    errors.maxGuests = "Max guests is required.";
  } else if (Number.isNaN(maxGuests) || maxGuests < 1) {
    errors.maxGuests = "Max guests must be at least 1.";
  }

  if (!values.cityCountry.trim()) {
    errors.cityCountry = "City and country are required.";
  } else if (!location.city || !location.country) {
    errors.cityCountry = "Write city and country like this: Bled, Slovenia.";
  }

  mediaFields.forEach((mediaItem, index) => {
    const hasUrl = mediaItem.url.trim();
    const hasAlt = mediaItem.alt.trim();

    if (hasUrl && !isValidUrl(hasUrl)) {
      errors[`media-${index}-url`] = "Image must be a valid URL.";
    }

    if (hasUrl && !hasAlt) {
      errors[`media-${index}-alt`] =
        "Alt text is required when image URL is added.";
    }

    if (!hasUrl && hasAlt) {
      errors[`media-${index}-url`] =
        "Image URL is required when alt text is added.";
    }
  });

  return errors;
}

/**
 * Returns helper text or error text for a field.
 * @param {object} props - Component props.
 * @param {string} props.error - Error text.
 * @param {string} props.helperText - Helper text.
 * @returns {JSX.Element} Helper element.
 */
function FieldHelper({ error, helperText }) {
  return (
    <p
      className={`venue-form__helper ${
        error ? "venue-form__helper--error" : ""
      }`}
    >
      {error || helperText}
    </p>
  );
}

export default function CreateVenuePage() {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState(INITIAL_FORM_VALUES);
  const [mediaFields, setMediaFields] = useState(INITIAL_MEDIA);
  const [formErrors, setFormErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Updates text and number fields.
   * @param {React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>} event - Input event.
   */
  function handleChange(event) {
    const { name, value } = event.target;

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));

    setFormErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));

    setApiError("");
    setSuccessMessage("");
  }

  /**
   * Updates checkbox values.
   * @param {React.ChangeEvent<HTMLInputElement>} event - Checkbox event.
   */
  function handleMetaChange(event) {
    const { name, checked } = event.target;

    setFormValues((currentValues) => ({
      ...currentValues,
      meta: {
        ...currentValues.meta,
        [name]: checked,
      },
    }));
  }

  /**
   * Updates one media field.
   * @param {number} index - Media item index.
   * @param {string} field - Field name.
   * @param {string} value - New field value.
   */
  function handleMediaChange(index, field, value) {
    setMediaFields((currentFields) =>
      currentFields.map((mediaItem, mediaIndex) => {
        if (mediaIndex !== index) {
          return mediaItem;
        }

        return {
          ...mediaItem,
          [field]: value,
        };
      })
    );

    setFormErrors((currentErrors) => ({
      ...currentErrors,
      [`media-${index}-${field}`]: "",
    }));

    setApiError("");
    setSuccessMessage("");
  }

  /**
   * Adds another image field.
   */
  function addMediaField() {
    setMediaFields((currentFields) => [
      ...currentFields,
      {
        url: "",
        alt: "",
      },
    ]);
  }

  /**
   * Removes one image field.
   * @param {number} index - Media item index.
   */
  function removeMediaField(index) {
    setMediaFields((currentFields) =>
      currentFields.filter((_, mediaIndex) => mediaIndex !== index)
    );
  }

  /**
   * Creates the API payload from form values.
   * @returns {object} Venue API payload.
   */
  function createPayload() {
    const location = getLocationFromInput(formValues.cityCountry);

    const media = mediaFields
      .filter((mediaItem) => mediaItem.url.trim())
      .map((mediaItem) => ({
        url: mediaItem.url.trim(),
        alt: mediaItem.alt.trim(),
      }));

    return {
      name: formValues.name.trim(),
      description: formValues.description.trim(),
      media,
      price: Number(formValues.price),
      maxGuests: Number(formValues.maxGuests),
      rating: 0,
      meta: {
        wifi: formValues.meta.wifi,
        parking: formValues.meta.parking,
        pets: formValues.meta.pets,
        breakfast: formValues.meta.breakfast,
      },
      location: {
        address: "",
        city: location.city,
        zip: "",
        country: location.country,
      },
    };
  }

  /**
   * Submits the create venue form.
   * @param {React.FormEvent<HTMLFormElement>} event - Submit event.
   */
  async function handleSubmit(event) {
    event.preventDefault();

    const errors = validateVenueForm(formValues, mediaFields);
    setFormErrors(errors);
    setApiError("");
    setSuccessMessage("");

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await createVenue(createPayload());
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
      setApiError(error.message);
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
        <section
          className="venue-form-card"
          aria-labelledby="create-venue-title"
        >
          <h2 id="create-venue-title">Create new venue</h2>

          {(apiError || successMessage) && (
            <>
              {apiError && (
                <UiAlert
                  message={apiError}
                  type="error"
                  onClose={() => setApiError("")}
                />
              )}

              {successMessage && (
                <UiAlert
                  message={successMessage}
                  type="success"
                  onClose={() => setSuccessMessage("")}
                />
              )}
            </>
          )}

          <form className="venue-form" onSubmit={handleSubmit} noValidate>
            <fieldset className="venue-form__section">
              <legend>Basic info:</legend>

              <div className="venue-form__group">
                <label htmlFor="venue-name">Venue name *</label>
                <input
                  id="venue-name"
                  name="name"
                  type="text"
                  value={formValues.name}
                  onChange={handleChange}
                  aria-invalid={Boolean(formErrors.name)}
                />
                <FieldHelper
                  error={formErrors.name}
                  helperText="Write a short and clear venue name."
                />
              </div>

              <div className="venue-form__group">
                <label htmlFor="venue-description">Description *</label>
                <textarea
                  id="venue-description"
                  name="description"
                  rows="6"
                  value={formValues.description}
                  onChange={handleChange}
                  aria-invalid={Boolean(formErrors.description)}
                ></textarea>
                <FieldHelper
                  error={formErrors.description}
                  helperText="Describe the venue and what makes it useful for guests."
                />
              </div>
            </fieldset>

            <fieldset className="venue-form__section">
              <legend>Media:</legend>

              {mediaFields.map((mediaItem, index) => (
                <div className="venue-form__media-group" key={`media-${index}`}>
                  <div className="venue-form__group">
                    <label htmlFor={`venue-image-${index}`}>Image URL</label>
                    <input
                      id={`venue-image-${index}`}
                      type="url"
                      value={mediaItem.url}
                      onChange={(event) =>
                        handleMediaChange(index, "url", event.target.value)
                      }
                      placeholder="https://..."
                      aria-invalid={Boolean(formErrors[`media-${index}-url`])}
                    />
                    <FieldHelper
                      error={formErrors[`media-${index}-url`]}
                      helperText="Use a direct image URL."
                    />
                  </div>

                  <div className="venue-form__group">
                    <label htmlFor={`venue-image-alt-${index}`}>Alt text</label>
                    <input
                      id={`venue-image-alt-${index}`}
                      type="text"
                      value={mediaItem.alt}
                      onChange={(event) =>
                        handleMediaChange(index, "alt", event.target.value)
                      }
                      aria-invalid={Boolean(formErrors[`media-${index}-alt`])}
                    />
                    <FieldHelper
                      error={formErrors[`media-${index}-alt`]}
                      helperText='Short description for accessibility, e.g. "Black Wacom tablet on desk".'
                    />
                  </div>

                  {mediaFields.length > 1 && (
                    <button
                      type="button"
                      className="venue-form__remove-button"
                      onClick={() => removeMediaField(index)}
                    >
                      Remove image
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                className="venue-form__add-media-button"
                onClick={addMediaField}
              >
                <img src={addIcon} alt="" aria-hidden="true" />
                <span>Add another image</span>
              </button>
            </fieldset>

            <fieldset className="venue-form__section">
              <legend>Price:</legend>

              <div className="venue-form__group">
                <label htmlFor="venue-price">Price per night (EUR) *</label>
                <input
                  id="venue-price"
                  name="price"
                  type="number"
                  min="1"
                  value={formValues.price}
                  onChange={handleChange}
                  aria-invalid={Boolean(formErrors.price)}
                />
                <FieldHelper
                  error={formErrors.price}
                  helperText="Add the price for one night."
                />
              </div>
            </fieldset>

            <fieldset className="venue-form__section">
              <legend>Guests:</legend>

              <div className="venue-form__group">
                <label htmlFor="venue-max-guests">Max guests *</label>
                <input
                  id="venue-max-guests"
                  name="maxGuests"
                  type="number"
                  min="1"
                  value={formValues.maxGuests}
                  onChange={handleChange}
                  aria-invalid={Boolean(formErrors.maxGuests)}
                />
                <FieldHelper
                  error={formErrors.maxGuests}
                  helperText="Add how many guests can stay."
                />
              </div>
            </fieldset>

            <fieldset className="venue-form__section">
              <legend>Facilities:</legend>

              <label className="venue-form__checkbox">
                <input
                  type="checkbox"
                  name="wifi"
                  checked={formValues.meta.wifi}
                  onChange={handleMetaChange}
                />
                <span>Wifi</span>
              </label>

              <label className="venue-form__checkbox">
                <input
                  type="checkbox"
                  name="parking"
                  checked={formValues.meta.parking}
                  onChange={handleMetaChange}
                />
                <span>Parking</span>
              </label>

              <label className="venue-form__checkbox">
                <input
                  type="checkbox"
                  name="pets"
                  checked={formValues.meta.pets}
                  onChange={handleMetaChange}
                />
                <span>Pets allowed</span>
              </label>

              <label className="venue-form__checkbox">
                <input
                  type="checkbox"
                  name="breakfast"
                  checked={formValues.meta.breakfast}
                  onChange={handleMetaChange}
                />
                <span>Breakfast</span>
              </label>
            </fieldset>

            <fieldset className="venue-form__section">
              <legend>Location:</legend>

              <div className="venue-form__group">
                <label htmlFor="venue-city-country">City / country *</label>
                <input
                  id="venue-city-country"
                  name="cityCountry"
                  type="text"
                  value={formValues.cityCountry}
                  onChange={handleChange}
                  placeholder="Bled, Slovenia"
                  aria-invalid={Boolean(formErrors.cityCountry)}
                />
                <FieldHelper
                  error={formErrors.cityCountry}
                  helperText="Write city and country, for example: Bled, Slovenia."
                />
              </div>
            </fieldset>

            <button
              type="submit"
              className="ui-btn-primary venue-form__submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating venue..." : "Create venue"}
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
