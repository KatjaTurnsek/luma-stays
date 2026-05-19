import { request } from "./http-client";

/**
 * Gets venues from the Holidaze API.
 * @param {number} limit - Number of venues to request.
 * @returns {Promise<object>} Venues response.
 */
export function getVenues(limit = 12) {
  return request(`/holidaze/venues?sort=created&sortOrder=desc&limit=${limit}`);
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
 * Gets venues owned by a profile.
 * @param {string} profileName - Profile name.
 * @returns {Promise<object|null>} Profile venues response.
 */
export function getProfileVenues(profileName) {
  return request(
    `/holidaze/profiles/${encodeURIComponent(
      profileName
    )}/venues?_bookings=true&sort=created&sortOrder=desc`
  );
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

/**
 * Updates an existing venue.
 * @param {string} id - Venue ID.
 * @param {object} venueData - Updated venue form data.
 * @returns {Promise<object|null>} Updated venue response.
 */
export function updateVenue(id, venueData) {
  return request(`/holidaze/venues/${id}`, {
    method: "PUT",
    body: venueData,
  });
}

/**
 * Deletes an existing venue.
 * @param {string} id - Venue ID.
 * @returns {Promise<object|null>} Deleted venue response.
 */
export function deleteVenue(id) {
  return request(`/holidaze/venues/${id}`, {
    method: "DELETE",
  });
}
