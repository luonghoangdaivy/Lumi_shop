import { Check, Package, ShoppingBag } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import "../styles/orders/orders.css";

function OrderSuccess() {
  const navigate = useNavigate();
  const location = useLocation();

  const order = location.state?.order;

  const orderCode = order?.order_code || "";

  const totalAmount = Number(order?.total_amount || 0);

  return (
    <main className="order-success-page">
      <div className="container">
        <div className="order-success">
          {/* SUCCESS ICON */}

          <div className="order-success-icon">
            <Check size={32} strokeWidth={2} />
          </div>

          {/* TITLE */}

          <h1>Đặt hàng thành công!</h1>

          <p className="order-success-message">
            Cảm ơn bạn đã mua sắm tại LUMI. Đơn hàng của bạn đã được tiếp nhận.
          </p>

          {/* ORDER INFO */}

          {orderCode && (
            <div className="order-success-info">
              <div className="order-success-info-row">
                <span>Mã đơn hàng</span>

                <strong>{orderCode}</strong>
              </div>

              {totalAmount > 0 && (
                <div className="order-success-info-row">
                  <span>Tổng tiền</span>

                  <strong>{totalAmount.toLocaleString("vi-VN")}₫</strong>
                </div>
              )}

              {order?.payment_method && (
                <div className="order-success-info-row">
                  <span>Thanh toán</span>

                  <strong>
                    {order.payment_method === "COD"
                      ? "Thanh toán khi nhận hàng"
                      : order.payment_method}
                  </strong>
                </div>
              )}

              {order?.status && (
                <div className="order-success-info-row">
                  <span>Trạng thái</span>

                  <strong>Chờ xác nhận</strong>
                </div>
              )}
            </div>
          )}

          {/* ACTIONS */}

          <div className="order-success-actions">
            <button
              type="button"
              className="order-success-primary"
              onClick={() => navigate("/orders")}
            >
              <Package size={18} />
              Xem đơn hàng
            </button>

            <button
              type="button"
              className="order-success-secondary"
              onClick={() => navigate("/products")}
            >
              <ShoppingBag size={18} />
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

export default OrderSuccess;
