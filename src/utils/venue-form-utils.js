/**
 * Default form values used when creating a new venue.
 * @type {object}
 */
export const EMPTY_FORM_VALUES = {
  name: "",
  description: "",
  price: "",
  maxGuests: "",
  rating: "",
  cityCountry: "",
  meta: {
    wifi: true,
    parking: true,
    pets: true,
    breakfast: true,
  },
};

/**
 * Default media field used when a venue has no images yet.
 * @type {Array<object>}
 */
export const EMPTY_MEDIA = [
  {
    url: "",
    alt: "",
  },
];

/**
 * Converts one venue API object into the form shape used by VenueForm.
 * Used when editing an existing venue.
 * @param {object} venue - Venue API data.
 * @param {string} [venue.name] - Venue name.
 * @param {string} [venue.description] - Venue description.
 * @param {number|string} [venue.price] - Venue price per night.
 * @param {number|string} [venue.maxGuests] - Maximum number of guests.
 * @param {number|string} [venue.rating] - Venue rating.
 * @param {object} [venue.location] - Venue location object.
 * @param {string} [venue.location.city] - Venue city.
 * @param {string} [venue.location.country] - Venue country.
 * @param {object} [venue.meta] - Venue facilities object.
 * @param {Array<object>} [venue.media] - Venue media array.
 * @returns {object} Form values and media fields.
 * @returns {object} returns.formValues - Main form values.
 * @returns {Array<object>} returns.mediaFields - Media input values.
 */
export function mapVenueToFormValues(venue) {
  const city = venue?.location?.city || "";
  const country = venue?.location?.country || "";
  const media = venue?.media?.length ? venue.media : EMPTY_MEDIA;

  return {
    formValues: {
      name: venue?.name || "",
      description: venue?.description || "",
      price: venue?.price ? String(venue.price) : "",
      maxGuests: venue?.maxGuests ? String(venue.maxGuests) : "",
      rating: venue?.rating || venue?.rating === 0 ? String(venue.rating) : "",
      cityCountry: city && country ? `${city}, ${country}` : "",
      meta: {
        wifi: Boolean(venue?.meta?.wifi),
        parking: Boolean(venue?.meta?.parking),
        pets: Boolean(venue?.meta?.pets),
        breakfast: Boolean(venue?.meta?.breakfast),
      },
    },
    mediaFields: media.map((mediaItem) => ({
      url: mediaItem.url || "",
      alt: mediaItem.alt || "",
    })),
  };
}
