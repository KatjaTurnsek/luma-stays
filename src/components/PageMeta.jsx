import { useEffect } from "react";

const DEFAULT_TITLE = "Luma Stays | Accommodation Booking";

const DEFAULT_DESCRIPTION =
  "Luma Stays is an accommodation booking app where users can browse venues, create bookings, and manage stays through the Holidaze API.";

const DEFAULT_SOCIAL_IMAGE =
  "https://luma-stays.netlify.app/social-preview.webp";

const DEFAULT_SOCIAL_IMAGE_ALT = "Luma Stays accommodation booking app preview";

/**
 * Returns safe text content for meta values.
 * Falls back when the value is missing or empty.
 * @param {string} value - Preferred text value.
 * @param {string} fallback - Fallback text value.
 * @returns {string} Safe text content.
 */
function getSafeContent(value, fallback) {
  const text = String(value || "").trim();

  return text || fallback;
}

/**
 * Gets the current page URL without query strings or hash values.
 * @returns {string} Current clean page URL.
 */
function getPageUrl() {
  return `${window.location.origin}${window.location.pathname}`;
}

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
 * Creates or updates Open Graph meta tags.
 * @param {object} values - Open Graph values.
 * @param {string} values.title - Social title.
 * @param {string} values.description - Social description.
 * @param {string} values.image - Social preview image URL.
 * @param {string} values.imageAlt - Social preview image alt text.
 * @param {string} values.url - Page URL.
 */
function setOpenGraphTags({ title, description, image, imageAlt, url }) {
  setMetaTag("property", "og:type", "website");
  setMetaTag("property", "og:url", url);
  setMetaTag("property", "og:title", title);
  setMetaTag("property", "og:description", description);
  setMetaTag("property", "og:image", image);
  setMetaTag("property", "og:image:alt", imageAlt);
}

/**
 * Creates or updates Twitter/X preview meta tags.
 * @param {object} values - Twitter/X preview values.
 * @param {string} values.title - Social title.
 * @param {string} values.description - Social description.
 * @param {string} values.image - Social preview image URL.
 * @param {string} values.imageAlt - Social preview image alt text.
 */
function setTwitterTags({ title, description, image, imageAlt }) {
  setMetaTag("name", "twitter:card", "summary_large_image");
  setMetaTag("name", "twitter:title", title);
  setMetaTag("name", "twitter:description", description);
  setMetaTag("name", "twitter:image", image);
  setMetaTag("name", "twitter:image:alt", imageAlt);
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
    const safeTitle = getSafeContent(title, DEFAULT_TITLE);
    const safeDescription = getSafeContent(description, DEFAULT_DESCRIPTION);
    const safeImage = getSafeContent(image, DEFAULT_SOCIAL_IMAGE);
    const safeImageAlt = getSafeContent(imageAlt, DEFAULT_SOCIAL_IMAGE_ALT);
    const pageUrl = getPageUrl();

    document.title = safeTitle;

    setMetaTag("name", "description", safeDescription);

    setOpenGraphTags({
      title: safeTitle,
      description: safeDescription,
      image: safeImage,
      imageAlt: safeImageAlt,
      url: pageUrl,
    });

    setTwitterTags({
      title: safeTitle,
      description: safeDescription,
      image: safeImage,
      imageAlt: safeImageAlt,
    });

    setCanonicalUrl(pageUrl);
  }, [title, description, image, imageAlt]);

  return null;
}
