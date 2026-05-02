import { useState } from "react";

import placeholderImage from "../assets/images/venue-01.webp";
import chevronLeftIcon from "../assets/icons/chevron-left.svg";
import chevronRightIcon from "../assets/icons/chevron-right.svg";

import "../styles/venue-gallery.css";

/**
 * Gets image URL from a venue media item.
 * @param {object} mediaItem - API media item
 * @returns {string} Image URL
 */
function getMediaUrl(mediaItem) {
  return mediaItem?.url || placeholderImage;
}

export default function VenueGallery({ images = [], title }) {
  const galleryImages = images.length ? images : [{ url: placeholderImage }];
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const activeImage = galleryImages[activeImageIndex] || galleryImages[0];

  function showPreviousImage() {
    setActiveImageIndex((currentIndex) =>
      currentIndex === 0 ? galleryImages.length - 1 : currentIndex - 1
    );
  }

  function showNextImage() {
    setActiveImageIndex((currentIndex) =>
      currentIndex === galleryImages.length - 1 ? 0 : currentIndex + 1
    );
  }

  return (
    <>
      <section className="venue-gallery">
        <button
          type="button"
          className="venue-gallery__button venue-gallery__button--left"
          onClick={showPreviousImage}
          aria-label="Show previous image"
        >
          <img src={chevronLeftIcon} alt="" aria-hidden="true" />
        </button>

        <img
          src={getMediaUrl(activeImage)}
          alt={activeImage?.alt || title}
          className="venue-gallery__main-image"
        />

        <button
          type="button"
          className="venue-gallery__button venue-gallery__button--right"
          onClick={showNextImage}
          aria-label="Show next image"
        >
          <img src={chevronRightIcon} alt="" aria-hidden="true" />
        </button>
      </section>

      <div className="venue-gallery__thumbnails">
        {galleryImages.slice(0, 4).map((image, index) => (
          <button
            type="button"
            className={
              index === activeImageIndex
                ? "venue-gallery__thumbnail venue-gallery__thumbnail--active"
                : "venue-gallery__thumbnail"
            }
            onClick={() => setActiveImageIndex(index)}
            key={`${image.url}-${index}`}
            aria-label={`Show image ${index + 1}`}
          >
            <img src={getMediaUrl(image)} alt="" aria-hidden="true" />
          </button>
        ))}
      </div>
    </>
  );
}
