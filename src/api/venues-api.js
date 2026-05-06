import { request } from "./http-client";

/**
 * Gets venues from the Holidaze API.
 * @returns {Promise<object>} Venues response.
 */
export function getVenues() {
  return request("/holidaze/venues?sort=created&sortOrder=desc&limit=12");
}

/**
 * Gets one venue by ID from the Holidaze API.
 * @param {string} id - Venue ID.
 * @returns {Promise<object>} Venue response.
 */
export function getVenueById(id) {
  return request(`/holidaze/venues/${id}?_owner=true&_bookings=true`);
}

/**
 * Creates a new venue.
 * @param {object} venueData - Venue form data.
 * @returns {Promise<object|null>} Created venue response.
 */
export function createVenue(venueData) {
  return request("/holidaze/venues", {
    method: "POST",
    body: venueData,
  });
}
