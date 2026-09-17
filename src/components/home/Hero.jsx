import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

function Hero() {
  return (
    <section className="hero">
      <div className="hero-image">
        <div className="hero-overlay" />

        <div className="hero-content">
          <span className="hero-eyebrow">Lumi Collection</span>

          <h1>NEW SEASON</h1>

          <p>Phong cách mới, lựa chọn chính mình</p>

          <Link to="/products" className="hero-button">
            Mua ngay
            <ArrowRight size={15} />
          </Link>
        </div>

        <div className="hero-slide-control">
          <button aria-label="Slide trước">‹</button>

          <span>01 / 03</span>

          <button aria-label="Slide tiếp theo">›</button>
        </div>
      </div>
    </section>
  );
}

export default Hero;
