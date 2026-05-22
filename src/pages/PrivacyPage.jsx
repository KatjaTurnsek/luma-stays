import { Link } from "react-router-dom";

import PageMeta from "../components/PageMeta";

import "../styles/static-page.css";

export default function PrivacyPage() {
  return (
    <>
      <PageMeta
        title="Privacy | Luma Stays"
        description="Read how Luma Stays handles account information, booking data, profile details, and API-based project data."
      />

      <div className="static-page">
        <section className="static-page__hero">
          <div className="container">
            <h1>Privacy</h1>
            <p>
              This page explains what information is used in Luma Stays and how
              it supports the booking experience.
            </p>
          </div>
        </section>

        <section className="static-page__content">
          <div className="container static-page__container">
            <div className="static-page__section">
              <h2>Information used by the app</h2>
              <p>
                Luma Stays uses account information returned from the API, such
                as name, email, avatar, access token, and account role. This
                information is used to show the correct customer or venue
                manager experience.
              </p>
            </div>

            <div className="static-page__section">
              <h2>Local storage</h2>
              <p>
                When a user logs in, selected login data is saved in the
                browser’s local storage so the user can stay logged in while
                using the site. Logging out removes the saved login data from
                local storage.
              </p>
            </div>

            <div className="static-page__section">
              <h2>Bookings and venues</h2>
              <p>
                Booking and venue data is loaded from the connected Noroff API.
                This includes venue details, dates, guest numbers, profile
                bookings, and venue manager data.
              </p>
            </div>

            <div className="static-page__section">
              <h2>Images</h2>
              <p>
                Users can add image URLs for avatars and venues. These images
                are shown in the interface if the provided URL is valid and
                available.
              </p>
            </div>

            <div className="static-page__section">
              <h2>Project notice</h2>
              <p>
                Luma Stays is a student project and does not process payments or
                collect payment information. No real booking payments are
                handled through this site.
              </p>
            </div>

            <div className="static-page__cta">
              <Link to="/profile" className="ui-btn-primary">
                Go to profile
              </Link>
              <Link to="/venues" className="ui-btn-secondary">
                Explore stays
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
