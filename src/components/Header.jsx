import { useEffect, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import useAuth from "../hooks/useAuth";

import logoDark from "../assets/logos/logo-dark.svg";
import menuIcon from "../assets/icons/menu.svg";
import searchIcon from "../assets/icons/search.svg";
import loginIcon from "../assets/icons/login.svg";
import registerIcon from "../assets/icons/register.svg";
import userIcon from "../assets/icons/user.svg";
import logoutIcon from "../assets/icons/logout.svg";
import addIcon from "../assets/icons/add.svg";
import chevronDownIcon from "../assets/icons/chevron-down.svg";

import "../styles/header.css";

export default function Header() {
  const { authData, isLoggedIn, isVenueManager, refreshAuth, logout } =
    useAuth();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const isSimpleHeader =
    location.pathname === "/login" || location.pathname === "/register";

  const userName = authData?.name || "UserName";
  const avatarUrl = authData?.avatar?.url;

  useEffect(() => {
    refreshAuth();
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  function handleLogout() {
    logout();
    setIsMenuOpen(false);
    setIsProfileOpen(false);
    navigate("/");
  }

  function toggleMenu() {
    setIsMenuOpen((isOpen) => !isOpen);
    setIsProfileOpen(false);
  }

  function toggleProfileMenu() {
    setIsProfileOpen((isOpen) => !isOpen);
    setIsMenuOpen(false);
  }

  return (
    <header className="ui-header">
      <div className="ui-header__inner">
        <Link
          to="/"
          className="ui-header__logo-link"
          aria-label="Luma Stays home"
        >
          <img src={logoDark} className="ui-header__logo" alt="Luma Stays" />
        </Link>

        <nav className="ui-header__desktop-nav" aria-label="Main navigation">
          <span className="ui-header__divider"></span>

          <NavLink to="/venues" className="ui-header__link">
            Explore stays
          </NavLink>

          <Link
            to="/venues"
            className="ui-header__icon-link"
            aria-label="Search stays"
          >
            <img src={searchIcon} alt="" aria-hidden="true" />
          </Link>
        </nav>

        {!isSimpleHeader && (
          <div className="ui-header__desktop-actions">
            {!isLoggedIn && (
              <>
                <Link to="/login" className="ui-btn-primary ui-header__button">
                  Login
                </Link>

                <Link
                  to="/register"
                  className="ui-btn-primary ui-header__button"
                >
                  Register
                </Link>
              </>
            )}

            {isLoggedIn && isVenueManager && (
              <Link
                to="/venues/create"
                className="ui-btn-primary ui-header__button"
              >
                Create venue
              </Link>
            )}

            {isLoggedIn && (
              <div className="ui-header__profile">
                <button
                  type="button"
                  className="ui-header__profile-button"
                  onClick={toggleProfileMenu}
                  aria-expanded={isProfileOpen}
                  aria-label="Open profile menu"
                >
                  <span className="ui-header__status-dot">
                    <img src={chevronDownIcon} alt="" aria-hidden="true" />
                  </span>

                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      className="ui-header__avatar"
                      alt={`${userName} avatar`}
                    />
                  ) : (
                    <span className="ui-header__avatar ui-header__avatar--fallback">
                      <img src={userIcon} alt="" aria-hidden="true" />
                    </span>
                  )}
                </button>

                {isProfileOpen && (
                  <div className="ui-header__profile-menu">
                    <Link to="/profile" onClick={() => setIsProfileOpen(false)}>
                      <span>Profile</span>
                      <img src={userIcon} alt="" aria-hidden="true" />
                    </Link>

                    <button type="button" onClick={handleLogout}>
                      <span>Log out</span>
                      <img src={logoutIcon} alt="" aria-hidden="true" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <button
          type="button"
          className="ui-header__menu-button"
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-label="Open navigation menu"
        >
          <img src={menuIcon} alt="" aria-hidden="true" />
        </button>
      </div>

      {isMenuOpen && (
        <nav className="ui-header__mobile-menu" aria-label="Mobile navigation">
          {isLoggedIn && (
            <div className="ui-header__mobile-user">
              <span>{userName}</span>

              {avatarUrl ? (
                <img src={avatarUrl} alt={`${userName} avatar`} />
              ) : (
                <img src={userIcon} alt="" aria-hidden="true" />
              )}
            </div>
          )}

          <Link to="/venues" onClick={() => setIsMenuOpen(false)}>
            <span>Explore stays</span>
            <img src={searchIcon} alt="" aria-hidden="true" />
          </Link>

          {!isLoggedIn && (
            <>
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <span>Log in</span>
                <img src={loginIcon} alt="" aria-hidden="true" />
              </Link>

              <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                <span>Register</span>
                <img src={registerIcon} alt="" aria-hidden="true" />
              </Link>
            </>
          )}

          {isLoggedIn && isVenueManager && (
            <Link to="/venues/create" onClick={() => setIsMenuOpen(false)}>
              <span>Create venue</span>
              <img src={addIcon} alt="" aria-hidden="true" />
            </Link>
          )}

          {isLoggedIn && (
            <>
              <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                <span>Profile</span>
                <img src={userIcon} alt="" aria-hidden="true" />
              </Link>

              <button type="button" onClick={handleLogout}>
                <span>Log out</span>
                <img src={logoutIcon} alt="" aria-hidden="true" />
              </button>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
