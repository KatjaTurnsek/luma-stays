import { useMemo, useState } from "react";
import {
  getBookedDateKeys,
  getDateKey,
  getMonthDays,
  rangeHasBookedDate,
} from "../utils/date-utils";

const WEEK_DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

/**
 * Checks if a date is before today.
 * @param {Date} date - Date to check.
 * @returns {boolean} True if the date is in the past.
 */
function isPastDate(date) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const compareDate = new Date(date);
  compareDate.setHours(0, 0, 0, 0);

  return compareDate < today;
}

/**
 * Displays one calendar month.
 * @param {object} props - Component props.
 * @returns {JSX.Element} Calendar month.
 */
function CalendarMonth({
  monthDate,
  bookedDateKeys,
  selectedStartDate,
  selectedEndDate,
  onDateClick,
}) {
  const days = getMonthDays(monthDate);

  const monthLabel = monthDate.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="venue-date-picker__month">
      <h3>{monthLabel}</h3>

      <div className="venue-date-picker__grid">
        {WEEK_DAYS.map((day) => (
          <span key={day} className="venue-date-picker__weekday">
            {day}
          </span>
        ))}

        {days.map((day, index) => {
          if (!day) {
            return (
              <span
                key={`empty-${index}`}
                className="venue-date-picker__empty"
              ></span>
            );
          }

          const dateKey = getDateKey(day);
          const isBooked = bookedDateKeys.has(dateKey);
          const isPast = isPastDate(day);
          const isDisabled = isBooked || isPast;
          const isStart =
            selectedStartDate && getDateKey(selectedStartDate) === dateKey;
          const isEnd =
            selectedEndDate && getDateKey(selectedEndDate) === dateKey;
          const isSelected = isStart || isEnd;

          return (
            <button
              key={dateKey}
              type="button"
              className={`venue-date-picker__day ${
                isBooked ? "venue-date-picker__day--booked" : ""
              } ${isPast ? "venue-date-picker__day--past" : ""} ${
                isSelected ? "venue-date-picker__day--selected" : ""
              }`}
              disabled={isDisabled}
              onClick={() => onDateClick(day)}
              aria-label={`${day.toLocaleDateString("en-GB")} ${
                isDisabled ? "unavailable" : "available"
              }`}
            >
              {day.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Displays a two-month date picker for venue availability.
 * @param {object} props - Component props.
 * @returns {JSX.Element} Venue date picker.
 */
export default function VenueDatePicker({
  bookings,
  price,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
  nights,
  onApply,
  onInvalidDateSelection,
}) {
  const [visibleMonth, setVisibleMonth] = useState(new Date());

  const bookedDateKeys = useMemo(() => getBookedDateKeys(bookings), [bookings]);

  const nextMonth = new Date(
    visibleMonth.getFullYear(),
    visibleMonth.getMonth() + 1,
    1
  );

  function goToPreviousMonth() {
    setVisibleMonth(
      new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1)
    );
  }

  function goToNextMonth() {
    setVisibleMonth(
      new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1)
    );
  }

  function handleDateClick(date) {
    onInvalidDateSelection("");

    if (!startDate || endDate || date < startDate) {
      setStartDate(date);
      setEndDate(null);
      return;
    }

    if (rangeHasBookedDate(startDate, date, bookedDateKeys)) {
      setStartDate(date);
      setEndDate(null);
      onInvalidDateSelection(
        "Those dates include an already booked date. Choose a new date range."
      );
      return;
    }

    setEndDate(date);
  }

  function clearDates() {
    setStartDate(null);
    setEndDate(null);
    onInvalidDateSelection("");
  }

  const canApply = startDate && endDate && nights > 0;

  return (
    <div className="venue-date-picker">
      <div className="venue-date-picker__months">
        <button
          type="button"
          className="venue-date-picker__nav venue-date-picker__nav--previous"
          onClick={goToPreviousMonth}
          aria-label="Previous month"
        >
          ‹
        </button>

        <CalendarMonth
          monthDate={visibleMonth}
          bookedDateKeys={bookedDateKeys}
          selectedStartDate={startDate}
          selectedEndDate={endDate}
          onDateClick={handleDateClick}
        />

        <CalendarMonth
          monthDate={nextMonth}
          bookedDateKeys={bookedDateKeys}
          selectedStartDate={startDate}
          selectedEndDate={endDate}
          onDateClick={handleDateClick}
        />

        <button
          type="button"
          className="venue-date-picker__nav venue-date-picker__nav--next"
          onClick={goToNextMonth}
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      <div className="venue-date-picker__summary">
        <p>
          {nights > 0
            ? `${nights} night(s) x ${price} EUR = ${nights * price} EUR`
            : "Select your check-in and check-out dates"}
        </p>

        <div className="venue-date-picker__actions">
          <button type="button" onClick={clearDates}>
            Clear
          </button>

          <button
            type="button"
            className="venue-date-picker__apply-button"
            onClick={onApply}
            disabled={!canApply}
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
