import placeholderImage from "../assets/images/venue-01.webp";

/**
 * Gets the best available avatar URL from auth data.
 * @param {object} auth - Saved auth data.
 * @returns {string|null} Avatar URL or null.
 */
export function getAvatarUrl(auth) {
  return auth?.avatar?.url || null;
}

/**
 * Checks if a string is a valid URL.
 * @param {string} value - URL value.
 * @returns {boolean} True if valid URL.
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
 * Gets readable location text.
 * @param {object} location - Venue location object.
 * @returns {string} Location text.
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
 * Gets the first venue image URL.
 * @param {object} venue - Venue data.
 * @returns {string} Image URL.
 */
export function getVenueImage(venue) {
  return venue?.media?.[0]?.url || placeholderImage;
}

/**
 * Formats a date for booking summaries.
 * @param {string} dateString - Date string.
 * @returns {string} Formatted date.
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
 * Formats a booking date range.
 * @param {object} booking - Booking data.
 * @returns {string} Date range text.
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
 * Gets upcoming bookings from owned venues.
 * @param {Array} venues - Owned venue list.
 * @returns {Array} Upcoming bookings.
 */
export function getUpcomingBookings(venues) {
  const today = new Date();

  return venues
    .flatMap((venue) =>
      (venue.bookings || []).map((booking) => ({
        ...booking,
        venueName: venue.name,
      }))
    )
    .filter((booking) => new Date(booking.dateTo) >= today)
    .sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));
}
