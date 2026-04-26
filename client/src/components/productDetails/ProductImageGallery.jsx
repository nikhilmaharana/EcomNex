import { useState } from "react";

const ProductImageGallery = ({ images, productName }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = images[selectedIndex];

  return (
    <section className="product-gallery" aria-label={`${productName} image gallery`}>
      <figure className="gallery-main">
        {selectedImage?.src ? (
          <img src={selectedImage.src} alt={selectedImage.alt || productName} />
        ) : (
          <div
            className="image-placeholder"
            role="img"
            aria-label={`${productName} image placeholder`}
            style={{ "--placeholder": selectedImage?.color || "#dbeafe" }}
          >
            <span>{selectedImage?.label || "Product Image"}</span>
          </div>
        )}
        {selectedImage?.source && (
          <figcaption className="image-credit">
            Image:{" "}
            <a href={selectedImage.source} target="_blank" rel="noreferrer">
              {selectedImage.credit}
            </a>
          </figcaption>
        )}
      </figure>

      <div className="gallery-rail" aria-label="Product image thumbnails">
        {images.map((img, i) => (
          <button
            key={img.label}
            className={`thumb-card ${selectedIndex === i ? "is-active" : ""}`}
            type="button"
            onClick={() => setSelectedIndex(i)}
            aria-label={`View ${img.label}`}
          >
            {img.src ? (
              <img src={img.src} alt="" />
            ) : (
              <span className="thumb-placeholder" style={{ "--placeholder": img.color || "#dbeafe" }}>
                {img.label}
              </span>
            )}
            <strong>{img.label}</strong>
          </button>
        ))}
      </div>
    </section>
  );
};

export default ProductImageGallery;
