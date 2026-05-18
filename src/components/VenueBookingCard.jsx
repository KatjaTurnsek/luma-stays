import { useState } from "react";

import BookingConfirmation from "./BookingConfirmation";
import GuestPicker from "./GuestPicker";
import UiAlert from "./UiAlert";
import VenueDatePicker from "./VenueDatePicker";

import { createBooking } from "../api/bookings-api";
import { getAuth } from "../utils/auth-storage";
import {
  getBookedDateKeys,
  getNightCount,
  rangeHasBookedDate,
} from "../utils/date-utils";

import calendarIcon from "../assets/icons/calendar.svg";
import usersIcon from "../assets/icons/users.svg";

import "../styles/venue-booking-card.css";

/**
 * Displays booking card on the venue details page.
 * @param {object} props - Component props.
 * @param {object} props.venue - Venue data.
 * @param {Function} props.onBookingCreated - Updates venue bookings after success.
 * @returns {JSX.Element} Venue booking card.
 */
export default function VenueBookingCard({ venue, onBookingCreated }) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [guests, setGuests] = useState(1);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [isGuestPickerOpen, setIsGuestPickerOpen] = useState(false);
  const [isRoleNoticeVisible, setIsRoleNoticeVisible] = useState(true);
  const [bookingMessage, setBookingMessage] = useState({
    text: "",
    type: "error",
  });
  const [confirmedBooking, setConfirmedBooking] = useState(null);
  const [confirmedTotalPrice, setConfirmedTotalPrice] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const auth = getAuth();
  const isLoggedIn = Boolean(auth?.accessToken);
  const isVenueManager = Boolean(auth?.venueManager);
  const isCustomer = isLoggedIn && !isVenueManager;

  const price = venue?.price || 0;
  const maxGuests = venue?.maxGuests || 1;
  const bookings = venue?.bookings || [];
  const nights = getNightCount(startDate, endDate);
  const totalPrice = nights * price;

  /**
   * Shows booking feedback with the correct UI message type.
   * @param {string} text - Message text.
   * @param {"success" | "error" | "warning" | "info"} type - Message type.
   */
  function showBookingMessage(text, type = "error") {
    setBookingMessage({ text, type });
  }

  /**
   * Clears booking feedback.
   */
  function clearBookingMessage() {
    setBookingMessage({
      text: "",
      type: "error",
    });
  }

  function toggleDatePicker() {
    setIsDatePickerOpen((isOpen) => !isOpen);
    setIsGuestPickerOpen(false);
    clearBookingMessage();
  }

  function toggleGuestPicker() {
    setIsGuestPickerOpen((isOpen) => !isOpen);
    setIsDatePickerOpen(false);
    clearBookingMessage();
  }

  function closeDatePicker() {
    setIsDatePickerOpen(false);
  }

  function closeGuestPicker() {
    setIsGuestPickerOpen(false);
  }

  function handleInvalidDateSelection(message) {
    if (!message) {
      clearBookingMessage();
      return;
    }

    showBookingMessage(message, "warning");
  }

  function closeConfirmation() {
    setConfirmedBooking(null);
    setConfirmedTotalPrice(0);
  }

  /**
   * Validates booking state before API submit.
   * @returns {object} Message text and type.
   */
  function getBookingValidationMessage() {
    const bookedDateKeys = getBookedDateKeys(bookings);

    if (!isLoggedIn) {
      return {
        text: "Log in as a customer to book this venue.",
        type: "info",
      };
    }

    if (isVenueManager) {
      return {
        text: "Venue managers cannot book from a manager account.",
        type: "info",
      };
    }

    if (!startDate || !endDate || nights <= 0) {
      return {
        text: "Choose valid check-in and check-out dates before booking.",
        type: "warning",
      };
    }

    if (rangeHasBookedDate(startDate, endDate, bookedDateKeys)) {
      return {
        text: "These dates include already booked dates. Choose another range.",
        type: "warning",
      };
    }

    if (guests < 1 || guests > maxGuests) {
      return {
        text: `Choose between 1 and ${maxGuests} guests.`,
        type: "warning",
      };
    }

    return {
      text: "",
      type: "error",
    };
  }

  /**
   * Creates a booking through the API.
   */
  async function handleBookNow() {
    const validationMessage = getBookingValidationMessage();

    if (validationMessage.text) {
      showBookingMessage(validationMessage.text, validationMessage.type);
      return;
    }

    clearBookingMessage();
    setIsSubmitting(true);

    try {
      const response = await createBooking({
        dateFrom: startDate.toISOString(),
        dateTo: endDate.toISOString(),
        guests,
        venueId: venue.id,
      });

      const booking = response?.data;

      if (!booking) {
        showBookingMessage(
          "Booking was created, but the response was missing.",
          "warning"
        );
        return;
      }

      setConfirmedBooking(booking);
      setConfirmedTotalPrice(totalPrice);
      onBookingCreated?.(booking);

      setStartDate(null);
      setEndDate(null);
      setGuests(1);
      setIsDatePickerOpen(false);
      setIsGuestPickerOpen(false);
    } catch (error) {
      showBookingMessage(error.message || "Could not create booking.", "error");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (confirmedBooking) {
    return (
      <BookingConfirmation
        booking={confirmedBooking}
        venue={venue}
        totalPrice={confirmedTotalPrice}
        onClose={closeConfirmation}
      />
    );
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
        {isRoleNoticeVisible && isVenueManager && (
          <UiAlert
            message="Venue managers can view customer bookings from the profile page."
            type="info"
            onClose={() => setIsRoleNoticeVisible(false)}
          />
        )}

        {isRoleNoticeVisible && !isLoggedIn && (
          <UiAlert
            message="Log in as a customer to book this venue."
            type="info"
            onClose={() => setIsRoleNoticeVisible(false)}
          />
        )}

        {bookingMessage.text && (
          <UiAlert
            message={bookingMessage.text}
            type={bookingMessage.type}
            onClose={clearBookingMessage}
          />
        )}

        {isCustomer && (
          <>
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
                    onInvalidDateSelection={handleInvalidDateSelection}
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
              disabled={!startDate || !endDate || nights <= 0 || isSubmitting}
              onClick={handleBookNow}
            >
              {isSubmitting ? "Booking..." : "Book now"}
            </button>
          </>
        )}
      </div>
    </aside>
  );
}
