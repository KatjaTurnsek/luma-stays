import { useEffect } from "react";

/**
 * Updates page title and meta description for React routes.
 * @param {object} props - Component props.
 * @param {string} props.title - Page title.
 * @param {string} props.description - Meta description.
 * @returns {null} This component does not render visible UI.
 */
export default function PageMeta({ title, description }) {
  useEffect(() => {
    document.title = title;

    let metaDescription = document.querySelector('meta[name="description"]');

    if (!metaDescription) {
      metaDescription = document.createElement("meta");
      metaDescription.setAttribute("name", "description");
      document.head.appendChild(metaDescription);
    }

    metaDescription.setAttribute("content", description);
  }, [title, description]);

  return null;
}
