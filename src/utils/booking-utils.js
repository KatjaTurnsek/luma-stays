/**
 * Gets a timestamp from a date string.
 * @param {string} value - Date string.
 * @returns {number|null} Date timestamp, or null when invalid.
 */
function getDateTime(value) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.getTime();
}

/**
 * Gets the timestamp for the start of today.
 * Used so bookings ending today still count as current/upcoming.
 * @returns {number} Start of today timestamp.
 */
function getStartOfToday() {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return today.getTime();
}

/**
 * Checks if a customer booking belongs to the current venue.
 * Supports both nested venue data and direct venue ID values.
 * @param {object} booking - Customer booking.
 * @param {string} venueId - Current venue ID.
 * @returns {boolean} True if the booking belongs to the current venue.
 */
export function isBookingForVenue(booking, venueId) {
  return booking?.venue?.id === venueId || booking?.venueId === venueId;
}

/**
 * Checks if a booking is upcoming or currently active.
 * @param {object} booking - Customer booking.
 * @returns {boolean} True if the booking has not ended before today.
 */
export function isUpcomingBooking(booking) {
  const endTime = getDateTime(booking?.dateTo);

  if (!endTime) {
    return false;
  }

  return endTime >= getStartOfToday();
}

/**
 * Filters customer bookings to upcoming bookings for one venue.
 * @param {Array<object>} bookings - Customer profile bookings.
 * @param {string} venueId - Current venue ID.
 * @returns {Array<object>} Upcoming bookings for the current venue.
 */
export function getUpcomingBookingsForVenue(bookings = [], venueId) {
  if (!Array.isArray(bookings) || !venueId) {
    return [];
  }

  return bookings.filter(
    (booking) =>
      isBookingForVenue(booking, venueId) && isUpcomingBooking(booking)
  );
}

/**
 * Creates a safe local booking object after a booking API response.
 * Adds fallback data from the booking form when the API response is missing nested values.
 * @param {object} booking - Booking returned from the API.
 * @param {object} values - Fallback booking values.
 * @param {string} values.dateFrom - Start date ISO string.
 * @param {string} values.dateTo - End date ISO string.
 * @param {number} values.guests - Number of guests.
 * @param {string} values.venueId - Venue ID.
 * @returns {object} Booking object safe to use in local UI state.
 */
export function createLocalBooking(booking = {}, values = {}) {
  return {
    ...booking,
    dateFrom: booking.dateFrom || values.dateFrom,
    dateTo: booking.dateTo || values.dateTo,
    guests: booking.guests ?? values.guests,
    venue: booking.venue || { id: values.venueId },
  };
}
