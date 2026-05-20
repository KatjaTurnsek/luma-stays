const AUTH_KEY = "lumaAuth";

/**
 * Notifies React components that saved auth data has changed.
 * Components using useAuth listen for this event and update their auth state.
 */
function notifyAuthChange() {
  window.dispatchEvent(new Event("luma-auth-change"));
}

/**
 * Saves logged-in user data to local storage and notifies the app.
 * @param {object} authData - Login response data and saved profile data.
 */
export function saveAuth(authData) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
  notifyAuthChange();
}

/**
 * Gets saved auth data from local storage.
 * @returns {object|null} Saved auth data, or null when no user is logged in.
 */
export function getAuth() {
  const authData = localStorage.getItem(AUTH_KEY);

  if (!authData) {
    return null;
  }

  return JSON.parse(authData);
}

/**
 * Gets the saved access token from auth data.
 * Used by the API request helper to add bearer authentication.
 * @returns {string|null} Access token, or null when no user is logged in.
 */
export function getToken() {
  const authData = getAuth();
  return authData?.accessToken || null;
}

/**
 * Clears saved auth data from local storage and notifies the app.
 */
export function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
  notifyAuthChange();
}
