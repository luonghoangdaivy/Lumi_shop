import { Link } from "react-router-dom";

function SaleBanner() {
  return (
    <section className="sale-banner">
      <div className="sale-banner-overlay">
        <div className="sale-banner-content">
          <span className="sale-eyebrow">Ưu đãi đặc biệt</span>

          <h2>Giảm đến 50%</h2>

          <p>Sản phẩm chọn lọc</p>

          <Link to="/products" className="sale-banner-button">
            Xem ngay →
          </Link>
        </div>
      </div>
    </section>
  );
}

export default SaleBanner;
