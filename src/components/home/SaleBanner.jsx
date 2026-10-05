import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import "../../styles/home/sale-banner.css";

function SaleBanner() {
  const navigate = useNavigate();

  return (
    <section className="home-section sale-banner">
      <div className="sale-banner-container">
        <div className="sale-banner-content">
          <span className="sale-banner-eyebrow">SPECIAL OFFER</span>

          <h2>
            Ưu đãi đặc biệt
            <br />
            dành cho bạn
          </h2>

          <p>Khám phá những sản phẩm đang được ưu đãi tại LUMI.</p>

          <button
            type="button"
            className="sale-banner-button"
            onClick={() => navigate("/products")}
          >
            Mua sắm ngay
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="sale-banner-number">
          <span>UP TO</span>

          <strong>30%</strong>

          <span>OFF</span>
        </div>
      </div>
    </section>
  );
}

export default SaleBanner;
