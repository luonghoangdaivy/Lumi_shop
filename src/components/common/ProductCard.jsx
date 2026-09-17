import { Heart } from "lucide-react";
import { Link } from "react-router-dom";

function ProductCard({ product, onAddToWishlist }) {
  const {
    id,
    name,
    image,
    price,
    oldPrice,
    discount,
    colors = [],
    isNew = false,
  } = product;

  const formatPrice = (value) => {
    return new Intl.NumberFormat("vi-VN").format(value) + "đ";
  };

  return (
    <article className="product-card">
      {/* Image */}
      <div className="product-card-image">
        <Link to={`/products/${id}`}>
          <img src={image} alt={name} />
        </Link>

        {/* Badge */}
        {isNew && <span className="product-badge product-badge-new">NEW</span>}

        {discount && (
          <span className="product-badge product-badge-sale">-{discount}%</span>
        )}

        {/* Wishlist */}
        <button
          className="product-wishlist"
          onClick={() => onAddToWishlist?.(product)}
          aria-label="Thêm vào yêu thích"
        >
          <Heart size={17} strokeWidth={1.7} />
        </button>
      </div>

      {/* Information */}
      <div className="product-card-info">
        <Link to={`/products/${id}`} className="product-card-name">
          {name}
        </Link>

        {/* Colors */}
        {colors.length > 0 && (
          <div className="product-colors">
            {colors.map((color, index) => (
              <span
                key={index}
                className="product-color"
                style={{
                  backgroundColor: color,
                }}
              />
            ))}
          </div>
        )}

        {/* Price */}
        <div className="product-price">
          <span className="product-price-current">{formatPrice(price)}</span>

          {oldPrice && (
            <span className="product-price-old">{formatPrice(oldPrice)}</span>
          )}
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
