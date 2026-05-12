import { useState } from "react";
import { Navigate } from "react-router-dom";

import CustomerProfileView from "../components/profile/CustomerProfileView";
import ProfileSummary from "../components/profile/ProfileSummary";
import VenueManagerProfileView from "../components/profile/VenueManagerProfileView";

import { getAuth } from "../utils/auth-storage";

import "../styles/profile.css";

export default function ProfilePage() {
  const [auth, setAuth] = useState(getAuth());

  if (!auth?.accessToken) {
    return <Navigate to="/login" replace />;
  }

  const isVenueManager = Boolean(auth?.venueManager);
  const heroText = isVenueManager
    ? "Manage your venues"
    : `Welcome back, ${auth?.name || "UserName"}`;

  return (
    <div className="profile-page">
      <section className="profile-page__hero" aria-label="Profile page intro">
        <div className="profile-page__hero-overlay">
          <h1>{heroText}</h1>
        </div>
      </section>

      <div className="container profile-page__container">
        <div className="profile-page__grid">
          <ProfileSummary auth={auth} onAuthUpdate={setAuth} />

          {isVenueManager ? (
            <VenueManagerProfileView auth={auth} />
          ) : (
            <CustomerProfileView />
          )}
        </div>
      </div>
    </div>
  );
}
