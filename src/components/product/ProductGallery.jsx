import { useState } from "react";

const API_URL = "http://localhost:4000";

function ProductGallery({ images = [], productName }) {
  const primaryImage = images.find((image) => image.is_primary) || images[0];

  const [selectedImage, setSelectedImage] = useState(
    primaryImage?.image_url || "",
  );

  if (!images.length) {
    return (
      <div className="product-gallery">
        <p>Chưa có hình ảnh sản phẩm</p>
      </div>
    );
  }

  return (
    <div className="product-gallery">
      {/* Thumbnail */}
      <div className="product-gallery-thumbnails">
        {images.map((image) => (
          <button
            key={image.id}
            type="button"
            onClick={() => setSelectedImage(image.image_url)}
            className={selectedImage === image.image_url ? "active" : ""}
          >
            <img src={`${API_URL}${image.image_url}`} alt={productName} />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="product-gallery-main">
        <img src={`${API_URL}${selectedImage}`} alt={productName} />
      </div>
    </div>
  );
}

export default ProductGallery;
