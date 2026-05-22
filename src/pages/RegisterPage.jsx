import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import PageMeta from "../components/PageMeta";
import UiAlert from "../components/UiAlert";
import { registerUser } from "../api/auth-api";

import "../styles/auth.css";

const INITIAL_FORM_VALUES = {
  name: "",
  email: "",
  password: "",
  accountType: "customer",
};

/**
 * Validates register form values.
 * @param {object} values - Form values.
 * @param {string} values.name - Username.
 * @param {string} values.email - Email address.
 * @param {string} values.password - Password.
 * @param {string} values.accountType - Selected account type.
 * @returns {object} Validation errors.
 */
function validateRegisterForm(values) {
  const errors = {};
  const usernamePattern = /^[a-zA-Z0-9_]+$/;

  if (!values.name.trim()) {
    errors.name = "Username is required.";
  } else if (!usernamePattern.test(values.name.trim())) {
    errors.name = "Username can only use letters, numbers, and underscore.";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required.";
  } else if (!values.email.trim().toLowerCase().endsWith("@stud.noroff.no")) {
    errors.email = "Email must be a stud.noroff.no address.";
  }

  if (!values.password) {
    errors.password = "Password is required.";
  } else if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  if (!values.accountType) {
    errors.accountType = "Choose an account type.";
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

export default function RegisterPage() {
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
   * Submits the register form.
   * @param {React.FormEvent<HTMLFormElement>} event - Submit event.
   */
  async function handleSubmit(event) {
    event.preventDefault();

    const errors = validateRegisterForm(formValues);
    setFormErrors(errors);
    clearMessages();

    if (Object.keys(errors).length > 0) {
      return;
    }

    const newUser = {
      name: formValues.name.trim(),
      email: formValues.email.trim().toLowerCase(),
      password: formValues.password,
      venueManager: formValues.accountType === "venueManager",
    };

    try {
      setIsSubmitting(true);
      await registerUser(newUser);

      setFormValues(INITIAL_FORM_VALUES);
      setSuccessMessage("Account created. Redirecting to login...");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      setApiError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <PageMeta
        title="Register | Luma Stays"
        description="Create a Luma Stays account as a customer or venue manager to book stays or manage accommodation listings."
      />

      <div className="auth-page">
        <div className="container auth-page__container">
          <section className="auth-card" aria-labelledby="register-title">
            <div className="auth-card__header">
              <h1 id="register-title">Create an account</h1>
              <p>Register for Luma Stays and choose your account type.</p>
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
                <label htmlFor="register-name">Username</label>
                <input
                  id="register-name"
                  name="name"
                  type="text"
                  value={formValues.name}
                  onChange={handleChange}
                  autoComplete="username"
                  aria-invalid={Boolean(formErrors.name)}
                />
                <FieldHelper
                  error={formErrors.name}
                  helperText="No spaces. Use letters, numbers, and underscore only."
                />
              </div>

              <div className="auth-form__group">
                <label htmlFor="register-email">Email</label>
                <input
                  id="register-email"
                  name="email"
                  type="email"
                  value={formValues.email}
                  onChange={handleChange}
                  autoComplete="email"
                  aria-invalid={Boolean(formErrors.email)}
                />
                <FieldHelper
                  error={formErrors.email}
                  helperText="yourname@stud.noroff.no"
                />
              </div>

              <div className="auth-form__group">
                <label htmlFor="register-password">Password</label>
                <input
                  id="register-password"
                  name="password"
                  type="password"
                  value={formValues.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  aria-invalid={Boolean(formErrors.password)}
                />
                <FieldHelper
                  error={formErrors.password}
                  helperText="At least 8 characters"
                />
              </div>

              <fieldset className="auth-form__fieldset">
                <legend>Account type:</legend>

                <label className="auth-form__radio">
                  <input
                    type="radio"
                    name="accountType"
                    value="customer"
                    checked={formValues.accountType === "customer"}
                    onChange={handleChange}
                  />
                  <span>
                    <strong>Customer</strong>
                    <small>Browse venues and create bookings.</small>
                  </span>
                </label>

                <label className="auth-form__radio">
                  <input
                    type="radio"
                    name="accountType"
                    value="venueManager"
                    checked={formValues.accountType === "venueManager"}
                    onChange={handleChange}
                  />
                  <span>
                    <strong>Venue manager</strong>
                    <small>Create venues and manage bookings.</small>
                  </span>
                </label>

                {formErrors.accountType && (
                  <p className="auth-form__helper auth-form__helper--error">
                    {formErrors.accountType}
                  </p>
                )}
              </fieldset>

              <button
                type="submit"
                className="ui-btn-primary auth-form__submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Creating account..." : "Create account"}
              </button>
            </form>

            <p className="auth-card__footer-text">
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
