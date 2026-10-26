import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import "../../styles/home/hero.css";

function Hero() {
  const navigate = useNavigate();

  return (
    <section className="hero">
      {/* [MỚI] Lớp ảnh nền: phủ toàn bộ section.
          Đặt TRƯỚC nội dung trong code để nó nằm phía dưới (kết hợp z-index trong CSS). */}
      <div className="hero-bg">
        <img
          src="/images/lumi_banner.png"
          alt="Bộ sưu tập thời trang LUMI 2026"
        />
      </div>

      {/* Lớp nội dung: nằm trên ảnh nền */}
      <div className="hero-container">
        <div className="hero-content">
          <span className="hero-eyebrow">NEW COLLECTION 2026</span>

          <h1 className="hero-title">
            Phong cách
            <br />
            dành riêng cho bạn
          </h1>

          <p className="hero-description">
            Khám phá những thiết kế thời trang hiện đại, tối giản và phù hợp với
            phong cách của bạn.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="hero-primary-button"
              onClick={() => navigate("/products")}
            >
              Khám phá ngay
              <ArrowRight size={18} />
            </button>

            <button
              type="button"
              className="hero-secondary-button"
              onClick={() => navigate("/products?category=ao")}
            >
              Bộ sưu tập
            </button>
          </div>
        </div>
      </div>

      {/* [DI CHUYỂN] Thẻ nổi giờ là con trực tiếp của .hero
          (không còn nằm trong .hero-image-wrapper vì wrapper này đã bỏ).
          Nó được định vị tuyệt đối so với toàn bộ section. */}
      <div className="hero-floating-card">
        <span className="hero-floating-label">LUMI</span>

        <strong>
          Everyday
          <br />
          Essentials
        </strong>
      </div>
    </section>
  );
}

export default Hero;
