import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Package, X } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import { getOrders, cancelOrder } from "../api/order.api";

import "../styles/orders/orders.css";

const API_URL = "http://localhost:4000";

function Orders() {
  const navigate = useNavigate();
  const { id: paramOrderId } = useParams();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrder, setExpandedOrder] = useState(
    paramOrderId ? Number(paramOrderId) : null,
  );
  const [cancellingId, setCancellingId] = useState(null);

  // =========================
  // GET ORDERS
  // =========================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getOrders();

      const orderData = response?.data || [];

      setOrders(orderData);

      if (paramOrderId) {
        setExpandedOrder(Number(paramOrderId));
      }
    } catch (error) {
      console.error("Get orders error:", error);

      setError(
        error.response?.data?.message || "Không thể tải danh sách đơn hàng.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [paramOrderId]);

  // =========================
  // FORMAT DATE
  // =========================

  const formatDate = (date) => {
    if (!date) return "--";

    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // =========================
  // FORMAT MONEY
  // =========================

  const formatPrice = (price) => {
    return Number(price || 0).toLocaleString("vi-VN") + "₫";
  };

  // =========================
  // STATUS
  // =========================

  const getStatusLabel = (status) => {
    const statusMap = {
      PENDING: "Chờ xác nhận",
      CONFIRMED: "Đã xác nhận",
      SHIPPING: "Đang giao hàng",
      DELIVERED: "Đã giao hàng",
      CANCELLED: "Đã hủy",
    };

    return statusMap[status] || status || "Không xác định";
  };

  const getStatusClass = (status) => {
    const classMap = {
      PENDING: "pending",
      CONFIRMED: "confirmed",
      SHIPPING: "shipping",
      DELIVERED: "delivered",
      CANCELLED: "cancelled",
    };

    return classMap[status] || "default";
  };

  // =========================
  // TOGGLE ORDER
  // =========================

  const handleToggleOrder = (orderId) => {
    setExpandedOrder((current) => (current === orderId ? null : orderId));
  };

  // =========================
  // CANCEL ORDER
  // =========================

  const handleCancelOrder = async (orderId) => {
    const confirmed = window.confirm("Bạn có chắc muốn hủy đơn hàng này?");

    if (!confirmed) return;

    try {
      setCancellingId(orderId);

      await cancelOrder(orderId);

      alert("Hủy đơn hàng thành công.");

      await fetchOrders();
    } catch (error) {
      console.error("Cancel order error:", error);

      alert(error.response?.data?.message || "Không thể hủy đơn hàng.");
    } finally {
      setCancellingId(null);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <>
        <main className="orders-page">
          <div className="container orders-status">Đang tải đơn hàng...</div>
        </main>
      </>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <>
        <main className="orders-page">
          <div className="container orders-status orders-error">{error}</div>
        </main>
      </>
    );
  }

  // =========================
  // EMPTY
  // =========================

  if (orders.length === 0) {
    return (
      <>
        <main className="orders-page">
          <div className="container">
            <div className="orders-breadcrumb">
              <span>Trang chủ</span>
              <span>/</span>
              <span>Đơn hàng</span>
            </div>

            <div className="orders-empty">
              <div className="orders-empty-icon">
                <Package size={32} />
              </div>

              <h1>Chưa có đơn hàng</h1>

              <p>
                Bạn chưa có đơn hàng nào. Hãy khám phá các sản phẩm của LUMI.
              </p>

              <button
                type="button"
                className="orders-primary-button"
                onClick={() => navigate("/products")}
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  // =========================
  // ORDERS
  // =========================

  return (
    <>
      <main className="orders-page">
        <div className="container">
          {/* BREADCRUMB */}

          <div className="orders-breadcrumb">
            <span>Trang chủ</span>
            <span>/</span>
            <span>Đơn hàng</span>
          </div>

          {/* HEADING */}

          <div className="orders-heading">
            <div>
              <h1>Đơn hàng của tôi</h1>

              <p>Theo dõi và quản lý các đơn hàng của bạn.</p>
            </div>

            <span className="orders-count">{orders.length} đơn hàng</span>
          </div>

          {/* ORDER LIST */}

          <div className="orders-list">
            {orders.map((order) => {
              const isExpanded = expandedOrder === order.id;

              const items = order.items || [];

              const canCancel =
                order.status === "PENDING" || order.status === "CONFIRMED";

              return (
                <article className="order-card" key={order.id}>
                  {/* ORDER HEADER */}

                  <div className="order-card-header">
                    <div className="order-card-main-info">
                      <div className="order-id">
                        <span>Mã đơn hàng</span>
                        <strong>{order.order_code || "Chưa có mã"}</strong>
                      </div>

                      <div className="order-date">
                        <span>Ngày đặt</span>

                        <strong>{formatDate(order.created_at)}</strong>
                      </div>
                    </div>

                    <div
                      className={`order-status order-status-${getStatusClass(
                        order.status,
                      )}`}
                    >
                      {getStatusLabel(order.status)}
                    </div>
                  </div>

                  {/* ORDER PRODUCTS */}

                  <div className="order-card-products">
                    {items.map((item) => {
                      const product = item?.variant?.product;

                      const image =
                        product?.images?.find(
                          (itemImage) => itemImage.is_primary,
                        ) || product?.images?.[0];

                      const imageUrl = image?.image_url
                        ? `${API_URL}${image.image_url}`
                        : "/placeholder-product.jpg";

                      return (
                        <div className="order-product" key={item.id}>
                          <div className="order-product-image">
                            <img
                              src={imageUrl}
                              alt={
                                item.product_name || product?.name || "Sản phẩm"
                              }
                            />
                          </div>

                          <div className="order-product-info">
                            <h3>
                              {item.product_name || product?.name || "Sản phẩm"}
                            </h3>

                            <p>
                              {item.color && `Màu: ${item.color}`}

                              {item.color && item.size && " • "}

                              {item.size && `Size: ${item.size}`}
                            </p>

                            <span>x{item.quantity}</span>
                          </div>

                          <strong>
                            {formatPrice(
                              Number(item.price) * Number(item.quantity),
                            )}
                          </strong>
                        </div>
                      );
                    })}
                  </div>

                  {/* ORDER FOOTER */}

                  <div className="order-card-footer">
                    <div className="order-total">
                      <span>Tổng tiền</span>

                      <strong>{formatPrice(order.total_amount)}</strong>
                    </div>

                    <div className="order-actions">
                      {canCancel && (
                        <button
                          type="button"
                          className="order-cancel-button"
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={cancellingId === order.id}
                        >
                          <X size={15} />

                          {cancellingId === order.id
                            ? "Đang hủy..."
                            : "Hủy đơn"}
                        </button>
                      )}

                      <button
                        type="button"
                        className="order-detail-button"
                        onClick={() => handleToggleOrder(order.id)}
                      >
                        {isExpanded ? (
                          <>
                            Thu gọn
                            <ChevronUp size={16} />
                          </>
                        ) : (
                          <>
                            Chi tiết
                            <ChevronDown size={16} />
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* DETAIL */}

                  {isExpanded && (
                    <div className="order-detail">
                      <div className="order-detail-grid">
                        <div>
                          <span>Địa chỉ nhận hàng</span>

                          <strong>{order.shipping_address || "--"}</strong>
                        </div>

                        <div>
                          <span>Số điện thoại</span>

                          <strong>{order.shipping_phone || "--"}</strong>
                        </div>

                        <div>
                          <span>Phương thức thanh toán</span>

                          <strong>
                            {order.payment_method === "COD"
                              ? "Thanh toán khi nhận hàng"
                              : order.payment_method || "--"}
                          </strong>
                        </div>

                        <div>
                          <span>Trạng thái thanh toán</span>

                          <strong>{order.payment_status || "--"}</strong>
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
}

export default Orders;
