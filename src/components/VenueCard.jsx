import { Link } from "react-router-dom";

import locationIcon from "../assets/icons/location.svg";
import starIcon from "../assets/icons/star.svg";
import wifiIcon from "../assets/icons/wifi.svg";
import parkingIcon from "../assets/icons/parking.svg";
import petsIcon from "../assets/icons/pets.svg";
import breakfastIcon from "../assets/icons/breakfast.svg";

import "../styles/venue-card.css";

const amenityIcons = {
  wifi: wifiIcon,
  parking: parkingIcon,
  pets: petsIcon,
  breakfast: breakfastIcon,
};

export default function VenueCard({ venue }) {
  return (
    <article className="venue-card">
      <div className="venue-card__image-wrap">
        <img
          src={venue.image}
          alt={venue.title}
          width="600"
          height="400"
          loading="lazy"
        />

        <div className="venue-card__location">
          <img
            src={locationIcon}
            alt=""
            aria-hidden="true"
            width="24"
            height="24"
          />
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
          <img
            src={starIcon}
            alt=""
            aria-hidden="true"
            width="24"
            height="24"
          />
          <span>{venue.rating}</span>
        </div>
      </div>

      <div className="venue-card__footer">
        <div className="venue-card__amenities">
          {venue.amenities?.map((amenity) => {
            const icon = amenityIcons[amenity];

            if (!icon) {
              return null;
            }

            return (
              <img
                src={icon}
                alt=""
                aria-hidden="true"
                width="24"
                height="24"
                key={amenity}
              />
            );
          })}
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
