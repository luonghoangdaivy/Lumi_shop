import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, User, Heart, Menu, X } from "lucide-react";

import "../../styles/layout/header.css";

function Header() {
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    const keyword = searchValue.trim();

    if (!keyword) return;

    navigate(`/products?search=${encodeURIComponent(keyword)}`);

    setSearchOpen(false);
    setSearchValue("");
  };

  const handleMobileLink = () => {
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header className="site-header">
        <div className="container header-container">
          {/* MOBILE MENU */}
          <button
            type="button"
            className="header-mobile-menu"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Mở menu"
          >
            <Menu size={22} />
          </button>

          {/* LOGO */}
          <Link to="/" className="header-logo">
            LUMI
          </Link>

          {/* NAVIGATION */}
          <nav className="header-nav">
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? "header-nav-link active" : "header-nav-link"
              }
            >
              Trang chủ
            </NavLink>

            <NavLink
              to="/products"
              className={({ isActive }) =>
                isActive ? "header-nav-link active" : "header-nav-link"
              }
            >
              Sản phẩm
            </NavLink>

            <NavLink to="/products?category=ao" className="header-nav-link">
              Áo
            </NavLink>

            <NavLink to="/products?category=quan" className="header-nav-link">
              Quần
            </NavLink>

            <NavLink to="/products?category=vay" className="header-nav-link">
              Váy
            </NavLink>

            <NavLink
              to="/products?category=ao-khoac"
              className="header-nav-link"
            >
              Áo khoác
            </NavLink>
          </nav>

          {/* ACTIONS */}
          <div className="header-actions">
            <button
              type="button"
              className="header-action"
              onClick={() => setSearchOpen(true)}
              aria-label="Tìm kiếm"
            >
              <Search size={20} strokeWidth={1.7} />
            </button>

            <button
              type="button"
              className="header-action header-user"
              onClick={() => navigate("/login")}
              aria-label="Tài khoản"
            >
              <User size={20} strokeWidth={1.7} />
            </button>

            <button
              type="button"
              className="header-action"
              onClick={() => navigate("/favorites")}
              aria-label="Yêu thích"
            >
              <Heart size={20} strokeWidth={1.7} />
            </button>

            <button
              type="button"
              className="header-action header-cart"
              onClick={() => navigate("/cart")}
              aria-label="Giỏ hàng"
            >
              <ShoppingBag size={20} strokeWidth={1.7} />

              <span className="header-cart-count">0</span>
            </button>
          </div>
        </div>
      </header>

      {/* SEARCH OVERLAY */}
      {searchOpen && (
        <div className="header-search-overlay">
          <div className="header-search-box">
            <div className="container">
              <form className="header-search-form" onSubmit={handleSearch}>
                <Search size={22} />

                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Tìm kiếm sản phẩm..."
                  autoFocus
                />

                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  aria-label="Đóng tìm kiếm"
                >
                  <X size={22} />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay">
          <div className="mobile-menu">
            <div className="mobile-menu-header">
              <Link to="/" className="header-logo" onClick={handleMobileLink}>
                LUMI
              </Link>

              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Đóng menu"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="mobile-nav">
              <NavLink to="/" onClick={handleMobileLink}>
                Trang chủ
              </NavLink>

              <NavLink to="/products" onClick={handleMobileLink}>
                Sản phẩm
              </NavLink>

              <NavLink to="/products?category=ao" onClick={handleMobileLink}>
                Áo
              </NavLink>

              <NavLink to="/products?category=quan" onClick={handleMobileLink}>
                Quần
              </NavLink>

              <NavLink to="/products?category=vay" onClick={handleMobileLink}>
                Váy
              </NavLink>

              <NavLink
                to="/products?category=ao-khoac"
                onClick={handleMobileLink}
              >
                Áo khoác
              </NavLink>

              <NavLink to="/orders" onClick={handleMobileLink}>
                Đơn hàng
              </NavLink>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
