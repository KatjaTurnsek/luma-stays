import { request } from "./http-client";

/**
 * Updates a Holidaze profile owned by the logged-in user.
 * Used for profile changes such as updating the avatar image.
 * @param {string} name - Profile name.
 * @param {object} profileData - Profile update data.
 * @param {object} [profileData.avatar] - Optional avatar object.
 * @param {string} [profileData.avatar.url] - Avatar image URL.
 * @param {string} [profileData.avatar.alt] - Avatar image alt text.
 * @returns {Promise<object|null>} Updated profile API response.
 */
export function updateProfile(name, profileData) {
  return request(`/holidaze/profiles/${encodeURIComponent(name)}`, {
    method: "PUT",
    body: profileData,
  });
}

/**
 * Gets bookings for a specific customer profile.
 * Includes venue data so the customer profile can display booking cards.
 * @param {string} name - Profile name.
 * @returns {Promise<object|null>} Profile bookings API response.
 */
export function getProfileBookings(name) {
  return request(
    `/holidaze/profiles/${encodeURIComponent(
      name
    )}/bookings?_venue=true&sort=dateFrom&sortOrder=asc`
  );
}
