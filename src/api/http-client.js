import { getToken } from "../utils/auth-storage";

const API_BASE_URL = "https://v2.api.noroff.dev";
const API_KEY = import.meta.env.VITE_NOROFF_API_KEY;

/**
 * Checks if a value can safely be sent as a JSON request body.
 * FormData is excluded because it must be sent without JSON stringifying.
 * @param {unknown} value - Value to check.
 * @returns {boolean} True if the value is a plain object.
 */
function isPlainObject(value) {
  return (
    value !== null && typeof value === "object" && !(value instanceof FormData)
  );
}

/**
 * Creates headers for API requests.
 * Adds JSON content type for plain object bodies, bearer token when logged in,
 * and Noroff API key when it exists in the environment variables.
 * @param {object} options - Fetch options.
 * @param {HeadersInit} [options.headers] - Optional custom request headers.
 * @param {unknown} [options.body] - Optional request body.
 * @returns {Headers} Prepared request headers.
 */
function createHeaders(options = {}) {
  const token = getToken();
  const headers = new Headers(options.headers || {});
  const isJsonBody = isPlainObject(options.body);

  if (isJsonBody && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (API_KEY) {
    headers.set("X-Noroff-API-Key", API_KEY);
  }

  return headers;
}

/**
 * Parses a fetch response if the response contains JSON.
 * @param {Response} response - Fetch response from the API.
 * @returns {Promise<object|null>} Parsed JSON data or null for empty responses.
 */
async function parseResponseData(response) {
  const contentType = response.headers.get("content-type");

  if (!contentType?.includes("application/json")) {
    return null;
  }

  return response.json();
}

/**
 * Gets a readable error message from an API response body.
 * @param {object|null} data - Parsed response data.
 * @returns {string} Error message for the user interface.
 */
function getErrorMessage(data) {
  return (
    data?.errors?.[0]?.message ||
    data?.message ||
    "Something went wrong. Please try again."
  );
}

/**
 * Sends a request to the Noroff API and returns parsed response data.
 * Adds authentication and API key headers automatically when available.
 * Plain object bodies are converted to JSON before sending.
 * @param {string} endpoint - API endpoint starting with a slash.
 * @param {object} [options={}] - Fetch options such as method, headers, and body.
 * @returns {Promise<object|null>} Parsed API response or null for empty responses.
 * @throws {Error} Throws a readable error message when the API response is not OK.
 */
export async function request(endpoint, options = {}) {
  const isJsonBody = isPlainObject(options.body);
  const headers = createHeaders(options);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    body: isJsonBody ? JSON.stringify(options.body) : options.body,
  });

  const data = await parseResponseData(response);

  if (!response.ok) {
    throw new Error(getErrorMessage(data));
  }

  return data;
}
