import { Navigate } from "react-router-dom";

import CustomerProfileView from "../components/profile/CustomerProfileView";
import ProfileSummary from "../components/profile/ProfileSummary";
import VenueManagerProfileView from "../components/profile/VenueManagerProfileView";

import useAuth from "../hooks/useAuth";

import "../styles/profile.css";

export default function ProfilePage() {
  const { authData, setAuthData, isLoggedIn, isVenueManager } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  const heroText = isVenueManager
    ? "Manage your venues"
    : `Welcome back, ${authData?.name || "UserName"}`;

  return (
    <div className="profile-page">
      <section className="profile-page__hero" aria-label="Profile page intro">
        <div className="profile-page__hero-overlay">
          <h1>{heroText}</h1>
        </div>
      </section>

      <div className="container profile-page__container">
        <div className="profile-page__grid">
          <ProfileSummary auth={authData} onAuthUpdate={setAuthData} />

          {isVenueManager ? (
            <VenueManagerProfileView auth={authData} />
          ) : (
            <CustomerProfileView />
          )}
        </div>
      </div>
    </div>
  );
}
