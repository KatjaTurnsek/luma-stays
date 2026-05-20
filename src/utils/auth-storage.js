const AUTH_KEY = "lumaAuth";

function notifyAuthChange() {
  window.dispatchEvent(new Event("luma-auth-change"));
}

/**
 * Saves logged-in user data.
 * @param {object} authData - Login response data
 */
export function saveAuth(authData) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
  notifyAuthChange();
}

/**
 * Gets saved auth data.
 * @returns {object|null} Saved auth data or null
 */
export function getAuth() {
  const authData = localStorage.getItem(AUTH_KEY);

  if (!authData) {
    return null;
  }

  return JSON.parse(authData);
}

/**
 * Gets saved access token.
 * @returns {string|null} Access token or null
 */
export function getToken() {
  const authData = getAuth();
  return authData?.accessToken || null;
}

/**
 * Clears saved auth data.
 */
export function clearAuth() {
  localStorage.removeItem(AUTH_KEY);
  notifyAuthChange();
}
