import { request } from "./http-client";

/**
 * Creates a new booking.
 * @param {object} bookingData - Booking data.
 * @returns {Promise<object|null>} Created booking response.
 */
export function createBooking(bookingData) {
  return request("/holidaze/bookings", {
    method: "POST",
    body: bookingData,
  });
}

/**
 * Deletes an existing booking.
 * @param {string} id - Booking ID.
 * @returns {Promise<object|null>} Deleted booking response.
 */
export function deleteBooking(id) {
  return request(`/holidaze/bookings/${id}`, {
    method: "DELETE",
  });
}
