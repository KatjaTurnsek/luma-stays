import { request } from "./http-client";

/**
 * Registers a new Holidaze user account.
 * Used by the register page for both customer and venue manager accounts.
 * @param {object} userData - Registration form data.
 * @param {string} userData.name - Username.
 * @param {string} userData.email - User email address. Must use a valid Noroff student email.
 * @param {string} userData.password - User password.
 * @param {boolean} userData.venueManager - Whether the account should be a venue manager.
 * @returns {Promise<object|null>} Registered user API response.
 */
export function registerUser(userData) {
  return request("/auth/register", {
    method: "POST",
    body: userData,
  });
}

/**
 * Logs in an existing Holidaze user.
 * The `_holidaze=true` query returns Holidaze profile data, including venue manager role.
 * @param {object} credentials - Login form data.
 * @param {string} credentials.email - User email address.
 * @param {string} credentials.password - User password.
 * @returns {Promise<object|null>} Login API response with access token and profile data.
 */
export function loginUser(credentials) {
  return request("/auth/login?_holidaze=true", {
    method: "POST",
    body: credentials,
  });
}
