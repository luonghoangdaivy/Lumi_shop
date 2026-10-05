import { useEffect, useState } from "react";

import ProductCard from "../common/ProductCard";
import { getProducts } from "../../api/product.api";

import "../../styles/home/best-seller.css";

function BestSellerSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const response = await getProducts();

        const data = response?.data || response;

        if (Array.isArray(data)) {
          setProducts(data.slice(4, 8));
        }
      } catch (error) {
        console.error("Get best seller error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  return (
    <section className="home-section best-seller-section">
      <div className="home-section-container">
        <div className="best-seller-heading">
          <div>
            <span className="best-seller-eyebrow">BEST SELLERS</span>

            <h2>Được yêu thích nhất</h2>
          </div>

          <p>Những sản phẩm nổi bật được nhiều khách hàng lựa chọn.</p>
        </div>

        {loading ? (
          <div className="best-seller-loading">Đang tải sản phẩm...</div>
        ) : products.length === 0 ? (
          <div className="best-seller-empty">Chưa có sản phẩm.</div>
        ) : (
          <div className="best-seller-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default BestSellerSection;
