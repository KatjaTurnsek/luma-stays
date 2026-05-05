import { getToken } from "../utils/auth-storage";

const API_BASE_URL = "https://v2.api.noroff.dev";
const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;

/**
 * Checks if a value is a plain object.
 * @param {unknown} value - Value to check.
 * @returns {boolean} True if value is a plain object.
 */
function isPlainObject(value) {
  return (
    value !== null && typeof value === "object" && !(value instanceof FormData)
  );
}

/**
 * Reusable API request helper.
 * @param {string} endpoint - API endpoint starting with /
 * @param {object} options - Fetch options.
 * @returns {Promise<object|null>} Parsed API response.
 */
export async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = new Headers(options.headers || {});
  const isJsonBody = isPlainObject(options.body);

  if (!headers.has("Content-Type") && isJsonBody) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (API_KEY) {
    headers.set("X-Noroff-API-Key", API_KEY);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    body: isJsonBody ? JSON.stringify(options.body) : options.body,
  });

  const contentType = response.headers.get("content-type");
  const data = contentType?.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    const message =
      data?.errors?.[0]?.message ||
      data?.message ||
      "Something went wrong. Please try again.";

    throw new Error(message);
  }

  return data;
}
