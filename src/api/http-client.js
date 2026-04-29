import { getToken } from "../utils/auth-storage";

const API_BASE_URL = "https://v2.api.noroff.dev";

/**
 * Reusable API request helper.
 * @param {string} endpoint - API endpoint starting with /
 * @param {object} options - Fetch options
 * @returns {Promise<object|null>} Parsed API response
 */
export async function request(endpoint, options = {}) {
  const token = getToken();

  const headers = new Headers(options.headers || {});

  if (!headers.has("Content-Type") && options.body) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
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
