import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAuth, clearAuth } from "../utils/auth-storage";

import logoDark from "../assets/logos/logo-dark.svg";
import footerIllustration from "../assets/images/footer-illustration.svg";

import "../styles/footer.css";

export default function Footer() {
  const [authData, setAuthData] = useState(getAuth());

  const location = useLocation();
  const navigate = useNavigate();

  const isLoggedIn = Boolean(authData?.accessToken);
  const isVenueManager = Boolean(authData?.venueManager);

  useEffect(() => {
    setAuthData(getAuth());
  }, [location.pathname]);

  useEffect(() => {
    function handleAuthChange() {
      setAuthData(getAuth());
    }

    window.addEventListener("luma-auth-change", handleAuthChange);

    return () => {
      window.removeEventListener("luma-auth-change", handleAuthChange);
    };
  }, []);

  function handleLogout() {
    clearAuth();
    setAuthData(null);
    window.dispatchEvent(new Event("luma-auth-change"));
    navigate("/");
  }

  return (
    <footer className="ui-footer">
      <div className="ui-footer__top">
        <div className="ui-footer__brand">
          <Link to="/" aria-label="Luma Stays home">
            <img src={logoDark} alt="Luma Stays" className="ui-footer__logo" />
          </Link>

          <p>Stay somewhere worth remembering.</p>
        </div>

        <nav className="ui-footer__links" aria-label="Footer navigation">
          <ul>
            <li>
              <Link to="/help">Help</Link>
            </li>
            <li>
              <Link to="/terms">Terms</Link>
            </li>
            <li>
              <Link to="/privacy">Privacy</Link>
            </li>
          </ul>

          <span className="ui-footer__divider"></span>

          <ul>
            <li>
              <Link to="/venues">Explore stays</Link>
            </li>

            {!isLoggedIn && (
              <>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/register">Register</Link>
                </li>
              </>
            )}

            {isLoggedIn && isVenueManager && (
              <li>
                <Link to="/venues/create">Create venue</Link>
              </li>
            )}

            {isLoggedIn && (
              <>
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
                <li>
                  <button type="button" onClick={handleLogout}>
                    Log out
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>

      <div className="ui-footer__illustration-wrap">
        <img
          src={footerIllustration}
          alt=""
          aria-hidden="true"
          className="ui-footer__illustration"
        />
      </div>

      <div className="ui-footer__bottom">
        <p>© 2026 Luma Stays. All rights reserved.</p>
      </div>
    </footer>
  );
}
