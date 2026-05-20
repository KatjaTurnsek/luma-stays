import { useEffect, useState } from "react";

import { clearAuth, getAuth } from "../utils/auth-storage";

/**
 * Reads and manages saved auth state.
 * @returns {object} Auth state and helpers.
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
