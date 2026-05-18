import { request } from "./http-client";

/**
 * Updates a Holidaze profile.
 * @param {string} name - Profile name.
 * @param {object} profileData - Profile update data.
 * @returns {Promise<object|null>} Updated profile response.
 */
export function updateProfile(name, profileData) {
  return request(`/holidaze/profiles/${encodeURIComponent(name)}`, {
    method: "PUT",
    body: profileData,
  });
}

/**
 * Gets bookings for a profile.
 * @param {string} name - Profile name.
 * @returns {Promise<object|null>} Profile bookings response.
 */
export function getProfileBookings(name) {
  return request(
    `/holidaze/profiles/${encodeURIComponent(
      name
    )}/bookings?_venue=true&sort=dateFrom&sortOrder=asc`
  );
}
