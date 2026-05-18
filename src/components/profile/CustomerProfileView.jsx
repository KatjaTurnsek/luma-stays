import { useEffect, useState } from "react";

import { deleteBooking } from "../../api/bookings-api";
import { getProfileBookings } from "../../api/profiles-api";
import { getAuth } from "../../utils/auth-storage";
import { getUpcomingCustomerBookings } from "../../utils/profile-utils";

import BookingCard from "./BookingCard";
import EmptyState from "./EmptyState";
import Loader from "../Loader";
import UiAlert from "../UiAlert";

/**
 * Displays customer-specific profile content.
 * @returns {JSX.Element} Customer view.
 */
export default function CustomerProfileView() {
  const [bookings, setBookings] = useState([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(true);
  const [bookingsError, setBookingsError] = useState("");
  const [bookingMessage, setBookingMessage] = useState({
    text: "",
    type: "success",
  });
  const [cancellingBookingId, setCancellingBookingId] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadCustomerBookings() {
      const auth = getAuth();

      if (!auth?.name) {
        setBookingsError("Could not load your profile information.");
        setIsLoadingBookings(false);
        return;
      }

      try {
        const response = await getProfileBookings(auth.name);

        if (isMounted) {
          setBookings(response?.data || []);
        }
      } catch (error) {
        if (isMounted) {
          setBookingsError(error.message || "Could not load your bookings.");
        }
      } finally {
        if (isMounted) {
          setIsLoadingBookings(false);
        }
      }
    }

    loadCustomerBookings();

    return () => {
      isMounted = false;
    };
  }, []);

  /**
   * Clears booking feedback.
   */
  function clearBookingMessage() {
    setBookingMessage({
      text: "",
      type: "success",
    });
  }

  /**
   * Cancels a customer booking and removes it from the UI.
   * @param {string} bookingId - Booking ID.
   */
  async function handleCancelBooking(bookingId) {
    setCancellingBookingId(bookingId);
    clearBookingMessage();
    setBookingsError("");

    try {
      await deleteBooking(bookingId);

      setBookings((currentBookings) =>
        currentBookings.filter((booking) => booking.id !== bookingId)
      );

      setBookingMessage({
        text: "Booking cancelled successfully.",
        type: "success",
      });
    } catch (error) {
      setBookingMessage({
        text: error.message || "Could not cancel booking.",
        type: "error",
      });
    } finally {
      setCancellingBookingId("");
    }
  }

  const upcomingBookings = getUpcomingCustomerBookings(bookings);

  return (
    <section className="profile-page__section profile-page__role-section">
      <h2>My bookings</h2>

      <div className="profile-page__section-line"></div>

      <h3 className="profile-page__subheading">Upcoming bookings</h3>

      {bookingMessage.text && (
        <UiAlert
          message={bookingMessage.text}
          type={bookingMessage.type}
          onClose={clearBookingMessage}
        />
      )}

      {isLoadingBookings && <Loader text="Loading your bookings..." />}

      {!isLoadingBookings && bookingsError && (
        <UiAlert
          message={bookingsError}
          type="error"
          onClose={() => setBookingsError("")}
        />
      )}

      {!isLoadingBookings && !bookingsError && upcomingBookings.length > 0 && (
        <div className="profile-page__booking-card-list">
          {upcomingBookings.map((booking) => (
            <BookingCard
              booking={booking}
              key={booking.id}
              onCancelBooking={handleCancelBooking}
              isCancelling={cancellingBookingId === booking.id}
            />
          ))}
        </div>
      )}

      {!isLoadingBookings &&
        !bookingsError &&
        upcomingBookings.length === 0 && (
          <EmptyState
            title="No upcoming bookings yet"
            text="When you book a stay, your upcoming bookings will show here."
            linkTo="/venues"
            linkText="Explore stays"
          />
        )}
    </section>
  );
}
