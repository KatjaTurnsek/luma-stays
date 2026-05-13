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
