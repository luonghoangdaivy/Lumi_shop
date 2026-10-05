import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ProductCard from "../common/ProductCard";
import { getProducts } from "../../api/product.api";

import "../../styles/home/product-section.css";

function ProductSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();

        const data = response?.data || response;

        setProducts(Array.isArray(data) ? data.slice(0, 8) : []);
      } catch (error) {
        console.error("Get home products error:", error);

        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="home-section product-section">
      <div className="home-section-container">
        <div className="product-section-heading">
          <div>
            <span className="product-section-eyebrow">OUR PRODUCTS</span>

            <h2>Sản phẩm mới nhất</h2>
          </div>

          <Link to="/products" className="product-section-link">
            Xem tất cả →
          </Link>
        </div>

        {loading ? (
          <div className="home-product-loading">Đang tải sản phẩm...</div>
        ) : products.length === 0 ? (
          <div className="home-product-empty">Chưa có sản phẩm.</div>
        ) : (
          <div className="home-product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default ProductSection;
