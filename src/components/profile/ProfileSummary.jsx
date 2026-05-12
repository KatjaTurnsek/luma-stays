import { useState } from "react";

import UiAlert from "../UiAlert";

import { updateProfile } from "../../api/profiles-api";
import { saveAuth } from "../../utils/auth-storage";
import { getAvatarUrl, isValidUrl } from "../../utils/profile-utils";

import userIcon from "../../assets/icons/user.svg";

/**
 * Displays the shared profile summary and avatar update form.
 * @param {object} props - Component props.
 * @param {object} props.auth - Saved auth data.
 * @param {Function} props.onAuthUpdate - Updates auth state after profile change.
 * @returns {JSX.Element} Profile summary section.
 */
export default function ProfileSummary({ auth, onAuthUpdate }) {
  const avatarUrl = getAvatarUrl(auth);
  const accountType = auth?.venueManager ? "Venue manager" : "Customer";

  const [avatarInput, setAvatarInput] = useState(avatarUrl || "");
  const [avatarError, setAvatarError] = useState("");
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  /**
   * Updates the avatar input value.
   * @param {React.ChangeEvent<HTMLInputElement>} event - Input change event.
   */
  function handleAvatarChange(event) {
    setAvatarInput(event.target.value);
    setAvatarError("");
    setApiError("");
    setSuccessMessage("");
  }

  /**
   * Clears feedback messages.
   */
  function clearMessages() {
    setAvatarError("");
    setApiError("");
    setSuccessMessage("");
  }

  /**
   * Submits avatar update.
   * @param {React.FormEvent<HTMLFormElement>} event - Form submit event.
   */
  async function handleAvatarSubmit(event) {
    event.preventDefault();
    clearMessages();

    const trimmedUrl = avatarInput.trim();

    if (!trimmedUrl) {
      setAvatarError("Avatar URL is required.");
      return;
    }

    if (!isValidUrl(trimmedUrl)) {
      setAvatarError("Please add a valid image URL.");
      return;
    }

    try {
      setIsUpdating(true);

      const response = await updateProfile(auth.name, {
        avatar: {
          url: trimmedUrl,
          alt: `${auth.name} avatar`,
        },
      });

      const updatedAuth = {
        ...auth,
        ...response.data,
        accessToken: auth.accessToken,
      };

      saveAuth(updatedAuth);
      onAuthUpdate(updatedAuth);
      window.dispatchEvent(new Event("luma-auth-change"));

      setSuccessMessage("Avatar updated.");
    } catch (error) {
      setApiError(error.message);
    } finally {
      setIsUpdating(false);
    }
  }

  return (
    <section className="profile-page__section profile-page__summary-section">
      <h2>Profile summary</h2>

      <div className="profile-page__section-line"></div>

      <div className="profile-page__summary">
        <div className="profile-page__avatar-wrap">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={`${auth.name} avatar`}
              className="profile-page__avatar"
            />
          ) : (
            <div className="profile-page__avatar profile-page__avatar--fallback">
              <img src={userIcon} alt="" aria-hidden="true" />
            </div>
          )}
        </div>

        <div>
          <h3>{auth?.name || "UserName"}</h3>
          <p>{auth?.email || "yourname@stud.noroff.no"}</p>
          <p className="profile-page__account-type">{accountType}</p>
        </div>
      </div>

      <form
        className="profile-page__avatar-form"
        onSubmit={handleAvatarSubmit}
        noValidate
      >
        <label htmlFor="avatar-url">Avatar URL</label>

        <input
          id="avatar-url"
          type="url"
          value={avatarInput}
          onChange={handleAvatarChange}
          placeholder="https://example.com/avatar.jpg"
          aria-invalid={Boolean(avatarError)}
        />

        <p
          className={`profile-page__avatar-help ${
            avatarError ? "profile-page__avatar-help--error" : ""
          }`}
        >
          {avatarError || "Use a direct image URL for your profile avatar."}
        </p>

        <button
          type="submit"
          className="ui-btn-secondary"
          disabled={isUpdating}
        >
          {isUpdating ? "Saving..." : "Update avatar"}
        </button>
      </form>

      {(apiError || successMessage) && (
        <>
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
        </>
      )}
    </section>
  );
}
