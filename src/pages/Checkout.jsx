import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

import { createOrder } from "../api/order.api";

function Checkout() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    shipping_address: "",
    shipping_phone: "",
    payment_method: "COD",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("========== CREATE ORDER ==========");
    console.log("Form:", form);

    // Kiểm tra dữ liệu
    if (!form.shipping_address.trim()) {
      setError("Vui lòng nhập địa chỉ nhận hàng");
      return;
    }

    if (!form.shipping_phone.trim()) {
      setError("Vui lòng nhập số điện thoại");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      console.log("Đang gọi POST /orders...");

      const response = await createOrder(form);

      console.log("Create order response:", response);

      if (response?.data) {
        localStorage.setItem("lastOrder", JSON.stringify(response.data));
      }

      setSuccess("Đặt hàng thành công!");

      // Chuyển trang sau khi tạo order thành công
      setTimeout(() => {
        navigate("/order-success");
      }, 500);
    } catch (error) {
      console.error("CREATE ORDER ERROR:", error);

      console.log("Backend response:", error.response?.data);

      setError(error.response?.data?.message || "Không thể tạo đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="checkout-page">
        <div className="container">
          <div className="checkout-breadcrumb">
            Trang chủ / Giỏ hàng / Thanh toán
          </div>

          <h1>Thanh toán</h1>

          {/* ERROR */}

          {error && <div className="checkout-error">{error}</div>}

          {/* SUCCESS */}

          {success && <div className="checkout-success">{success}</div>}

          <form className="checkout-form" onSubmit={handleSubmit}>
            {/* =========================
                SHIPPING INFORMATION
            ========================= */}

            <section className="checkout-section">
              <h2>Thông tin nhận hàng</h2>

              <div className="form-group">
                <label htmlFor="shipping_address">Địa chỉ nhận hàng</label>

                <textarea
                  id="shipping_address"
                  name="shipping_address"
                  value={form.shipping_address}
                  onChange={handleChange}
                  placeholder="Ví dụ: 123 Nguyễn Văn Linh, Hải Châu, Đà Nẵng"
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label htmlFor="shipping_phone">Số điện thoại</label>

                <input
                  id="shipping_phone"
                  type="tel"
                  name="shipping_phone"
                  value={form.shipping_phone}
                  onChange={handleChange}
                  placeholder="Nhập số điện thoại"
                />
              </div>
            </section>

            {/* =========================
                PAYMENT
            ========================= */}

            <section className="checkout-section">
              <h2>Phương thức thanh toán</h2>

              <label className="payment-option">
                <input
                  type="radio"
                  name="payment_method"
                  value="COD"
                  checked={form.payment_method === "COD"}
                  onChange={handleChange}
                />

                <span>Thanh toán khi nhận hàng (COD)</span>
              </label>

              <label className="payment-option">
                <input
                  type="radio"
                  name="payment_method"
                  value="ONLINE"
                  checked={form.payment_method === "ONLINE"}
                  onChange={handleChange}
                />

                <span>Thanh toán online</span>
              </label>
            </section>

            {/* =========================
                SUBMIT
            ========================= */}

            <button
              type="submit"
              className="place-order-button"
              disabled={loading}
            >
              {loading ? "Đang đặt hàng..." : "Đặt hàng"}
            </button>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Checkout;
