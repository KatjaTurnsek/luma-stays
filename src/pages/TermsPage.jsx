import { Link } from "react-router-dom";

import PageMeta from "../components/PageMeta";

import "../styles/static-page.css";

export default function TermsPage() {
  return (
    <>
      <PageMeta
        title="Terms | Luma Stays"
        description="Read the terms for using Luma Stays, including bookings, venue listings, account use, and user responsibilities."
      />

      <div className="static-page">
        <section className="static-page__hero">
          <div className="container">
            <h1>Terms</h1>
            <p>
              These terms explain the basic use of Luma Stays as a student-built
              accommodation booking project.
            </p>
          </div>
        </section>

        <section className="static-page__content">
          <div className="container static-page__container">
            <div className="static-page__section">
              <h2>Use of the site</h2>
              <p>
                Luma Stays is a front-end project created for learning and
                portfolio purposes. Users can browse venues, view venue details,
                register, log in, create bookings, and manage venues depending
                on their account type.
              </p>
            </div>

            <div className="static-page__section">
              <h2>Accounts</h2>
              <p>
                Registration requires a valid stud.noroff.no email address.
                Customers can create and view bookings. Venue managers can
                create, edit, and delete venues they manage.
              </p>
            </div>

            <div className="static-page__section">
              <h2>Bookings</h2>
              <p>
                Bookings are created through the connected API. Users are
                responsible for selecting correct dates and guest numbers before
                confirming a booking.
              </p>
            </div>

            <div className="static-page__section">
              <h2>Venue content</h2>
              <p>
                Venue managers are responsible for the venue information they
                add, including names, descriptions, images, prices, facilities,
                and guest limits.
              </p>
            </div>

            <div className="static-page__section">
              <h2>Project notice</h2>
              <p>
                Luma Stays is not a real commercial booking service. Payments,
                real accommodation agreements, and customer support are not
                handled by this project.
              </p>
            </div>

            <div className="static-page__cta">
              <Link to="/venues" className="ui-btn-primary">
                Explore stays
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
