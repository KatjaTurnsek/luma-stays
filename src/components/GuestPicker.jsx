/**
 * Displays guest selector controls.
 * @param {object} props - Component props.
 * @param {number} props.guests - Selected guest count.
 * @param {number} props.maxGuests - Maximum guest count.
 * @param {Function} props.setGuests - Updates guest count.
 * @param {Function} props.onApply - Closes the guest picker.
 * @returns {JSX.Element} Guest picker.
 */
export default function GuestPicker({ guests, maxGuests, setGuests, onApply }) {
  function decreaseGuests() {
    setGuests((currentGuests) => Math.max(1, currentGuests - 1));
  }

  function increaseGuests() {
    setGuests((currentGuests) => Math.min(maxGuests, currentGuests + 1));
  }

  function clearGuests() {
    setGuests(1);
  }

  return (
    <div className="venue-booking-card__guest-panel">
      <div className="venue-booking-card__guest-row">
        <p>How many guests?</p>

        <div className="venue-booking-card__guest-controls">
          <button
            type="button"
            onClick={decreaseGuests}
            aria-label="Decrease guests"
          >
            -
          </button>

          <span>{guests}</span>

          <button
            type="button"
            onClick={increaseGuests}
            aria-label="Increase guests"
          >
            +
          </button>
        </div>
      </div>

      <div className="venue-booking-card__guest-actions">
        <button
          type="button"
          className="venue-booking-card__small-button"
          onClick={clearGuests}
        >
          Clear
        </button>

        <button
          type="button"
          className="venue-booking-card__apply-button"
          onClick={onApply}
        >
          Apply
        </button>
      </div>
    </div>
  );
}
