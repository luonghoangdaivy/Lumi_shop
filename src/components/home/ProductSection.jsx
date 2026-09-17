import { Link } from "react-router-dom";
import ProductCard from "../common/ProductCard";

const products = [
  {
    id: 1,
    name: "Áo thun basic",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=700",
    price: 199000,
    oldPrice: 250000,
    discount: 20,
    colors: ["#ffffff", "#222222", "#8b2d32"],
    isNew: true,
  },

  {
    id: 2,
    name: "Quần jean ống rộng",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=700",
    price: 350000,
    oldPrice: 420000,
    discount: 17,
    colors: ["#31577a", "#222222"],
    isNew: true,
  },

  {
    id: 3,
    name: "Váy hai dây",
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=700",
    price: 450000,
    colors: ["#222222", "#d8b5a5"],
    isNew: true,
  },

  {
    id: 4,
    name: "Áo khoác bomber",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=700",
    price: 599000,
    oldPrice: 699000,
    discount: 14,
    colors: ["#222222", "#777777"],
    isNew: true,
  },
];

function ProductSection() {
  return (
    <section className="product-section">
      <div className="section-heading">
        <div>
          <span className="section-eyebrow">Bộ sưu tập mới</span>

          <h2>Sản phẩm mới</h2>
        </div>

        <Link to="/products" className="section-view-all">
          Xem tất cả →
        </Link>
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}

export default ProductSection;
