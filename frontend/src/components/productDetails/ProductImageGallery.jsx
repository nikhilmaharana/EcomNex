import { useState } from "react";
import { getProductImage } from "../../lib/api";

const ProductImageGallery = ({ images }) => {
  const fallbackImage = getProductImage({});
  const galleryImages = images?.length > 0 ? images : [fallbackImage];
  const [selected, setSelected] = useState(galleryImages[0]);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(124,58,237,0.2)]">
        <img
          src={selected}
          alt="product"
          className="w-full h-87.5 object-contain rounded-xl transition duration-300 hover:scale-105"
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3">
        {galleryImages.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Product gallery image ${index + 1}`}
            onClick={() => setSelected(img)}
            className={`w-16 h-16 object-cover rounded-lg cursor-pointer border transition ${
              selected === img
                ? "border-purple-500 scale-105"
                : "border-gray-700"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
