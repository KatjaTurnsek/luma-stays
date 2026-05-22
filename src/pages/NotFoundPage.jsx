import { Link } from "react-router-dom";

import PageMeta from "../components/PageMeta";

import "../styles/static-page.css";

export default function NotFoundPage() {
  return (
    <>
      <PageMeta
        title="Page Not Found | Luma Stays"
        description="The page you are looking for could not be found. Return to Luma Stays to continue browsing accommodation."
      />

      <div className="static-page">
        <section className="static-page__hero">
          <div className="container">
            <h1>Page not found</h1>
            <p>
              The page you are looking for does not exist or may have been
              moved.
            </p>
          </div>
        </section>

        <section className="static-page__content">
          <div className="container static-page__container">
            <div className="static-page__section">
              <h2>Let’s get you back</h2>
              <p>
                You can return to the home page or continue browsing available
                stays.
              </p>
            </div>

            <div className="static-page__cta">
              <Link to="/" className="ui-btn-secondary">
                Back to home
              </Link>

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
