import { request } from "./http-client";

/**
 * Gets venues from the Holidaze API.
 * @returns {Promise<object>} Venues response
 */
export function getVenues() {
  return request("/holidaze/venues?sort=created&sortOrder=desc&limit=12");
}
