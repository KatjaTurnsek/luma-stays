import { Link } from "react-router-dom";

/**
 * Displays an empty state card.
 * @param {object} props - Component props.
 * @param {string} props.title - Empty state title.
 * @param {string} props.text - Empty state text.
 * @param {string} props.linkTo - Link path.
 * @param {string} props.linkText - Link text.
 * @returns {JSX.Element} Empty state.
 */
export default function EmptyState({ title, text, linkTo, linkText }) {
  return (
    <div className="profile-page__empty-state">
      <h3>{title}</h3>
      <p>{text}</p>
      <Link to={linkTo} className="ui-btn-primary profile-page__empty-link">
        {linkText}
      </Link>
    </div>
  );
}
