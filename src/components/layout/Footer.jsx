import { Link } from "react-router-dom";

import { Mail, MapPin, Phone } from "lucide-react";

import { FaFacebookF, FaInstagram } from "react-icons/fa";

import "../../styles/layout/footer.css";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-main">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              LUMI
            </Link>

            <p className="footer-description">
              Thời trang hiện đại dành cho phong cách sống của bạn.
            </p>

            <div className="footer-socials">
              <a href="#" aria-label="Facebook">
                <FaFacebookF size={16} />
              </a>

              <a href="#" aria-label="Instagram">
                <FaInstagram size={17} />
              </a>
            </div>
          </div>

          {/* Shopping */}
          <div className="footer-column">
            <h3>Mua sắm</h3>

            <Link to="/products">Tất cả sản phẩm</Link>

            <Link to="/products?category=ao">Áo</Link>

            <Link to="/products?category=quan">Quần</Link>

            <Link to="/products?category=vay">Váy</Link>

            <Link to="/products?category=ao-khoac">Áo khoác</Link>
          </div>

          {/* Support */}
          <div className="footer-column">
            <h3>Hỗ trợ</h3>

            <Link to="/orders">Theo dõi đơn hàng</Link>

            <a href="#">Chính sách đổi trả</a>

            <a href="#">Chính sách vận chuyển</a>

            <a href="#">Câu hỏi thường gặp</a>
          </div>

          {/* Contact */}
          <div className="footer-column footer-contact">
            <h3>Liên hệ</h3>

            <div className="footer-contact-item">
              <MapPin size={17} />
              <span>Đà Nẵng, Việt Nam</span>
            </div>

            <div className="footer-contact-item">
              <Phone size={17} />
              <span>0123 456 789</span>
            </div>

            <div className="footer-contact-item">
              <Mail size={17} />
              <span>support@lumi.vn</span>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} LUMI. All rights reserved.</p>

          <div className="footer-bottom-links">
            <a href="#">Chính sách bảo mật</a>

            <a href="#">Điều khoản sử dụng</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
