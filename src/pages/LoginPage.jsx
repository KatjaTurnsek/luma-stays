import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import UiAlert from "../components/UiAlert";
import { loginUser } from "../api/auth-api";
import { saveAuth } from "../utils/auth-storage";

import "../styles/auth.css";

const INITIAL_FORM_VALUES = {
  email: "",
  password: "",
};

/**
 * Validates login form values.
 * @param {object} values - Form values.
 * @param {string} values.email - Email address.
 * @param {string} values.password - Password.
 * @returns {object} Validation errors.
 */
function validateLoginForm(values) {
  const errors = {};

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  }

  if (!values.password) {
    errors.password = "Password is required.";
  }

  return errors;
}

/**
 * Returns helper text or error text for a field.
 * @param {object} props - Component props.
 * @param {string} props.error - Field error text.
 * @param {string} props.helperText - Default helper text.
 * @returns {JSX.Element} Helper or error text element.
 */
function FieldHelper({ error, helperText }) {
  return (
    <p
      className={`auth-form__helper ${error ? "auth-form__helper--error" : ""}`}
    >
      {error || helperText}
    </p>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState(INITIAL_FORM_VALUES);
  const [formErrors, setFormErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Updates form values.
   * @param {React.ChangeEvent<HTMLInputElement>} event - Input change event.
   */
  function handleChange(event) {
    const { name, value } = event.target;

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));

    setFormErrors((currentErrors) => ({
      ...currentErrors,
      [name]: "",
    }));

    setApiError("");
    setSuccessMessage("");
  }

  /**
   * Clears all feedback messages.
   */
  function clearMessages() {
    setApiError("");
    setSuccessMessage("");
  }

  /**
   * Submits the login form.
   * @param {React.FormEvent<HTMLFormElement>} event - Submit event.
   */
  async function handleSubmit(event) {
    event.preventDefault();

    const errors = validateLoginForm(formValues);
    setFormErrors(errors);
    clearMessages();

    if (Object.keys(errors).length > 0) {
      return;
    }

    const credentials = {
      email: formValues.email.trim().toLowerCase(),
      password: formValues.password,
    };

    try {
      setIsSubmitting(true);

      const response = await loginUser(credentials);
      saveAuth(response.data);

      setFormValues(INITIAL_FORM_VALUES);
      setSuccessMessage("Logged in successfully. Redirecting...");

      setTimeout(() => {
        navigate("/profile");
      }, 1000);
    } catch (error) {
      setApiError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="container auth-page__container">
        <section className="auth-card" aria-labelledby="login-title">
          <div className="auth-card__header">
            <h1 id="login-title">Log in</h1>
            <p>Log in to manage bookings and continue with Luma Stays.</p>
          </div>

          {(apiError || successMessage) && (
            <div className="auth-card__alerts">
              {apiError && (
                <UiAlert
                  message={apiError}
                  type="error"
                  onClose={() => setApiError("")}
                />
              )}

              {successMessage && (
                <UiAlert
                  message={successMessage}
                  type="success"
                  onClose={() => setSuccessMessage("")}
                />
              )}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <div className="auth-form__group">
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                name="email"
                type="email"
                value={formValues.email}
                onChange={handleChange}
                autoComplete="email"
                aria-invalid={Boolean(formErrors.email)}
              />
              <FieldHelper
                error={formErrors.email}
                helperText="Use your registered stud.noroff.no email."
              />
            </div>

            <div className="auth-form__group">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                name="password"
                type="password"
                value={formValues.password}
                onChange={handleChange}
                autoComplete="current-password"
                aria-invalid={Boolean(formErrors.password)}
              />
              <FieldHelper
                error={formErrors.password}
                helperText="Enter your account password."
              />
            </div>

            <button
              type="submit"
              className="ui-btn-primary auth-form__submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="auth-card__footer-text">
            No account yet? <Link to="/register">Register</Link>
          </p>
        </section>
      </div>
    </div>
  );
}
