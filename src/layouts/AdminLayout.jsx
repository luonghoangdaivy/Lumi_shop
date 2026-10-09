import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Users,
  Star,
  Store,
  Menu,
  Search,
  Bell,
  LogOut,
  ChevronRight,
} from "lucide-react";

import "../styles/admin/admin-layout.css";

const adminMenus = [
  {
    label: "Tổng quan",
    path: "/admin",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Sản phẩm",
    path: "/admin/products",
    icon: Package,
  },
  {
    label: "Danh mục",
    path: "/admin/categories",
    icon: Tags,
  },
  {
    label: "Đơn hàng",
    path: "/admin/orders",
    icon: ShoppingCart,
  },
  {
    label: "Khách hàng",
    path: "/admin/customers",
    icon: Users,
  },
  {
    label: "Đánh giá",
    path: "/admin/reviews",
    icon: Star,
  },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="admin-shell">
      {sidebarOpen && (
        <button
          type="button"
          className="admin-overlay"
          aria-label="Đóng menu"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`admin-sidebar ${sidebarOpen ? "admin-sidebar-open" : ""}`}
      >
        <NavLink
          to="/admin"
          className="admin-brand"
          onClick={() => setSidebarOpen(false)}
        >
          <span className="admin-brand-mark">L</span>
          <span className="admin-brand-text">
            <strong>LUMI</strong>
            <small>ADMIN PANEL</small>
          </span>
        </NavLink>

        <div className="admin-sidebar-label">QUẢN LÝ CỬA HÀNG</div>

        <nav className="admin-nav">
          {adminMenus.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `admin-nav-link ${isActive ? "active" : ""}`
                }
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={19} strokeWidth={1.8} />
                <span>{item.label}</span>
                <ChevronRight className="admin-nav-chevron" size={15} />
              </NavLink>
            );
          })}
        </nav>

        <div className="admin-sidebar-bottom">
          <div className="admin-help-card">
            <Store size={20} />
            <strong>Lumi Shop</strong>
            <span>Quản lý cửa hàng của bạn</span>
          </div>

          <button
            type="button"
            className="admin-back-store"
            onClick={() => navigate("/")}
          >
            <Store size={18} />
            <span>Về cửa hàng</span>
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <div className="admin-header-left">
            <button
              type="button"
              className="admin-icon-button admin-menu-toggle"
              onClick={() => setSidebarOpen(true)}
              aria-label="Mở menu"
            >
              <Menu size={21} />
            </button>

            <div className="admin-breadcrumb">
              <span>Admin</span>
              <ChevronRight size={15} />
              <strong>Quản trị cửa hàng</strong>
            </div>
          </div>

          <div className="admin-header-right">
            <label className="admin-search">
              <Search size={18} />
              <input
                type="search"
                placeholder="Tìm kiếm..."
                aria-label="Tìm kiếm"
              />
              <kbd>⌘ K</kbd>
            </label>

            <button
              type="button"
              className="admin-icon-button admin-notification"
              aria-label="Thông báo"
              title="Thông báo"
            >
              <Bell size={19} />
              <span />
            </button>

            <div className="admin-account">
              <div className="admin-account-avatar">A</div>
              <div className="admin-account-info">
                <strong>Quản trị viên</strong>
                <span>Admin</span>
              </div>
            </div>

            <button
              type="button"
              className="admin-icon-button admin-logout"
              onClick={() => navigate("/login")}
              title="Đến trang đăng nhập"
              aria-label="Đăng xuất"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
