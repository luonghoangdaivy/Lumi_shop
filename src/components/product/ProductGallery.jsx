import { Heart } from "lucide-react";

function ProductGallery() {
  const images = [
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
    "https://images.unsplash.com/photo-1503341504253-dff4815485f1",
    "https://images.unsplash.com/photo-1529139574466-a303027c1d8b",
    "https://images.unsplash.com/photo-1485968579580-b6d095142e6e",
  ];

  return (
    <div className="product-gallery">
      <div className="product-thumbnails">
        {images.map((image, index) => (
          <button key={index} className="thumbnail">
            <img
              src={`${image}?auto=format&fit=crop&w=150&q=80`}
              alt={`Product ${index + 1}`}
            />
          </button>
        ))}
      </div>

      <div className="product-main-image">
        <img
          src={`${images[0]}?auto=format&fit=crop&w=900&q=85`}
          alt="Áo thun basic"
        />

        <button className="product-wishlist">
          <Heart size={20} />
        </button>

        <span className="product-sale">-20%</span>
      </div>
    </div>
  );
}

export default ProductGallery;
