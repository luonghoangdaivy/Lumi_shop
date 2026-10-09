import { Link } from "react-router-dom";

import "../../styles/home/sale-banner.css";

function SaleBanner() {
  return (
    <section className="sale-banner">
      <div className="sale-banner-content">
        <span className="sale-banner-eyebrow">LUMI SPECIAL OFFER</span>

        <h2 className="sale-banner-title">
          Làm mới phong cách
          <br />
          của bạn cùng LUMI
        </h2>

        <p className="sale-banner-description">
          Khám phá những thiết kế mới nhất và tìm kiếm những món đồ phù hợp với
          phong cách riêng của bạn.
        </p>

        <Link to="/products" className="sale-banner-button">
          Mua sắm ngay
          <span>→</span>
        </Link>
      </div>
    </section>
  );
}

export default SaleBanner;
