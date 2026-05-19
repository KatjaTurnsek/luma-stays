import placeholderImage from "../assets/images/venue-01.webp";

/**
 * Gets readable location text from API location data.
 * @param {object} location - Venue location data.
 * @returns {string} Location text.
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
 * Gets venue amenity names from API meta data.
 * @param {object} meta - Venue meta data.
 * @returns {string[]} Amenity names.
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
 * Converts API venue data into the format used by VenueCard.
 * @param {object} venue - Venue from API.
 * @returns {object} Formatted venue card data.
 */
export function formatVenueCardData(venue) {
  return {
    id: venue.id,
    title: venue.name,
    location: getVenueLocationText(venue.location),
    price: `${venue.price} EUR / night`,
    guests: `${venue.maxGuests} guests`,
    maxGuests: venue.maxGuests || 0,
    rating: venue.rating ? venue.rating.toString().replace(".", ",") : "0",
    image: venue.media?.[0]?.url || placeholderImage,
    amenities: getVenueAmenities(venue.meta),
  };
}

/**
 * Checks if a venue matches text search.
 * @param {object} venue - Formatted venue card data.
 * @param {string} searchText - Search text.
 * @returns {boolean} True if venue matches.
 */
export function venueMatchesSearch(venue, searchText) {
  const normalizedSearch = searchText.trim().toLowerCase();

  if (!normalizedSearch) {
    return true;
  }

  return (
    venue.title.toLowerCase().includes(normalizedSearch) ||
    venue.location.toLowerCase().includes(normalizedSearch)
  );
}

/**
 * Checks if a venue can fit the selected number of guests.
 * @param {object} venue - Formatted venue card data.
 * @param {string | number} guestCount - Guest count from form or URL.
 * @returns {boolean} True if venue can fit the guests.
 */
export function venueMatchesGuests(venue, guestCount) {
  const guests = Number(guestCount);

  if (!guestCount || Number.isNaN(guests) || guests < 1) {
    return true;
  }

  return venue.maxGuests >= guests;
}

/**
 * Filters venues by search text and guests.
 * @param {Array} venues - Formatted venues.
 * @param {object} filters - Filter values.
 * @param {string} filters.search - Search text.
 * @param {string | number} filters.guests - Guest count.
 * @returns {Array} Filtered venues.
 */
export function filterVenues(venues, filters) {
  return venues.filter(
    (venue) =>
      venueMatchesSearch(venue, filters.search || "") &&
      venueMatchesGuests(venue, filters.guests || "")
  );
}
