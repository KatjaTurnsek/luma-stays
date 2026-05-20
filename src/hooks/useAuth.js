import { useEffect, useState } from "react";

import { clearAuth, getAuth } from "../utils/auth-storage";

/**
 * Reads and manages saved authentication state from local storage.
 * Keeps components updated when the custom `luma-auth-change` event is fired.
 * @returns {object} Auth state and helper functions.
 * @returns {object|null} returns.authData - Saved auth data for the logged-in user.
 * @returns {Function} returns.setAuthData - Setter used when profile data changes.
 * @returns {boolean} returns.isLoggedIn - Whether the user has a saved access token.
 * @returns {boolean} returns.isVenueManager - Whether the user is logged in as a venue manager.
 * @returns {Function} returns.refreshAuth - Refreshes auth state from local storage.
 * @returns {Function} returns.logout - Clears saved auth data and updates auth state.
 */
export default function useAuth() {
  const [authData, setAuthData] = useState(getAuth());

  const isLoggedIn = Boolean(authData?.accessToken);
  const isVenueManager = Boolean(authData?.venueManager);

  /**
   * Refreshes auth state from local storage.
   */
  function refreshAuth() {
    setAuthData(getAuth());
  }

  /**
   * Clears saved auth data and updates app auth state.
   */
  function logout() {
    clearAuth();
    setAuthData(null);
  }

  useEffect(() => {
    function handleAuthChange() {
      setAuthData(getAuth());
    }

    window.addEventListener("luma-auth-change", handleAuthChange);

    return () => {
      window.removeEventListener("luma-auth-change", handleAuthChange);
    };
  }, []);

  return {
    authData,
    setAuthData,
    isLoggedIn,
    isVenueManager,
    refreshAuth,
    logout,
  };
}
