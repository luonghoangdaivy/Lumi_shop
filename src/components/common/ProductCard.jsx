import { Link, useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useFavorites } from "../../context/FavoriteContext";

import "../../styles/common/product-card.css";

const API_URL = "http://localhost:4000";

function ProductCard({ product, onFavorite }) {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();

  const favorited = isFavorite(product?.id);

  const primaryImage =
    product?.images?.find((image) => image.is_primary) || product?.images?.[0];

  const imageUrl = primaryImage?.image_url
    ? `${API_URL}${primaryImage.image_url}`
    : "/placeholder-product.jpg";

  const categoryName = product?.category?.name || "Sản phẩm";

  const productPrice = Number(product?.price || 0);

  const handleFavoriteClick = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (onFavorite) {
      onFavorite(product);
      return;
    }

    const res = await toggleFavorite(product);
    if (res?.requireAuth) {
      if (
        window.confirm(
          "Vui lòng đăng nhập để lưu sản phẩm yêu thích. Đi đến trang đăng nhập?",
        )
      ) {
        navigate("/login");
      }
    }
  };

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
          className={`product-card-favorite ${favorited ? "is-favorite" : ""}`}
          onClick={handleFavoriteClick}
          aria-label={favorited ? "Xóa khỏi yêu thích" : "Thêm vào yêu thích"}
          title={favorited ? "Đã yêu thích" : "Thêm vào yêu thích"}
        >
          <Heart
            size={18}
            strokeWidth={favorited ? 0 : 1.7}
            fill={favorited ? "#e53935" : "none"}
            color={favorited ? "#e53935" : "currentColor"}
          />
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
