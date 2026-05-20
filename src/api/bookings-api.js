import { request } from "./http-client";

/**
 * Creates a new booking for the logged-in customer.
 * Used by the venue booking card after the customer selects dates and guests.
 * @param {object} bookingData - Booking data sent to the API.
 * @param {string} bookingData.dateFrom - Booking start date as an ISO string.
 * @param {string} bookingData.dateTo - Booking end date as an ISO string.
 * @param {number} bookingData.guests - Number of guests for the booking.
 * @param {string} bookingData.venueId - ID of the venue being booked.
 * @returns {Promise<object|null>} Created booking API response.
 */
export function createBooking(bookingData) {
  return request("/holidaze/bookings", {
    method: "POST",
    body: bookingData,
  });
}

/**
 * Deletes an existing booking owned by the logged-in customer.
 * Used when a customer cancels a booking from the profile page.
 * @param {string} id - Booking ID.
 * @returns {Promise<object|null>} Deleted booking API response or null.
 */
export function deleteBooking(id) {
  return request(`/holidaze/bookings/${id}`, {
    method: "DELETE",
  });
}
