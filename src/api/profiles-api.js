import { request } from "./http-client";

/**
 * Updates a Holidaze profile.
 * @param {string} name - Profile name.
 * @param {object} profileData - Profile update data.
 * @returns {Promise<object|null>} Updated profile response.
 */
export function updateProfile(name, profileData) {
  return request(`/holidaze/profiles/${name}`, {
    method: "PUT",
    body: profileData,
  });
}
