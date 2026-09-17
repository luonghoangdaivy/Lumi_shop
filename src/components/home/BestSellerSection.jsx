import { Link } from "react-router-dom";
import ProductCard from "../common/ProductCard";

const products = [
  {
    id: 5,
    name: "Áo hoodie basic",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=700",
    price: 399000,
    oldPrice: 450000,
    discount: 11,
    colors: ["#222222", "#eeeeee"],
  },
  {
    id: 6,
    name: "Quần cargo",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=700",
    price: 390000,
    oldPrice: 450000,
    discount: 13,
    colors: ["#222222", "#8b8068"],
  },
  {
    id: 7,
    name: "Áo thun oversize",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=700",
    price: 299000,
    colors: ["#ffffff", "#222222", "#777777"],
  },
  {
    id: 8,
    name: "Váy midi",
    image: "https://images.unsplash.com/photo-1496217590455-aa63a8350eea?w=700",
    price: 459000,
    oldPrice: 520000,
    discount: 12,
    colors: ["#222222", "#d8c0b0"],
  },
];

function BestSellerSection() {
  return (
    <section className="product-section">
      <div className="section-heading">
        <div>
          <span className="section-eyebrow">Được yêu thích</span>

          <h2>Sản phẩm bán chạy</h2>
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

export default BestSellerSection;
