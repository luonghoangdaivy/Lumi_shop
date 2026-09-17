import { Search, Heart, UserRound, ShoppingBag, Menu, X } from "lucide-react";

import { useState } from "react";
import { Link } from "react-router-dom";

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="container header-container">
        {/* Logo */}
        <Link to="/" className="header-logo">
          Lumi
        </Link>

        {/* Desktop Navigation */}
        <nav className="header-nav">
          <Link to="/" className="header-nav-link">
            Trang chủ
          </Link>

          <Link to="/products" className="header-nav-link">
            Sản phẩm
          </Link>

          <Link to="/products?gender=men" className="header-nav-link">
            Nam
          </Link>

          <Link to="/products?gender=women" className="header-nav-link">
            Nữ
          </Link>

          <Link to="/products?category=accessories" className="header-nav-link">
            Phụ kiện
          </Link>

          <Link to="/products?sale=true" className="header-nav-link">
            Khuyến mãi
          </Link>
        </nav>

        {/* Actions */}
        <div className="header-actions">
          {/* Search */}
          <button className="header-action" aria-label="Tìm kiếm">
            <Search size={19} strokeWidth={1.8} />
          </button>

          {/* Wishlist */}
          <Link to="/wishlist" className="header-action" aria-label="Yêu thích">
            <Heart size={19} strokeWidth={1.8} />
          </Link>

          {/* Account */}
          <Link to="/account" className="header-action" aria-label="Tài khoản">
            <UserRound size={19} strokeWidth={1.8} />
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="header-action cart-action"
            aria-label="Giỏ hàng"
          >
            <ShoppingBag size={19} strokeWidth={1.8} />

            <span className="cart-count">0</span>
          </Link>

          {/* Mobile menu */}
          <button
            className="mobile-menu-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav className="mobile-nav">
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>
            Trang chủ
          </Link>

          <Link to="/products" onClick={() => setMobileMenuOpen(false)}>
            Sản phẩm
          </Link>

          <Link
            to="/products?gender=men"
            onClick={() => setMobileMenuOpen(false)}
          >
            Nam
          </Link>

          <Link
            to="/products?gender=women"
            onClick={() => setMobileMenuOpen(false)}
          >
            Nữ
          </Link>

          <Link
            to="/products?category=accessories"
            onClick={() => setMobileMenuOpen(false)}
          >
            Phụ kiện
          </Link>

          <Link
            to="/products?sale=true"
            onClick={() => setMobileMenuOpen(false)}
          >
            Khuyến mãi
          </Link>
        </nav>
      )}
    </header>
  );
}

export default Header;
