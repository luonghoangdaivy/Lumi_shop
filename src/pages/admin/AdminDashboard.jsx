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
} from "lucide-react";

import "../../styles/admin/admin-dashboard.css";

const stats = [
  {
    title: "Tổng doanh thu",
    value: "48.650.000₫",
    change: "+12,8%",
    positive: true,
    description: "so với tháng trước",
    icon: CircleDollarSign,
    color: "purple",
  },
  {
    title: "Đơn hàng",
    value: "286",
    change: "+8,2%",
    positive: true,
    description: "so với tháng trước",
    icon: ShoppingBag,
    color: "blue",
  },
  {
    title: "Khách hàng",
    value: "1.248",
    change: "+5,4%",
    positive: true,
    description: "so với tháng trước",
    icon: Users,
    color: "orange",
  },
  {
    title: "Sản phẩm",
    value: "156",
    change: "-2 sản phẩm",
    positive: false,
    description: "so với tháng trước",
    icon: Package,
    color: "green",
  },
];

const revenue = [
  { month: "T1", value: 32 },
  { month: "T2", value: 45 },
  { month: "T3", value: 37 },
  { month: "T4", value: 58 },
  { month: "T5", value: 48 },
  { month: "T6", value: 69 },
  { month: "T7", value: 55 },
  { month: "T8", value: 77 },
  { month: "T9", value: 63 },
  { month: "T10", value: 88 },
  { month: "T11", value: 72 },
  { month: "T12", value: 96 },
];

const recentOrders = [
  {
    id: "#LM1025",
    customer: "Nguyễn Minh Anh",
    initials: "MA",
    date: "09/10/2026",
    amount: "890.000₫",
    status: "Đang xử lý",
    type: "processing",
  },
  {
    id: "#LM1024",
    customer: "Trần Hoàng Nam",
    initials: "HN",
    date: "09/10/2026",
    amount: "1.250.000₫",
    status: "Đã giao",
    type: "completed",
  },
  {
    id: "#LM1023",
    customer: "Lê Ngọc Hà",
    initials: "NH",
    date: "08/10/2026",
    amount: "450.000₫",
    status: "Chờ xác nhận",
    type: "pending",
  },
  {
    id: "#LM1022",
    customer: "Phạm Gia Bảo",
    initials: "GB",
    date: "08/10/2026",
    amount: "720.000₫",
    status: "Đã giao",
    type: "completed",
  },
  {
    id: "#LM1021",
    customer: "Võ Thảo My",
    initials: "TM",
    date: "07/10/2026",
    amount: "560.000₫",
    status: "Đã hủy",
    type: "cancelled",
  },
];

export default function AdminDashboard() {
  const maxRevenue = Math.max(...revenue.map((item) => item.value));

  return (
    <div className="admin-dashboard">
      <section className="admin-page-heading">
        <div>
          <span className="admin-eyebrow">TỔNG QUAN</span>
          <h1>Dashboard</h1>
          <p>Chào mừng trở lại! Đây là tình hình cửa hàng Lumi.</p>
        </div>

        <button type="button" className="admin-export-button">
          <Download size={17} />
          Xuất báo cáo
        </button>
      </section>

      <section className="admin-stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const ChangeIcon = stat.positive ? ArrowUpRight : ArrowDownRight;

          return (
            <article className="admin-stat-card" key={stat.title}>
              <div className="admin-stat-top">
                <span>{stat.title}</span>
                <div className={`admin-stat-icon ${stat.color}`}>
                  <Icon size={21} />
                </div>
              </div>

              <strong className="admin-stat-value">{stat.value}</strong>

              <div className="admin-stat-bottom">
                <span
                  className={`admin-stat-change ${
                    stat.positive ? "positive" : "negative"
                  }`}
                >
                  <ChangeIcon size={15} />
                  {stat.change}
                </span>
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
              <p>Thống kê doanh thu theo tháng</p>
            </div>

            <button type="button" className="admin-period-button">
              <CalendarDays size={16} />
              Năm 2026
            </button>
          </div>

          <div className="admin-revenue-summary">
            <strong>48.650.000₫</strong>
            <span>
              <ArrowUpRight size={15} />
              12,8%
            </span>
          </div>

          <div
            className="admin-chart"
            role="img"
            aria-label="Biểu đồ doanh thu minh họa theo tháng"
          >
            {revenue.map((item) => (
              <div className="admin-chart-column" key={item.month}>
                <div className="admin-chart-bar-wrap">
                  <div
                    className={`admin-chart-bar ${
                      item.month === "T10" ? "highlight" : ""
                    }`}
                    style={{
                      height: `${(item.value / maxRevenue) * 100}%`,
                    }}
                    title={`${item.month}: ${item.value} triệu đồng (minh họa)`}
                  />
                </div>
                <span>{item.month}</span>
              </div>
            ))}
          </div>

          <div className="admin-chart-note">
            <span />
            Doanh thu minh họa (triệu đồng)
          </div>
        </article>

        <article className="admin-panel admin-quick-panel">
          <div className="admin-panel-heading">
            <div>
              <h2>Tình trạng đơn hàng</h2>
              <p>Tổng hợp minh họa</p>
            </div>
            <button
              type="button"
              className="admin-more-button"
              aria-label="Tùy chọn"
            >
              <MoreHorizontal size={21} />
            </button>
          </div>

          <div className="admin-order-progress">
            <div className="admin-progress-heading">
              <span>Đã giao</span>
              <strong>68%</strong>
            </div>
            <div className="admin-progress-track">
              <span className="delivered" style={{ width: "68%" }} />
            </div>
          </div>

          <div className="admin-order-progress">
            <div className="admin-progress-heading">
              <span>Đang xử lý</span>
              <strong>22%</strong>
            </div>
            <div className="admin-progress-track">
              <span className="processing" style={{ width: "22%" }} />
            </div>
          </div>

          <div className="admin-order-progress">
            <div className="admin-progress-heading">
              <span>Đã hủy</span>
              <strong>10%</strong>
            </div>
            <div className="admin-progress-track">
              <span className="cancelled" style={{ width: "10%" }} />
            </div>
          </div>

          <div className="admin-quick-note">
            <ShoppingBag size={18} />
            <span>Số liệu trên là dữ liệu mẫu, chưa lấy từ API.</span>
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
              {recentOrders.map((order) => (
                <tr key={order.id}>
                  <td>
                    <strong className="admin-order-id">{order.id}</strong>
                  </td>
                  <td>
                    <div className="admin-customer-cell">
                      <span className="admin-customer-avatar">
                        {order.initials}
                      </span>
                      <span>{order.customer}</span>
                    </div>
                  </td>
                  <td>{order.date}</td>
                  <td>
                    <strong>{order.amount}</strong>
                  </td>
                  <td>
                    <span className={`admin-status ${order.type}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="admin-more-button"
                      aria-label={`Tùy chọn đơn ${order.id}`}
                    >
                      <MoreHorizontal size={19} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
