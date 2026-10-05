import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

import { getCart } from "../api/cart.api";
import { createOrder } from "../api/order.api";

import "../styles/checkout/checkout.css";

const API_URL = "http://localhost:4000";

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    receiver_name: "",
    phone: "",
    address: "",
  });

  // =========================
  // GET CART
  // =========================

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getCart();

        setCart(response?.data || response);
      } catch (error) {
        console.error("Get cart error:", error);

        setError(
          error.response?.data?.message || "Không thể tải thông tin giỏ hàng.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  // =========================
  // CART DATA
  // =========================

  const items = cart?.items || [];

  const getItemImage = (item) => {
    const images = item?.variant?.product?.images || [];

    const primaryImage = images.find((image) => image.is_primary) || images[0];

    return primaryImage?.image_url
      ? `${API_URL}${primaryImage.image_url}`
      : "/placeholder-product.jpg";
  };

  const getItemPrice = (item) => {
    return Number(item?.variant?.product?.price || 0);
  };

  const subtotal = items.reduce((total, item) => {
    const price = getItemPrice(item);
    const quantity = Number(item.quantity || 0);

    return total + price * quantity;
  }, 0);

  const shippingFee = items.length > 0 ? 30000 : 0;

  const total = subtotal + shippingFee;

  // =========================
  // HANDLE FORM
  // =========================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // CREATE ORDER
  // =========================

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Validate họ tên
    if (!formData.receiver_name.trim()) {
      alert("Vui lòng nhập họ tên người nhận.");
      return;
    }

    // Validate số điện thoại
    if (!formData.phone.trim()) {
      alert("Vui lòng nhập số điện thoại.");
      return;
    }

    // Validate địa chỉ
    if (!formData.address.trim()) {
      alert("Vui lòng nhập địa chỉ nhận hàng.");
      return;
    }

    try {
      setSubmitting(true);

      // =========================
      // DATA GỬI BACKEND
      // =========================

      const orderData = {
        shipping_address: formData.address,
        shipping_phone: formData.phone,
        payment_method: "COD",
      };

      console.log("Order data:", orderData);

      const response = await createOrder(orderData);

      console.log("Order response:", response);

      const order = response?.data || response;

      // Chuyển sang trang đặt hàng thành công
      navigate("/order-success", {
        state: {
          order,
        },
      });
    } catch (error) {
      console.error("Create order error:", error);

      console.error("Backend response:", error.response?.data);

      alert(
        error.response?.data?.message ||
          "Không thể đặt hàng. Vui lòng thử lại.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <>
        <Header />

        <main className="checkout-page">
          <div className="container checkout-status">
            Đang tải thông tin thanh toán...
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <>
        <Header />

        <main className="checkout-page">
          <div className="container checkout-status checkout-error">
            {error}
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // =========================
  // EMPTY CART
  // =========================

  if (items.length === 0) {
    return (
      <>
        <Header />

        <main className="checkout-page">
          <div className="container">
            <div className="checkout-breadcrumb">
              <span>Trang chủ</span>
              <span>/</span>
              <span>Thanh toán</span>
            </div>

            <div className="checkout-empty">
              <h1>Giỏ hàng đang trống</h1>

              <p>Bạn cần có sản phẩm trong giỏ hàng trước khi thanh toán.</p>

              <button
                type="button"
                className="checkout-primary-button"
                onClick={() => navigate("/products")}
              >
                Tiếp tục mua sắm
              </button>
            </div>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // =========================
  // CHECKOUT
  // =========================

  return (
    <>
      <Header />

      <main className="checkout-page">
        <div className="container">
          {/* BREADCRUMB */}

          <div className="checkout-breadcrumb">
            <span>Trang chủ</span>
            <span>/</span>
            <span>Giỏ hàng</span>
            <span>/</span>
            <span>Thanh toán</span>
          </div>

          {/* HEADING */}

          <div className="checkout-heading">
            <h1>Thanh toán</h1>

            <p>Hoàn tất thông tin để đặt hàng.</p>
          </div>

          <form className="checkout-layout" onSubmit={handleSubmit}>
            {/* =================================
                LEFT
            ================================= */}

            <section className="checkout-main">
              {/* THÔNG TIN NHẬN HÀNG */}

              <div className="checkout-card">
                <div className="checkout-card-header">
                  <h2>Thông tin nhận hàng</h2>
                </div>

                <div className="checkout-form">
                  {/* HỌ TÊN */}

                  <div className="checkout-form-group">
                    <label htmlFor="receiver_name">Họ và tên</label>

                    <input
                      id="receiver_name"
                      name="receiver_name"
                      type="text"
                      value={formData.receiver_name}
                      onChange={handleChange}
                      placeholder="Nhập họ và tên"
                    />
                  </div>

                  {/* SỐ ĐIỆN THOẠI */}

                  <div className="checkout-form-group">
                    <label htmlFor="phone">Số điện thoại</label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Nhập số điện thoại"
                    />
                  </div>

                  {/* ĐỊA CHỈ */}

                  <div className="checkout-form-group">
                    <label htmlFor="address">Địa chỉ nhận hàng</label>

                    <textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Nhập địa chỉ nhận hàng"
                      rows="4"
                    />
                  </div>
                </div>
              </div>

              {/* PHƯƠNG THỨC THANH TOÁN */}

              <div className="checkout-card">
                <div className="checkout-card-header">
                  <h2>Phương thức thanh toán</h2>
                </div>

                <div className="checkout-payment">
                  <label className="checkout-payment-option">
                    <input
                      type="radio"
                      name="payment"
                      value="COD"
                      defaultChecked
                    />

                    <span className="checkout-payment-content">
                      <strong>Thanh toán khi nhận hàng</strong>

                      <small>
                        Thanh toán bằng tiền mặt khi nhận được hàng.
                      </small>
                    </span>
                  </label>
                </div>
              </div>
            </section>

            {/* =================================
                RIGHT
            ================================= */}

            <aside className="checkout-summary">
              <div className="checkout-card">
                {/* HEADER */}

                <div className="checkout-card-header">
                  <h2>Đơn hàng</h2>

                  <span>{items.length} sản phẩm</span>
                </div>

                {/* PRODUCTS */}

                <div className="checkout-products">
                  {items.map((item) => {
                    const product = item?.variant?.product;

                    const price = getItemPrice(item);

                    const quantity = Number(item.quantity || 0);

                    const itemTotal = price * quantity;

                    return (
                      <div className="checkout-product" key={item.id}>
                        {/* IMAGE */}

                        <div className="checkout-product-image">
                          <img
                            src={getItemImage(item)}
                            alt={product?.name || "Sản phẩm"}
                          />

                          <span>{quantity}</span>
                        </div>

                        {/* INFO */}

                        <div className="checkout-product-info">
                          <h3>{product?.name || "Sản phẩm"}</h3>

                          <p>
                            {item?.variant?.color &&
                              `Màu: ${item.variant.color}`}

                            {item?.variant?.color &&
                              item?.variant?.size &&
                              " • "}

                            {item?.variant?.size &&
                              `Size: ${item.variant.size}`}
                          </p>
                        </div>

                        {/* PRICE */}

                        <strong>{itemTotal.toLocaleString("vi-VN")}₫</strong>
                      </div>
                    );
                  })}
                </div>

                {/* SUMMARY */}

                <div className="checkout-summary-content">
                  {/* SUBTOTAL */}

                  <div className="checkout-summary-row">
                    <span>Tạm tính</span>

                    <strong>{subtotal.toLocaleString("vi-VN")}₫</strong>
                  </div>

                  {/* SHIPPING */}

                  <div className="checkout-summary-row">
                    <span>Phí vận chuyển</span>

                    <strong>{shippingFee.toLocaleString("vi-VN")}₫</strong>
                  </div>

                  <div className="checkout-summary-divider" />

                  {/* TOTAL */}

                  <div className="checkout-summary-total">
                    <span>Tổng cộng</span>

                    <strong>{total.toLocaleString("vi-VN")}₫</strong>
                  </div>

                  {/* SUBMIT */}

                  <button
                    type="submit"
                    className="checkout-submit-button"
                    disabled={submitting}
                  >
                    {submitting ? "Đang xử lý..." : "Đặt hàng"}
                  </button>

                  {/* BACK */}

                  <button
                    type="button"
                    className="checkout-back-button"
                    onClick={() => navigate("/cart")}
                  >
                    Quay lại giỏ hàng
                  </button>
                </div>
              </div>
            </aside>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Checkout;
