import placeholderImage from "../assets/images/venue-01.webp";

/**
 * Gets the best available avatar URL from saved auth data.
 * Used by the profile summary and header avatar display.
 * @param {object|null} auth - Saved auth data.
 * @param {object} [auth.avatar] - Avatar object from the API.
 * @param {string} [auth.avatar.url] - Avatar image URL.
 * @returns {string|null} Avatar URL or null when no avatar exists.
 */
export function getAvatarUrl(auth) {
  return auth?.avatar?.url || null;
}

/**
 * Checks if a string is a valid HTTP or HTTPS URL.
 * Used for avatar URL validation.
 * @param {string} value - URL value to validate.
 * @returns {boolean} True if the value is a valid HTTP or HTTPS URL.
 */
export function isValidUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Gets readable location text from a venue location object.
 * Falls back to a default message if city and country are missing.
 * @param {object} location - Venue location object.
 * @param {string} [location.city] - Venue city.
 * @param {string} [location.country] - Venue country.
 * @returns {string} Readable location text.
 */
export function getLocationText(location) {
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
 * Gets the first image URL from a venue.
 * Falls back to a local placeholder image when the venue has no media.
 * @param {object} venue - Venue data.
 * @param {Array<object>} [venue.media] - Venue media array.
 * @returns {string} Venue image URL or placeholder image.
 */
export function getVenueImage(venue) {
  return venue?.media?.[0]?.url || placeholderImage;
}

/**
 * Formats a date for compact booking summaries.
 * @param {string} dateString - Date string from the API.
 * @returns {string} Formatted date, or an empty string when missing.
 */
export function formatBookingDate(dateString) {
  if (!dateString) {
    return "";
  }

  return new Date(dateString).toLocaleDateString("en-GB", {
    month: "short",
    day: "numeric",
  });
}

/**
 * Formats a booking date range for booking cards.
 * @param {object} booking - Booking data.
 * @param {string} booking.dateFrom - Booking start date.
 * @param {string} booking.dateTo - Booking end date.
 * @returns {string} Readable date range text.
 */
export function formatBookingDateRange(booking) {
  const dateFrom = formatBookingDate(booking.dateFrom);
  const dateTo = formatBookingDate(booking.dateTo);

  if (!dateFrom || !dateTo) {
    return "Dates not added";
  }

  return `${dateFrom} - ${dateTo}`;
}

/**
 * Gets upcoming bookings from venues owned by a venue manager.
 * Adds venue details to each booking so booking overview cards can display venue information.
 * @param {Array<object>} venues - Owned venue list.
 * @returns {Array<object>} Upcoming bookings sorted by start date.
 */
export function getUpcomingBookings(venues) {
  const today = new Date();

  return venues
    .flatMap((venue) =>
      (venue.bookings || []).map((booking) => ({
        ...booking,
        venueId: venue.id,
        venueName: venue.name,
        venue: {
          id: venue.id,
          name: venue.name,
          media: venue.media,
          location: venue.location,
          price: venue.price,
        },
      }))
    )
    .filter((booking) => new Date(booking.dateTo) >= today)
    .sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
}

/**
 * Gets upcoming bookings for the logged-in customer.
 * Past bookings are removed and the remaining bookings are sorted by start date.
 * @param {Array<object>} bookings - Customer bookings from the API.
 * @returns {Array<object>} Upcoming customer bookings sorted by start date.
 */
export function getUpcomingCustomerBookings(bookings) {
  const today = new Date();

  return (bookings || [])
    .filter((booking) => new Date(booking.dateTo) >= today)
    .sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
}
