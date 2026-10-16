import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  CircleDollarSign,
  ShoppingBag,
  Users,
  Package,
  MoreHorizontal,
  Download,
  CalendarDays,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import api from "../../api/axios";
import "../../styles/admin/admin-dashboard.css";

const monthLabels = [
  "T1",
  "T2",
  "T3",
  "T4",
  "T5",
  "T6",
  "T7",
  "T8",
  "T9",
  "T10",
  "T11",
  "T12",
];

const formatCurrency = (value) =>
  `${Number(value || 0).toLocaleString("vi-VN")}₫`;

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("vi-VN");
};

const statusInfo = (status) => {
  const statuses = {
    PENDING: { label: "Chờ xác nhận", type: "pending" },
    CONFIRMED: { label: "Đã xác nhận", type: "processing" },
    SHIPPING: { label: "Đang giao", type: "processing" },
    DELIVERED: { label: "Đã giao", type: "completed" },
    CANCELLED: { label: "Đã hủy", type: "cancelled" },
  };
  return (
    statuses[String(status || "").toUpperCase()] || {
      label: status || "Chưa rõ",
      type: "pending",
    }
  );
};

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/admin/dashboard");
      const payload = response?.data;
      if (payload?.success === false) {
        throw new Error(payload.message || "Không thể tải dữ liệu tổng quan.");
      }
      setDashboard(payload?.data ?? payload);
    } catch (err) {
      console.error("LOAD ADMIN DASHBOARD ERROR:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Không thể kết nối API tổng quan.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const overview = dashboard?.overview || {};
  const revenueData = dashboard?.revenue || {};
  const ordersData = dashboard?.orders || {};
  const productsData = dashboard?.products || {};
  const monthlyRevenue = Array.isArray(revenueData.byMonth)
    ? revenueData.byMonth
    : [];

  const chartData = useMemo(
    () =>
      monthLabels.map((month, index) => ({
        month,
        value: Number(monthlyRevenue[index] || 0),
      })),
    [monthlyRevenue],
  );
  const maxRevenue = Math.max(...chartData.map((item) => item.value), 1);

  const stats = [
    {
      title: "Tổng doanh thu",
      value: formatCurrency(revenueData.total ?? overview.totalRevenue),
      description: "Tính từ đơn hàng đã giao",
      icon: CircleDollarSign,
      color: "purple",
    },
    {
      title: "Đơn hàng",
      value: Number(
        ordersData.total ?? overview.totalOrders ?? 0,
      ).toLocaleString("vi-VN"),
      description: `${Number(ordersData.currentMonth || 0).toLocaleString("vi-VN")} đơn trong tháng này`,
      icon: ShoppingBag,
      color: "blue",
    },
    {
      title: "Khách hàng",
      value: Number(overview.totalUsers || 0).toLocaleString("vi-VN"),
      description: "Tài khoản trong hệ thống",
      icon: Users,
      color: "orange",
    },
    {
      title: "Sản phẩm",
      value: Number(
        productsData.total ?? overview.totalProducts ?? 0,
      ).toLocaleString("vi-VN"),
      description: `${Number(productsData.active || 0).toLocaleString("vi-VN")} sản phẩm đang hoạt động`,
      icon: Package,
      color: "green",
    },
  ];

  const orderTotal = Number(ordersData.total || 0);
  const progressItems = [
    {
      label: "Đã giao",
      count: Number(ordersData.delivered || 0),
      type: "delivered",
    },
    {
      label: "Đang xử lý",
      count:
        Number(ordersData.confirmed || 0) + Number(ordersData.shipping || 0),
      type: "processing",
    },
    {
      label: "Chờ xác nhận",
      count: Number(ordersData.pending || 0),
      type: "pending",
    },
    {
      label: "Đã hủy",
      count: Number(ordersData.cancelled || 0),
      type: "cancelled",
    },
  ];

  const recentOrders = Array.isArray(dashboard?.recentOrders)
    ? dashboard.recentOrders
    : [];

  return (
    <div className="admin-dashboard">
      <section className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">TỔNG QUAN</span>
          <h1>Dashboard</h1>
          <p>Chào mừng trở lại! Đây là tình hình cửa hàng Lumi.</p>
        </div>
        <button
          type="button"
          className="admin-export-button"
          onClick={loadDashboard}
          disabled={loading}
        >
          <RefreshCw size={17} />
          {loading ? "Đang tải..." : "Làm mới dữ liệu"}
        </button>
      </section>

      {error && (
        <div role="alert" className="admin-dashboard-error">
          <span>{error}</span>
          <button type="button" onClick={loadDashboard}>
            Thử lại
          </button>
        </div>
      )}

      <section className="admin-stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <article className="admin-stat-card" key={stat.title}>
              <div className="admin-stat-top">
                <span>{stat.title}</span>
                <div className={`admin-stat-icon ${stat.color}`}>
                  <Icon size={21} />
                </div>
              </div>
              <strong className="admin-stat-value">
                {loading ? "…" : stat.value}
              </strong>
              <div className="admin-stat-bottom">
                <span>{stat.description}</span>
              </div>
            </article>
          );
        })}
      </section>

      <section className="admin-dashboard-grid">
        <article className="admin-panel admin-revenue-panel">
          <div className="admin-panel-heading">
            <div>
              <h2>Doanh thu</h2>
              <p>Doanh thu đơn hàng đã giao theo tháng</p>
            </div>
            <span className="admin-period-button">
              <CalendarDays size={16} />
              Năm {new Date().getFullYear()}
            </span>
          </div>

          <div className="admin-revenue-summary">
            <strong>
              {loading ? "…" : formatCurrency(revenueData.currentMonth)}
            </strong>
            <span>Tháng hiện tại</span>
          </div>

          <div
            className="admin-chart"
            role="img"
            aria-label="Biểu đồ doanh thu theo tháng từ API"
          >
            {chartData.map((item, index) => (
              <div className="admin-chart-column" key={item.month}>
                <div className="admin-chart-bar-wrap">
                  <div
                    className={`admin-chart-bar ${index === new Date().getMonth() ? "highlight" : ""}`}
                    style={{
                      height: `${item.value > 0 ? Math.max((item.value / maxRevenue) * 100, 3) : 0}%`,
                    }}
                    title={`${item.month}: ${formatCurrency(item.value)}`}
                  />
                </div>
                <span>{item.month}</span>
              </div>
            ))}
          </div>
          <div className="admin-chart-note">
            <span />
            Doanh thu thực tế (VND)
          </div>
        </article>

        <article className="admin-panel admin-quick-panel">
          <div className="admin-panel-heading">
            <div>
              <h2>Tình trạng đơn hàng</h2>
              <p>Thống kê theo trạng thái hiện tại</p>
            </div>
            <MoreHorizontal size={21} />
          </div>

          {progressItems.map((item) => {
            const percent = orderTotal
              ? Math.round((item.count / orderTotal) * 100)
              : 0;
            return (
              <div className="admin-order-progress" key={item.type}>
                <div className="admin-progress-heading">
                  <span>{item.label}</span>
                  <strong>
                    {percent}% ({item.count})
                  </strong>
                </div>
                <div className="admin-progress-track">
                  <span
                    className={item.type}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}

          <div className="admin-quick-note">
            <ShoppingBag size={18} />
            <span>
              {orderTotal.toLocaleString("vi-VN")} đơn hàng trong hệ thống.
            </span>
          </div>
        </article>
      </section>

      <section className="admin-panel admin-recent-panel">
        <div className="admin-panel-heading">
          <div>
            <h2>Đơn hàng gần đây</h2>
            <p>Theo dõi các đơn hàng mới nhất</p>
          </div>
          <button
            type="button"
            className="admin-view-all"
            onClick={() => {
              window.location.href = "/admin/orders";
            }}
          >
            Xem tất cả <ArrowRight size={16} />
          </button>
        </div>

        <div className="admin-table-scroll">
          <table className="admin-orders-table">
            <thead>
              <tr>
                <th>Mã đơn hàng</th>
                <th>Khách hàng</th>
                <th>Ngày đặt</th>
                <th>Tổng tiền</th>
                <th>Trạng thái</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6">Đang tải đơn hàng...</td>
                </tr>
              ) : recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="6">
                    Chưa có đơn hàng hoặc API chưa trả về recentOrders.
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => {
                  const info = statusInfo(order.status);
                  const orderId = order.id ?? order.order_id;
                  const customerName =
                    order.user?.name ||
                    order.customer?.name ||
                    order.customer_name ||
                    (order.user_id
                      ? `Khách hàng #${order.user_id}`
                      : "Khách hàng");
                  const initials = customerName
                    .split(/\s+/)
                    .slice(-2)
                    .map((part) => part[0] || "")
                    .join("")
                    .toUpperCase();
                  return (
                    <tr key={orderId}>
                      <td>
                        <strong className="admin-order-id">#{orderId}</strong>
                      </td>
                      <td>
                        <div className="admin-customer-cell">
                          <span className="admin-customer-avatar">
                            {initials}
                          </span>
                          <span>{customerName}</span>
                        </div>
                      </td>
                      <td>
                        {formatDate(
                          order.created_at ||
                            order.createdAt ||
                            order.createdAt,
                        )}
                      </td>
                      <td>
                        <strong>
                          {formatCurrency(
                            order.total_amount ?? order.totalAmount,
                          )}
                        </strong>
                      </td>
                      <td>
                        <span className={`admin-status ${info.type}`}>
                          {info.label}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          className="admin-more-button"
                          aria-label={`Xem đơn ${orderId}`}
                          onClick={() => {
                            window.location.href = "/admin/orders";
                          }}
                        >
                          <MoreHorizontal size={19} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
