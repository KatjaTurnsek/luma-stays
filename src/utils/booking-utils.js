/**
 * Checks if a customer booking belongs to the current venue.
 * @param {object} booking - Customer booking.
 * @param {string} venueId - Current venue ID.
 * @returns {boolean} True if the booking belongs to the current venue.
 */
export function isBookingForVenue(booking, venueId) {
  return booking?.venue?.id === venueId;
}

/**
 * Checks if a booking is upcoming.
 * @param {object} booking - Customer booking.
 * @returns {boolean} True if the booking has not ended yet.
 */
export function isUpcomingBooking(booking) {
  const endDate = new Date(booking?.dateTo);

  if (Number.isNaN(endDate.getTime())) {
    return false;
  }

  return endDate >= new Date();
}

/**
 * Filters customer bookings to upcoming bookings for one venue.
 * @param {Array<object>} bookings - Customer profile bookings.
 * @param {string} venueId - Current venue ID.
 * @returns {Array<object>} Upcoming bookings for the current venue.
 */
export function getUpcomingBookingsForVenue(bookings, venueId) {
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
export function createLocalBooking(booking, values) {
  return {
    ...booking,
    dateFrom: booking.dateFrom || values.dateFrom,
    dateTo: booking.dateTo || values.dateTo,
    guests: booking.guests || values.guests,
    venue: booking.venue || { id: values.venueId },
  };
}
