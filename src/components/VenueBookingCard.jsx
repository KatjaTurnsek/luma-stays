import { useState } from "react";
import VenueDatePicker from "./VenueDatePicker";
import GuestPicker from "./GuestPicker";
import { getNightCount } from "../utils/date-utils";
import calendarIcon from "../assets/icons/calendar.svg";
import usersIcon from "../assets/icons/users.svg";
import "../styles/venue-booking-card.css";

/**
 * Displays booking card on the venue details page.
 * @param {object} props - Component props.
 * @param {object} props.venue - Venue data.
 * @returns {JSX.Element} Venue booking card.
 */
export default function VenueBookingCard({ venue }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [guests, setGuests] = useState(1);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isGuestPickerOpen, setIsGuestPickerOpen] = useState(false);

  const price = venue?.price || 0;
  const maxGuests = venue?.maxGuests || 1;
  const bookings = venue?.bookings || [];
  const nights = getNightCount(startDate, endDate);

  function toggleDatePicker() {
    setIsDatePickerOpen((isOpen) => !isOpen);
    setIsGuestPickerOpen(false);
  }

  function toggleGuestPicker() {
    setIsGuestPickerOpen((isOpen) => !isOpen);
    setIsDatePickerOpen(false);
  }

  function closeDatePicker() {
    setIsDatePickerOpen(false);
  }

  function closeGuestPicker() {
    setIsGuestPickerOpen(false);
  }

  function handleBookNow() {
    // Connect to create booking API in the later booking task.
  }

  return (
    <aside
      className="venue-booking-card"
      aria-labelledby="venue-booking-card-title"
    >
      <div className="venue-booking-card__top">
        <h2 id="venue-booking-card-title">{price} EUR / night</h2>
        <p>Check availability:</p>
      </div>

      <div className="venue-booking-card__content">
        <div className="venue-booking-card__dropdown">
          <button
            type="button"
            className="venue-booking-card__input"
            onClick={toggleDatePicker}
            aria-expanded={isDatePickerOpen}
            aria-controls="venue-date-picker"
          >
            <span>
              {startDate && endDate
                ? `${startDate.toLocaleDateString(
                    "en-GB"
                  )} - ${endDate.toLocaleDateString("en-GB")}`
                : "Select dates"}
            </span>

            <span className="venue-booking-card__input-icon">
              <img src={calendarIcon} alt="" aria-hidden="true" />
            </span>
          </button>

          {isDatePickerOpen && (
            <div
              id="venue-date-picker"
              className="venue-booking-card__dropdown-panel venue-booking-card__dropdown-panel--calendar"
            >
              <VenueDatePicker
                bookings={bookings}
                price={price}
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                nights={nights}
                onApply={closeDatePicker}
              />
            </div>
          )}
        </div>

        <div className="venue-booking-card__dropdown">
          <button
            type="button"
            className="venue-booking-card__input"
            onClick={toggleGuestPicker}
            aria-expanded={isGuestPickerOpen}
            aria-controls="venue-guest-picker"
          >
            <span>{guests > 1 ? `${guests} guests` : "Select guests"}</span>

            <span className="venue-booking-card__input-icon">
              <img src={usersIcon} alt="" aria-hidden="true" />
            </span>
          </button>

          {isGuestPickerOpen && (
            <div
              id="venue-guest-picker"
              className="venue-booking-card__dropdown-panel venue-booking-card__dropdown-panel--guests"
            >
              <GuestPicker
                guests={guests}
                maxGuests={maxGuests}
                setGuests={setGuests}
                onApply={closeGuestPicker}
              />
            </div>
          )}
        </div>

        <button
          type="button"
          className="venue-booking-card__book-button"
          disabled={!startDate || !endDate || nights <= 0}
          onClick={handleBookNow}
        >
          Book now
        </button>
      </div>
    </aside>
  );
}
