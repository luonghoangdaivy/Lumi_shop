import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ProductCard from "../common/ProductCard";
import { getProducts } from "../../api/product.api";

import "../../styles/home/best-seller.css";

function BestSellerSection() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getProducts({ featured: true });

        const data = response?.data || response;

        if (Array.isArray(data)) {
          /*
           * Hiện tại backend chưa có API bestseller.
           * Tạm lấy 4 sản phẩm đầu tiên làm sản phẩm nổi bật.
           *
           * Sau này có API thống kê bán chạy,
           * chỉ cần thay phần xử lý data ở đây.
           */
          setProducts(data.slice(0, 4));
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Get best seller products error:", error);

        setError(
          error.response?.data?.message || "Không thể tải sản phẩm nổi bật.",
        );

        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <section className="home-section best-seller-section">
      <div className="home-section-container">
        {/* =========================
            Heading
        ========================= */}

        <div className="best-seller-heading">
          <div>
            <span className="best-seller-eyebrow">FEATURED</span>

            <h2>Sản phẩm nổi bật</h2>

            <p>
              Những thiết kế được Lumi lựa chọn để tạo điểm nhấn cho phong cách
              hằng ngày.
            </p>
          </div>

          <Link to="/products" className="best-seller-link">
            Khám phá thêm
            <span>→</span>
          </Link>
        </div>

        {/* =========================
            Loading
        ========================= */}

        {loading && (
          <div className="best-seller-status">Đang tải sản phẩm...</div>
        )}

        {/* =========================
            Error
        ========================= */}

        {!loading && error && (
          <div className="best-seller-status best-seller-error">{error}</div>
        )}

        {/* =========================
            Empty
        ========================= */}

        {!loading && !error && products.length === 0 && (
          <div className="best-seller-status">
            Hiện chưa có sản phẩm nổi bật.
          </div>
        )}

        {/* =========================
            Products
        ========================= */}

        {!loading && !error && products.length > 0 && (
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
