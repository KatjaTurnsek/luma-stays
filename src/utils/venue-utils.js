import placeholderImage from "../assets/images/venue-01.webp";

/**
 * Gets readable location text from API location data.
 * Falls back to a default message if city and country are missing.
 * @param {object} location - Venue location data from the API.
 * @param {string} [location.city] - Venue city.
 * @param {string} [location.country] - Venue country.
 * @returns {string} Readable location text.
 */
export function getVenueLocationText(location) {
  const city = location?.city;
  const country = location?.country;

  if (city && country) {
    return `${city}, ${country}`;
  }

  if (city) {
    return city;
  }

  if (country) {
    return country;
  }

  return "Location not added";
}

/**
 * Gets available amenity names from venue meta data.
 * The returned names match the amenity icon keys used by VenueCard.
 * @param {object} meta - Venue meta data from the API.
 * @param {boolean} [meta.wifi] - Whether the venue has wifi.
 * @param {boolean} [meta.parking] - Whether the venue has parking.
 * @param {boolean} [meta.pets] - Whether the venue allows pets.
 * @param {boolean} [meta.breakfast] - Whether the venue offers breakfast.
 * @returns {string[]} List of available amenity names.
 */
export function getVenueAmenities(meta) {
  const amenities = [];

  if (meta?.wifi) {
    amenities.push("wifi");
  }

  if (meta?.parking) {
    amenities.push("parking");
  }

  if (meta?.pets) {
    amenities.push("pets");
  }

  if (meta?.breakfast) {
    amenities.push("breakfast");
  }

  return amenities;
}

/**
 * Normalizes text before search comparison.
 * Makes search case-insensitive and removes extra spaces.
 * @param {string|number|null|undefined} value - Text value to normalize.
 * @returns {string} Normalized search text.
 */
export function normalizeSearchText(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

/**
 * Creates one searchable string from venue data.
 * Includes visible card data and extra API fields that are useful for search.
 * @param {object} venue - Formatted venue card data.
 * @returns {string} Searchable venue text.
 */
export function getVenueSearchText(venue) {
  return normalizeSearchText(
    [
      venue.title,
      venue.description,
      venue.location,
      venue.address,
      venue.city,
      venue.zip,
      venue.country,
      venue.continent,
      venue.ownerName,
      ...venue.amenities,
    ].join(" ")
  );
}

/**
 * Converts one API venue object into the format used by VenueCard and venue filtering.
 * Adds display values and numeric values so sorting and rendering can use the same data.
 * @param {object} venue - Venue object from the API.
 * @param {string} venue.id - Venue ID.
 * @param {string} venue.name - Venue name.
 * @param {string} [venue.description] - Venue description.
 * @param {number|string} venue.price - Venue price per night.
 * @param {number|string} venue.maxGuests - Maximum number of guests.
 * @param {number|string} [venue.rating] - Venue rating.
 * @param {Array} [venue.media] - Venue media array.
 * @param {object} [venue.location] - Venue location object.
 * @param {object} [venue.meta] - Venue meta object.
 * @param {object} [venue.owner] - Venue owner object.
 * @param {string} [venue.created] - Venue created date.
 * @returns {object} Formatted venue card data.
 */
export function formatVenueCardData(venue) {
  const rating = Number(venue.rating) || 0;
  const price = Number(venue.price) || 0;
  const location = venue.location || {};
  const amenities = getVenueAmenities(venue.meta);

  return {
    id: venue.id,
    title: venue.name,
    description: venue.description || "",
    location: getVenueLocationText(location),
    address: location.address || "",
    city: location.city || "",
    zip: location.zip || "",
    country: location.country || "",
    continent: location.continent || "",
    ownerName: venue.owner?.name || "",
    price: `${price} EUR / night`,
    priceValue: price,
    guests: `${venue.maxGuests} guests`,
    maxGuests: Number(venue.maxGuests) || 0,
    rating: rating.toString().replace(".", ","),
    ratingValue: rating,
    image: venue.media?.[0]?.url || placeholderImage,
    amenities,
    created: venue.created || "",
  };
}

/**
 * Checks if a formatted venue matches the current text search.
 * Matches against title, description, location fields, owner name, and amenities.
 * @param {object} venue - Formatted venue card data.
 * @param {string} searchText - Search text from input or URL params.
 * @returns {boolean} True if the venue matches the search text.
 */
export function venueMatchesSearch(venue, searchText) {
  const normalizedSearch = normalizeSearchText(searchText);

  if (!normalizedSearch) {
    return true;
  }

  return getVenueSearchText(venue).includes(normalizedSearch);
}

/**
 * Checks if a formatted venue can fit the selected number of guests.
 * Empty or invalid guest values are treated as no guest filter.
 * @param {object} venue - Formatted venue card data.
 * @param {number} venue.maxGuests - Maximum number of guests the venue allows.
 * @param {string|number} guestCount - Guest count from form input or URL params.
 * @returns {boolean} True if the venue can fit the selected guests.
 */
export function venueMatchesGuests(venue, guestCount) {
  const guests = Number(guestCount);

  if (!guestCount || Number.isNaN(guests) || guests < 1) {
    return true;
  }

  return venue.maxGuests >= guests;
}

/**
 * Filters formatted venues by search text and guest count.
 * Used by the home page preview and venues listing page.
 * @param {Array<object>} venues - Formatted venue card data.
 * @param {object} filters - Filter values.
 * @param {string} [filters.search] - Search text.
 * @param {string|number} [filters.guests] - Guest count.
 * @returns {Array<object>} Filtered venues.
 */
export function filterVenues(venues, filters) {
  return venues.filter(
    (venue) =>
      venueMatchesSearch(venue, filters.search || "") &&
      venueMatchesGuests(venue, filters.guests || "")
  );
}

/**
 * Sorts formatted venues by the selected sort value.
 * Supports created date, price, and rating sorting.
 * @param {Array<object>} venues - Formatted venue card data.
 * @param {string} sortValue - Selected sort option.
 * @returns {Array<object>} Sorted venues.
 */
export function sortVenues(venues, sortValue) {
  const venuesToSort = [...venues];

  if (sortValue === "price-asc") {
    return venuesToSort.sort((a, b) => a.priceValue - b.priceValue);
  }

  if (sortValue === "price-desc") {
    return venuesToSort.sort((a, b) => b.priceValue - a.priceValue);
  }

  if (sortValue === "rating-desc") {
    return venuesToSort.sort((a, b) => b.ratingValue - a.ratingValue);
  }

  return venuesToSort.sort((a, b) => new Date(b.created) - new Date(a.created));
}
