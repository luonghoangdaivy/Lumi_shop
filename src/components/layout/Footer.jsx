import { Mail, Phone, MapPin } from "lucide-react";

import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        {/* Footer main */}
        <div className="footer-main">
          {/* Brand */}
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              Lumi
            </Link>

            <p className="footer-description">
              Thời trang unisex tối giản, hiện đại và phù hợp với mọi phong
              cách.
            </p>

            <div className="footer-social">
              <a href="#" aria-label="Facebook">
                f
              </a>

              <a href="#" aria-label="Instagram">
                ig
              </a>

              <a href="#" aria-label="Youtube">
                yt
              </a>
            </div>
          </div>

          {/* Shop */}
          <div className="footer-column">
            <h3>Shop</h3>

            <Link to="/products">Tất cả sản phẩm</Link>

            <Link to="/products?gender=men">Nam</Link>

            <Link to="/products?gender=women">Nữ</Link>

            <Link to="/products?category=accessories">Phụ kiện</Link>

            <Link to="/products?sale=true">Khuyến mãi</Link>
          </div>

          {/* Hỗ trợ */}
          <div className="footer-column">
            <h3>Hỗ trợ</h3>

            <Link to="/account">Tài khoản</Link>

            <Link to="/orders">Theo dõi đơn hàng</Link>

            <a href="#">Chính sách đổi trả</a>

            <a href="#">Chính sách vận chuyển</a>

            <a href="#">Câu hỏi thường gặp</a>
          </div>

          {/* Contact */}
          <div className="footer-column footer-contact">
            <h3>Liên hệ</h3>

            <div className="footer-contact-item">
              <MapPin size={16} />

              <span>Đà Nẵng, Việt Nam</span>
            </div>

            <div className="footer-contact-item">
              <Phone size={16} />

              <span>0123 456 789</span>
            </div>

            <div className="footer-contact-item">
              <Mail size={16} />

              <span>support@lumi.vn</span>
            </div>
          </div>
        </div>

        {/* Footer bottom */}
        <div className="footer-bottom">
          <p>© 2026 Lumi. All rights reserved.</p>

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
