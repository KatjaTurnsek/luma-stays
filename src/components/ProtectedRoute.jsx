import { Navigate, useLocation } from "react-router-dom";
import { getAuth } from "../utils/auth-storage";

/**
 * Protects routes that require login or a venue manager role.
 * @param {object} props - Component props.
 * @param {JSX.Element} props.children - Page component to render.
 * @param {boolean} [props.requireVenueManager] - Whether route is manager-only.
 * @returns {JSX.Element} Protected page or redirect.
 */
export default function ProtectedRoute({
  children,
  requireVenueManager = false,
}) {
  const location = useLocation();
  const auth = getAuth();

  const isLoggedIn = Boolean(auth?.accessToken);
  const isVenueManager = Boolean(auth?.venueManager);

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (requireVenueManager && !isVenueManager) {
    return <Navigate to="/profile" replace />;
  }

  return children;
}
