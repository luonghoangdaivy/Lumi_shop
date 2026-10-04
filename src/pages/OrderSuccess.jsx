import { useNavigate } from "react-router-dom";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

function OrderSuccess() {
  const navigate = useNavigate();

  const order = JSON.parse(localStorage.getItem("lastOrder") || "null");

  return (
    <>
      <Header />

      <main className="order-success-page">
        <div className="container">
          <div className="order-success">
            <div className="order-success-icon">✓</div>

            <h1>Đặt hàng thành công!</h1>

            <p>Cảm ơn bạn đã mua sắm tại Lumi.</p>

            {order?.id && (
              <p>
                Mã đơn hàng: <strong>#{order.id}</strong>
              </p>
            )}

            {order?.total_amount && (
              <p>
                Tổng tiền:{" "}
                <strong>
                  {Number(order.total_amount).toLocaleString("vi-VN")} ₫
                </strong>
              </p>
            )}

            <div className="order-success-actions">
              <button type="button" onClick={() => navigate("/orders")}>
                Xem đơn hàng
              </button>

              <button type="button" onClick={() => navigate("/products")}>
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default OrderSuccess;
