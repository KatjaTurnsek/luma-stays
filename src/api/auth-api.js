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

/**
 * Logs in a Holidaze user.
 * @param {object} credentials - Login form data.
 * @param {string} credentials.email - User email.
 * @param {string} credentials.password - User password.
 * @returns {Promise<object|null>} Login response with access token and profile data.
 */
export function loginUser(credentials) {
  return request("/auth/login?_holidaze=true", {
    method: "POST",
    body: credentials,
  });
}
