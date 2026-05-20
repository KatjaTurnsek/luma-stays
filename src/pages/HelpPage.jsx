import { Link } from "react-router-dom";

import "../styles/static-page.css";

export default function HelpPage() {
  return (
    <div className="static-page">
      <section className="static-page__hero">
        <div className="container">
          <h1>Help</h1>
          <p>
            Find quick answers about browsing stays, making bookings, and
            managing venues on Luma Stays.
          </p>
        </div>
      </section>

      <section className="static-page__content">
        <div className="container static-page__container">
          <div className="static-page__section">
            <h2>For guests</h2>

            <div className="static-page__text-block">
              <h3>How do I find a stay?</h3>
              <p>
                Use the search field on the home page or explore all stays from
                the venues page. You can search by location or stay name, add a
                guest count, and sort the results.
              </p>
            </div>

            <div className="static-page__text-block">
              <h3>How do I book a venue?</h3>
              <p>
                Open a venue details page, choose available dates from the
                calendar, select the number of guests, and confirm the booking.
                You need to be logged in as a customer to create a booking.
              </p>
            </div>

            <div className="static-page__text-block">
              <h3>Where can I see my bookings?</h3>
              <p>
                After logging in, go to your profile page. Your upcoming
                bookings will show under My bookings.
              </p>
            </div>
          </div>

          <div className="static-page__section">
            <h2>For venue managers</h2>

            <div className="static-page__text-block">
              <h3>How do I create a venue?</h3>
              <p>
                Register or log in as a venue manager, then use the Create venue
                button in the header, footer, or profile page.
              </p>
            </div>

            <div className="static-page__text-block">
              <h3>Can I edit or delete my venues?</h3>
              <p>
                Yes. Venue managers can edit and delete venues they own from the
                profile page.
              </p>
            </div>

            <div className="static-page__text-block">
              <h3>Where can I see customer bookings?</h3>
              <p>
                Venue managers can see upcoming bookings for their managed
                venues on the profile page.
              </p>
            </div>
          </div>

          <div className="static-page__cta">
            <Link to="/venues" className="ui-btn-primary">
              Explore stays
            </Link>
            <Link to="/profile" className="ui-btn-secondary">
              Go to profile
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
