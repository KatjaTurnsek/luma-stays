import { useState } from "react";

import UiAlert from "../UiAlert";

import { EMPTY_FORM_VALUES, EMPTY_MEDIA } from "../../utils/venue-form-utils";

import addIcon from "../../assets/icons/add.svg";

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
 * Creates the media payload from media form fields.
 * Empty image fields are removed before sending data to the API.
 * @param {Array<object>} mediaFields - Media input values.
 * @returns {Array<object>} Media API payload.
 */
function getMediaPayload(mediaFields) {
  return mediaFields
    .filter((mediaItem) => mediaItem.url.trim())
    .map((mediaItem) => ({
      url: mediaItem.url.trim(),
      alt: mediaItem.alt.trim(),
    }));
}

/**
 * Validates venue form values.
 * @param {object} values - Main form values.
 * @param {Array} mediaFields - Media fields.
 * @returns {object} Validation errors.
 */
function validateVenueForm(values, mediaFields) {
  const errors = {};
  const price = Number(values.price);
  const maxGuests = Number(values.maxGuests);
  const rating = Number(values.rating);
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

  if (values.rating && (Number.isNaN(rating) || rating < 0 || rating > 5)) {
    errors.rating = "Rating must be between 0 and 5.";
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

/**
 * Reusable venue form for creating and editing venues.
 * @param {object} props - Component props.
 * @param {string} props.title - Form title.
 * @param {string} props.submitLabel - Submit button text.
 * @param {string} props.submittingLabel - Submit button loading text.
 * @param {object} [props.initialData] - Initial form data.
 * @param {string} props.apiError - API error message.
 * @param {string} props.successMessage - Success message.
 * @param {boolean} props.isSubmitting - Submit loading state.
 * @param {Function} props.onSubmit - Submit handler.
 * @param {Function} props.onClearApiError - Clears API error.
 * @param {Function} props.onClearSuccessMessage - Clears success message.
 * @returns {JSX.Element} Venue form component.
 */
export default function VenueForm({
  title,
  submitLabel,
  submittingLabel,
  initialData,
  apiError,
  successMessage,
  isSubmitting,
  onSubmit,
  onClearApiError,
  onClearSuccessMessage,
}) {
  const [formValues, setFormValues] = useState(
    initialData?.formValues || EMPTY_FORM_VALUES
  );
  const [mediaFields, setMediaFields] = useState(
    initialData?.mediaFields || EMPTY_MEDIA
  );
  const [formErrors, setFormErrors] = useState({});
  const [isMediaTouched, setIsMediaTouched] = useState(false);

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

    onClearApiError();
    onClearSuccessMessage();
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

    onClearApiError();
    onClearSuccessMessage();
  }

  /**
   * Updates one media field.
   * @param {number} index - Media item index.
   * @param {string} field - Field name.
   * @param {string} value - New field value.
   */
  function handleMediaChange(index, field, value) {
    setIsMediaTouched(true);

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

    onClearApiError();
    onClearSuccessMessage();
  }

  /**
   * Adds another image field.
   */
  function addMediaField() {
    setIsMediaTouched(true);

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
    setIsMediaTouched(true);

    setMediaFields((currentFields) =>
      currentFields.filter((_, mediaIndex) => mediaIndex !== index)
    );
  }

  /**
   * Creates the API payload from form values.
   * When editing, unchanged media is sent back to preserve existing images.
   * @returns {object} Venue API payload.
   */
  function createPayload() {
    const location = getLocationFromInput(formValues.cityCountry);
    const rating = formValues.rating ? Number(formValues.rating) : 0;
    const media = getMediaPayload(mediaFields);
    const initialMedia = getMediaPayload(
      initialData?.mediaFields || EMPTY_MEDIA
    );
    const isEditMode = Boolean(initialData);

    const payload = {
      name: formValues.name.trim(),
      description: formValues.description.trim(),
      price: Number(formValues.price),
      maxGuests: Number(formValues.maxGuests),
      rating,
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

    if (!isEditMode) {
      payload.media = media;
    } else if (isMediaTouched) {
      payload.media = media;
    } else {
      payload.media = initialMedia;
    }

    return payload;
  }

  /**
   * Submits the venue form.
   * @param {React.FormEvent<HTMLFormElement>} event - Submit event.
   */
  function handleSubmit(event) {
    event.preventDefault();

    const errors = validateVenueForm(formValues, mediaFields);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    onSubmit(createPayload());
  }

  return (
    <section className="venue-form-card" aria-labelledby="venue-form-title">
      <h2 id="venue-form-title">{title}</h2>

      {(apiError || successMessage) && (
        <>
          {apiError && (
            <UiAlert
              message={apiError}
              type="error"
              onClose={onClearApiError}
            />
          )}

          {successMessage && (
            <UiAlert
              message={successMessage}
              type="success"
              onClose={onClearSuccessMessage}
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
                  helperText='Short description for accessibility, e.g. "Wooden cabin in the forest".'
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
          <legend>Rating:</legend>

          <div className="venue-form__group">
            <label htmlFor="venue-rating">Venue rating</label>
            <input
              id="venue-rating"
              name="rating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={formValues.rating}
              onChange={handleChange}
              aria-invalid={Boolean(formErrors.rating)}
            />
            <FieldHelper
              error={formErrors.rating}
              helperText="Optional. Add a rating from 0 to 5."
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
          {isSubmitting ? submittingLabel : submitLabel}
        </button>
      </form>
    </section>
  );
}
