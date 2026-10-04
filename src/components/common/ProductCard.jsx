import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

import "../../styles/common/product-card.css";

const API_URL = "http://localhost:4000";

function ProductCard({ product, onFavorite }) {
  const primaryImage =
    product?.images?.find((image) => image.is_primary) || product?.images?.[0];

  const imageUrl = primaryImage?.image_url
    ? `${API_URL}${primaryImage.image_url}`
    : "/placeholder-product.jpg";

  const categoryName = product?.category?.name || "Sản phẩm";

  const productPrice = Number(product?.price || 0);

  return (
    <article className="product-card">
      <div className="product-card-image-wrapper">
        <Link
          to={`/products/${product.id}`}
          className="product-card-image-link"
        >
          <img
            src={imageUrl}
            alt={product?.name || "Sản phẩm"}
            className="product-card-image"
          />
        </Link>

        <button
          type="button"
          className="product-card-favorite"
          onClick={() => onFavorite?.(product)}
          aria-label="Thêm vào yêu thích"
        >
          <Heart size={18} strokeWidth={1.7} />
        </button>
      </div>

      <div className="product-card-content">
        <span className="product-card-category">{categoryName}</span>

        <Link to={`/products/${product.id}`} className="product-card-name">
          {product?.name}
        </Link>

        <p className="product-card-price">
          {productPrice.toLocaleString("vi-VN")}₫
        </p>
      </div>
    </article>
  );
}

export default ProductCard;
