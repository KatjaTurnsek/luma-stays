import { Link } from "react-router-dom";

import locationIcon from "../assets/icons/location.svg";
import starIcon from "../assets/icons/star.svg";
import parkingIcon from "../assets/icons/parking.svg";
import petsIcon from "../assets/icons/pets.svg";
import breakfastIcon from "../assets/icons/breakfast.svg";

import "../styles/venue-card.css";

const amenityIcons = {
  parking: parkingIcon,
  pets: petsIcon,
  breakfast: breakfastIcon,
};

export default function VenueCard({ venue }) {
  return (
    <article className="venue-card">
      <div className="venue-card__image-wrap">
        <img src={venue.image} alt={venue.title} />

        <div className="venue-card__location">
          <img src={locationIcon} alt="" aria-hidden="true" />
          <span>{venue.location}</span>
        </div>
      </div>

      <div className="venue-card__content">
        <div>
          <h3>{venue.title}</h3>
          <p>
            {venue.price} • {venue.guests}
          </p>
        </div>

        <div className="venue-card__rating">
          <img src={starIcon} alt="" aria-hidden="true" />
          <span>{venue.rating}</span>
        </div>
      </div>

      <div className="venue-card__footer">
        <div className="venue-card__amenities">
          {venue.amenities?.map((amenity) => (
            <img
              src={amenityIcons[amenity]}
              alt=""
              aria-hidden="true"
              key={amenity}
            />
          ))}
        </div>

        <Link
          to={`/venues/${venue.id}`}
          className="ui-btn-primary venue-card__button"
        >
          View details
        </Link>
      </div>
    </article>
  );
}
