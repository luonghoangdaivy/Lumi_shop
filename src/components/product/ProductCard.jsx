import Badge from "../common/Badge";

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <div className="product-image-wrapper">
        {product.isNew && <Badge variant="sale">NEW</Badge>}

        <img src={product.image} alt={product.name} className="product-image" />

        <button className="product-wishlist">♡</button>
      </div>

      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>

        <p className="product-category">{product.category}</p>

        <div className="product-price">
          {product.price.toLocaleString("vi-VN")}đ
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
