import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

import { getOrders } from "../api/order.api";

function Orders() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getOrders();

      console.log("Orders:", response);

      setOrders(response.data || []);
    } catch (error) {
      console.error("Get orders error:", error);

      setError(
        error.response?.data?.message || "Không thể tải danh sách đơn hàng",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("vi-VN") + " ₫";
  };

  const getStatusText = (status) => {
    const statusMap = {
      PENDING: "Chờ xác nhận",
      CONFIRMED: "Đã xác nhận",
      SHIPPING: "Đang giao hàng",
      DELIVERED: "Đã giao hàng",
      CANCELLED: "Đã hủy",
    };

    return statusMap[status] || status;
  };

  if (loading) {
    return (
      <>
        <Header />

        <main className="orders-page">
          <div className="container">
            <p>Đang tải đơn hàng...</p>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />

        <main className="orders-page">
          <div className="container">
            <p>{error}</p>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="orders-page">
        <div className="container">
          <div className="orders-breadcrumb">Trang chủ / Đơn hàng</div>

          <h1>Đơn hàng của tôi</h1>

          {orders.length === 0 ? (
            <div className="orders-empty">
              <h2>Chưa có đơn hàng</h2>

              <p>Bạn chưa có đơn hàng nào.</p>

              <button type="button" onClick={() => navigate("/products")}>
                Mua sắm ngay
              </button>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div className="order-card" key={order.id}>
                  {/* HEADER */}

                  <div className="order-card-header">
                    <div>
                      <strong>Đơn hàng #{order.id}</strong>

                      <p>
                        {new Date(order.createdAt).toLocaleDateString("vi-VN")}
                      </p>
                    </div>

                    <span
                      className={`order-status order-status-${order.status.toLowerCase()}`}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </div>

                  {/* ITEMS */}

                  <div className="order-card-items">
                    {order.items?.map((item) => (
                      <div className="order-card-item" key={item.id}>
                        <div>
                          <strong>{item.product_name}</strong>

                          <p>
                            Màu: {item.color || "—"} | Size: {item.size || "—"}
                          </p>

                          <p>Số lượng: {item.quantity}</p>
                        </div>

                        <strong>{formatPrice(item.subtotal)}</strong>
                      </div>
                    ))}
                  </div>

                  {/* FOOTER */}

                  <div className="order-card-footer">
                    <div>
                      <span>Tổng tiền:</span>

                      <strong>{formatPrice(order.total_amount)}</strong>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(`/orders/${order.id}`)}
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Orders;
