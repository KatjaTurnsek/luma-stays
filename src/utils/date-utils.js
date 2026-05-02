/**
 * Formats a date as YYYY-MM-DD.
 * @param {Date} date - Date object.
 * @returns {string} Date key.
 */
export function getDateKey(date) {
  return date.toISOString().split("T")[0];
}

/**
 * Gets booked date keys from API bookings.
 * @param {Array} bookings - Venue bookings.
 * @returns {Set<string>} Booked date keys.
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
 * Gets the number of nights between two dates.
 * @param {Date | null} startDate - Start date.
 * @param {Date | null} endDate - End date.
 * @returns {number} Number of nights.
 */
export function getNightCount(startDate, endDate) {
  if (!startDate || !endDate) {
    return 0;
  }

  const oneDay = 1000 * 60 * 60 * 24;
  return Math.round((endDate - startDate) / oneDay);
}

/**
 * Checks if a selected date range includes a booked date.
 * @param {Date} startDate - Start date.
 * @param {Date} endDate - End date.
 * @param {Set<string>} bookedDateKeys - Booked date keys.
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
 * Gets days for one visible month.
 * @param {Date} visibleMonth - Month to show.
 * @returns {Array<Date | null>} Calendar days.
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
