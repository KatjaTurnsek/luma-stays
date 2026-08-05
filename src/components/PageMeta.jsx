import { useEffect } from "react";

const DEFAULT_SOCIAL_IMAGE =
  "https://luma-stays.netlify.app/social-preview.webp";

const DEFAULT_SOCIAL_IMAGE_ALT = "Luma Stays accommodation booking app preview";

/**
 * Creates or updates one meta tag.
 * @param {"name" | "property"} attributeName - Meta attribute name.
 * @param {string} attributeValue - Meta name or property value.
 * @param {string} content - Meta content value.
 */
function setMetaTag(attributeName, attributeValue, content) {
  let metaTag = document.querySelector(
    `meta[${attributeName}="${attributeValue}"]`
  );

  if (!metaTag) {
    metaTag = document.createElement("meta");
    metaTag.setAttribute(attributeName, attributeValue);
    document.head.appendChild(metaTag);
  }

  metaTag.setAttribute("content", content);
}

/**
 * Creates or updates the canonical URL.
 * @param {string} url - Page URL.
 */
function setCanonicalUrl(url) {
  let canonicalLink = document.querySelector('link[rel="canonical"]');

  if (!canonicalLink) {
    canonicalLink = document.createElement("link");
    canonicalLink.setAttribute("rel", "canonical");
    document.head.appendChild(canonicalLink);
  }

  canonicalLink.setAttribute("href", url);
}

/**
 * Updates page title, meta description, and social preview data for React routes.
 * @param {object} props - Component props.
 * @param {string} props.title - Page title.
 * @param {string} props.description - Meta description.
 * @param {string} [props.image] - Social preview image URL.
 * @param {string} [props.imageAlt] - Social preview image alt text.
 * @returns {null} This component does not render visible UI.
 */
export default function PageMeta({
  title,
  description,
  image = DEFAULT_SOCIAL_IMAGE,
  imageAlt = DEFAULT_SOCIAL_IMAGE_ALT,
}) {
  useEffect(() => {
    const pageUrl = window.location.href;

    document.title = title;

    setMetaTag("name", "description", description);
    setMetaTag("property", "og:type", "website");
    setMetaTag("property", "og:url", pageUrl);
    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:image", image);
    setMetaTag("property", "og:image:alt", imageAlt);

    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", title);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:image", image);
    setMetaTag("name", "twitter:image:alt", imageAlt);

    setCanonicalUrl(pageUrl);
  }, [title, description, image, imageAlt]);

  return null;
}
