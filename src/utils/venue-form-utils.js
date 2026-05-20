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

export const EMPTY_MEDIA = [
  {
    url: "",
    alt: "",
  },
];

/**
 * Converts venue API data into form values.
 * @param {object} venue - Venue API data.
 * @returns {object} Form values and media fields.
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
