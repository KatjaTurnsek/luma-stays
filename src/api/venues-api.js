import { request } from "./http-client";

/**
 * Gets a list of venues from the Holidaze API.
 * Venues are returned newest first and can be paginated.
 * @param {number} [limit=12] - Number of venues to request per page.
 * @param {number} [page=1] - Page number to request.
 * @returns {Promise<object|null>} Venues API response.
 */
export function getVenues(limit = 12, page = 1) {
  return request(
    `/holidaze/venues?sort=created&sortOrder=desc&limit=${limit}&page=${page}`
  );
}

/**
 * Gets one venue by ID, including owner and booking data.
 * Used by the venue details page and edit venue page.
 * @param {string} id - Venue ID.
 * @returns {Promise<object|null>} Venue API response.
 */
export function getVenueById(id) {
  return request(`/holidaze/venues/${id}?_owner=true&_bookings=true`);
}

/**
 * Gets venues owned by a specific profile.
 * Includes booking data so the venue manager profile can show booking overview.
 * @param {string} profileName - Profile name of the venue manager.
 * @returns {Promise<object|null>} Profile venues API response.
 */
export function getProfileVenues(profileName) {
  return request(
    `/holidaze/profiles/${encodeURIComponent(
      profileName
    )}/venues?_bookings=true&sort=created&sortOrder=desc`
  );
}

/**
 * Creates a new venue for the logged-in venue manager.
 * @param {object} venueData - Venue data from the create venue form.
 * @returns {Promise<object|null>} Created venue API response.
 */
export function createVenue(venueData) {
  return request("/holidaze/venues", {
    method: "POST",
    body: venueData,
  });
}

/**
 * Updates an existing venue owned by the logged-in venue manager.
 * @param {string} id - Venue ID.
 * @param {object} venueData - Updated venue data from the edit venue form.
 * @returns {Promise<object|null>} Updated venue API response.
 */
export function updateVenue(id, venueData) {
  return request(`/holidaze/venues/${id}`, {
    method: "PUT",
    body: venueData,
  });
}

/**
 * Deletes an existing venue owned by the logged-in venue manager.
 * @param {string} id - Venue ID.
 * @returns {Promise<object|null>} Deleted venue API response or null.
 */
export function deleteVenue(id) {
  return request(`/holidaze/venues/${id}`, {
    method: "DELETE",
  });
}
