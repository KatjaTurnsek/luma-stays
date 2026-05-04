import { request } from "./http-client";

/**
 * Registers a new Holidaze user.
 * @param {object} userData - Registration form data.
 * @param {string} userData.name - Username.
 * @param {string} userData.email - User email.
 * @param {string} userData.password - User password.
 * @param {boolean} userData.venueManager - Whether the user is a venue manager.
 * @returns {Promise<object|null>} Registered user data.
 */
export function registerUser(userData) {
  return request("/auth/register", {
    method: "POST",
    body: userData,
  });
}
