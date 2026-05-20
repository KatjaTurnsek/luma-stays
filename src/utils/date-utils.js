/**
 * Formats a Date object as a YYYY-MM-DD key.
 * Used for comparing calendar dates without time values.
 * @param {Date} date - Date object.
 * @returns {string} Date key in YYYY-MM-DD format.
 */
export function getDateKey(date) {
  return date.toISOString().split("T")[0];
}

/**
 * Gets all booked date keys from venue booking data.
 * Each booking is expanded into individual date keys between dateFrom and dateTo.
 * @param {Array<object>} [bookings=[]] - Venue bookings from the API.
 * @returns {Set<string>} Set of booked date keys.
 */
export function getBookedDateKeys(bookings = []) {
  const bookedDates = new Set();

  bookings.forEach((booking) => {
    const startDate = new Date(booking.dateFrom);
    const endDate = new Date(booking.dateTo);
    const currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      bookedDates.add(getDateKey(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
  });

  return bookedDates;
}

/**
 * Gets the number of nights between two selected dates.
 * Returns 0 when either date is missing.
 * @param {Date|null} startDate - Selected start date.
 * @param {Date|null} endDate - Selected end date.
 * @returns {number} Number of nights between the dates.
 */
export function getNightCount(startDate, endDate) {
  if (!startDate || !endDate) {
    return 0;
  }

  const oneDay = 1000 * 60 * 60 * 24;
  return Math.round((endDate - startDate) / oneDay);
}

/**
 * Checks if a selected date range contains any booked date.
 * Used to prevent customers from booking unavailable dates.
 * @param {Date} startDate - Selected start date.
 * @param {Date} endDate - Selected end date.
 * @param {Set<string>} bookedDateKeys - Set of booked date keys.
 * @returns {boolean} True if the range includes a booked date.
 */
export function rangeHasBookedDate(startDate, endDate, bookedDateKeys) {
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    if (bookedDateKeys.has(getDateKey(currentDate))) {
      return true;
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return false;
}

/**
 * Gets calendar grid days for one visible month.
 * Empty slots before the first day of the month are returned as null values.
 * @param {Date} visibleMonth - Month shown in the date picker.
 * @returns {Array<Date|null>} Calendar grid values for the month.
 */
export function getMonthDays(visibleMonth) {
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startOffset = firstDay.getDay();
  const days = [];

  for (let i = 0; i < startOffset; i++) {
    days.push(null);
  }

  for (let day = 1; day <= lastDay.getDate(); day++) {
    days.push(new Date(year, month, day));
  }

  return days;
}
