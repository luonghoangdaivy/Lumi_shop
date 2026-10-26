import { useState } from "react";

import {
  Search,
  ShoppingBag,
  User,
  Heart,
  Menu,
  X,
  LogOut,
  ClipboardList,
  LayoutDashboard,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useFavorites } from "../../context/FavoriteContext";

import "../../styles/layout/header.css";

const categories = [
  {
    name: "Áo",
    slug: "ao",
  },
  {
    name: "Quần",
    slug: "quan",
  },
  {
    name: "Váy",
    slug: "vay",
  },
  {
    name: "Áo khoác",
    slug: "ao-khoac",
  },
];

function Header() {
  const navigate = useNavigate();

  const { cartCount, clearCart } = useCart();
  const { favoriteCount } = useFavorites();

  const { user, loading: authLoading, isAuthenticated, logout } = useAuth();

  const [search, setSearch] = useState("");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // =========================
  // SEARCH
  // =========================

  const handleSearch = (event) => {
    event.preventDefault();

    const keyword = search.trim();

    if (!keyword) {
      navigate("/products");
      return;
    }

    navigate(`/products?search=${encodeURIComponent(keyword)}`);

    setSearch("");
    setMobileMenuOpen(false);
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    clearCart();
    logout();

    setUserMenuOpen(false);
    setMobileMenuOpen(false);

    navigate("/");
  };

  // =========================
  // CATEGORY
  // =========================

  const handleCategoryClick = (slug) => {
    navigate(`/products?category=${slug}`);

    setMobileMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="header-container">
        {/* =========================
            MOBILE MENU BUTTON
        ========================= */}

        <button
          type="button"
          className="header-menu-button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Đóng menu" : "Mở menu"}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* =========================
            LOGO
        ========================= */}

        <Link
          to="/"
          className="header-logo"
          onClick={() => setMobileMenuOpen(false)}
        >
          LUMI
        </Link>

        {/* =========================
            DESKTOP NAVIGATION
        ========================= */}

        <nav className="header-nav">
          <Link to="/">Trang chủ</Link>

          <Link to="/products">Sản phẩm</Link>

          <div className="header-category-wrapper">
            <span className="header-category-label">Danh mục</span>

            <div className="header-category-dropdown">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  to={`/products?category=${category.slug}`}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* =========================
            HEADER ACTIONS
        ========================= */}

        <div className="header-actions">
          {/* SEARCH */}

          <form className="header-search" onSubmit={handleSearch}>
            <Search size={18} />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm kiếm..."
              aria-label="Tìm kiếm sản phẩm"
            />
          </form>

          {/* FAVORITE */}

          <button
            type="button"
            className="header-icon-button"
            onClick={() => navigate("/favorites")}
            aria-label="Sản phẩm yêu thích"
          >
            <Heart size={20} strokeWidth={1.7} />
            {favoriteCount > 0 && (
              <span className="header-favorite-count">{favoriteCount}</span>
            )}
          </button>

          {/* =========================
              USER / AVATAR
          ========================= */}

          {authLoading ? (
            <div className="header-avatar-button">
              <User size={20} strokeWidth={1.7} />
            </div>
          ) : isAuthenticated ? (
            <div className="header-user-wrapper">
              {/* AVATAR */}

              <button
                type="button"
                className="header-avatar-button"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-label="Tài khoản"
              >
                <User size={20} strokeWidth={1.7} />
              </button>

              {/* USER DROPDOWN */}

              {userMenuOpen && (
                <div className="header-user-dropdown">
                  {/* USER INFO */}

                  <div className="header-user-dropdown-info">
                    <div className="header-user-avatar-large">
                      <User size={22} strokeWidth={1.7} />
                    </div>

                    <div>
                      <strong>
                        {user?.name ||
                          user?.full_name ||
                          user?.username ||
                          "Tài khoản"}
                      </strong>

                      {user?.email && <span>{user.email}</span>}
                    </div>
                  </div>

                  <div className="header-user-dropdown-divider" />

                  {/* ADMIN */}
                  {user?.role === "ADMIN" && (
                    <button
                      type="button"
                      onClick={() => {
                        navigate("/admin");
                        setUserMenuOpen(false);
                      }}
                    >
                      <LayoutDashboard size={17} />
                      <span>Quản trị</span>
                    </button>
                  )}

                  {/* USER INFORMATION */}

                  <button
                    type="button"
                    onClick={() => {
                      navigate("/user");
                      setUserMenuOpen(false);
                    }}
                  >
                    <User size={17} />

                    <span>Thông tin</span>
                  </button>

                  {/* ORDERS */}

                  <button
                    type="button"
                    onClick={() => {
                      navigate("/orders");
                      setUserMenuOpen(false);
                    }}
                  >
                    <ClipboardList size={17} />

                    <span>Đơn hàng</span>
                  </button>

                  {/* LOGOUT */}

                  <button
                    type="button"
                    className="header-logout-button"
                    onClick={handleLogout}
                  >
                    <LogOut size={17} />

                    <span>Đăng xuất</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* CHƯA ĐĂNG NHẬP */

            <button
              type="button"
              className="header-avatar-button"
              onClick={() => navigate("/login")}
              aria-label="Đăng nhập"
            >
              <User size={20} strokeWidth={1.7} />
            </button>
          )}

          {/* =========================
              CART
          ========================= */}

          <button
            type="button"
            className="header-cart-button"
            onClick={() => navigate("/cart")}
            aria-label="Giỏ hàng"
          >
            <ShoppingBag size={21} strokeWidth={1.7} />

            {cartCount > 0 && (
              <span className="header-cart-count">{cartCount}</span>
            )}
          </button>
        </div>
      </div>

      {/* =========================
          MOBILE MENU
      ========================= */}

      {mobileMenuOpen && (
        <div className="header-mobile-menu">
          <nav className="header-mobile-nav">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              Trang chủ
            </Link>

            <Link to="/products" onClick={() => setMobileMenuOpen(false)}>
              Tất cả sản phẩm
            </Link>

            {/* MOBILE CATEGORY */}

            <div className="header-mobile-category">
              <span>Danh mục</span>

              {categories.map((category) => (
                <button
                  type="button"
                  key={category.slug}
                  onClick={() => handleCategoryClick(category.slug)}
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* FAVORITE */}

            <button
              type="button"
              onClick={() => {
                navigate("/favorites");
                setMobileMenuOpen(false);
              }}
            >
              <Heart size={17} />
              Yêu thích
            </button>

            {/* ORDERS */}

            {isAuthenticated && (
              <button
                type="button"
                onClick={() => {
                  navigate("/orders");
                  setMobileMenuOpen(false);
                }}
              >
                <ClipboardList size={17} />
                Đơn hàng
              </button>
            )}

            {/* USER */}

            {isAuthenticated && (
              <button
                type="button"
                onClick={() => {
                  navigate("/user");
                  setMobileMenuOpen(false);
                }}
              >
                <User size={17} />
                Thông tin
              </button>
            )}

            {/* LOGIN */}

            {!isAuthenticated && !authLoading && (
              <button
                type="button"
                onClick={() => {
                  navigate("/login");
                  setMobileMenuOpen(false);
                }}
              >
                <User size={17} />
                Đăng nhập
              </button>
            )}

            {/* LOGOUT */}

            {isAuthenticated && (
              <button
                type="button"
                className="header-mobile-logout"
                onClick={handleLogout}
              >
                <LogOut size={17} />
                Đăng xuất
              </button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export default Header;
