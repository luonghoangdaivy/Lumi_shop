import { useEffect, useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

import { getCart, updateCartItem, removeCartItem } from "../api/cart.api";

import { useCart } from "../context/CartContext";

import "../styles/cart/cart.css";

const API_URL = "http://localhost:4000";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Lấy hàm refresh cart từ CartContext
  const { fetchCart: refreshGlobalCart } = useCart();

  // =========================
  // Lấy giỏ hàng
  // =========================
  const fetchCart = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCart();

      setCart(response?.data || response);
    } catch (error) {
      console.error("Get cart error:", error);

      setError(error.response?.data?.message || "Không thể tải giỏ hàng.");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // Load cart khi mở trang
  // =========================
  useEffect(() => {
    fetchCart();
  }, []);

  const items = cart?.items || [];

  // =========================
  // Lấy hình ảnh sản phẩm
  // =========================
  const getItemImage = (item) => {
    const images = item?.variant?.product?.images || [];

    const primaryImage = images.find((image) => image.is_primary) || images[0];

    return primaryImage?.image_url
      ? `${API_URL}${primaryImage.image_url}`
      : "/placeholder-product.jpg";
  };

  // =========================
  // Lấy giá sản phẩm
  // =========================
  const getItemPrice = (item) => {
    return Number(item?.variant?.product?.price || 0);
  };

  // =========================
  // Tính tạm tính
  // =========================
  const subtotal = items.reduce(
    (total, item) => total + getItemPrice(item) * Number(item.quantity || 0),
    0,
  );

  // =========================
  // Phí vận chuyển
  // =========================
  const shippingFee = items.length > 0 ? 30000 : 0;

  // =========================
  // Tổng tiền
  // =========================
  const total = subtotal + shippingFee;

  // =========================
  // Cập nhật số lượng
  // =========================
  const handleUpdateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;

    try {
      // Cập nhật database
      await updateCartItem(itemId, quantity);

      // Cập nhật cart của trang Cart
      await fetchCart();

      // Cập nhật cart trong CartContext
      // để Header cập nhật số lượng
      await refreshGlobalCart();
    } catch (error) {
      console.error("Update cart item error:", error);

      alert(error.response?.data?.message || "Không thể cập nhật số lượng.");
    }
  };

  // =========================
  // Xóa sản phẩm
  // =========================
  const handleRemoveItem = async (itemId) => {
    const confirmed = window.confirm(
      "Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?",
    );

    if (!confirmed) return;

    try {
      // Xóa khỏi database
      await removeCartItem(itemId);

      // Cập nhật cart của trang Cart
      await fetchCart();

      // Cập nhật cart trong CartContext
      // để Header cập nhật số lượng
      await refreshGlobalCart();
    } catch (error) {
      console.error("Remove cart item error:", error);

      alert(error.response?.data?.message || "Không thể xóa sản phẩm.");
    }
  };

  // =========================
  // Loading
  // =========================
  if (loading) {
    return (
      <>
        <Header />

        <main className="cart-page">
          <div className="container cart-status">Đang tải giỏ hàng...</div>
        </main>

        <Footer />
      </>
    );
  }

  // =========================
  // Error
  // =========================
  if (error) {
    return (
      <>
        <Header />

        <main className="cart-page">
          <div className="container cart-status cart-error">{error}</div>
        </main>

        <Footer />
      </>
    );
  }

  // =========================
  // UI
  // =========================
  return (
    <>
      <Header />

      <main className="cart-page">
        <div className="container">
          {/* Breadcrumb */}
          <div className="cart-breadcrumb">
            <span>Trang chủ</span>
            <span>/</span>
            <span>Giỏ hàng</span>
          </div>

          {/* Heading */}
          <div className="cart-heading">
            <h1>Giỏ hàng</h1>

            <p>{items.length} sản phẩm</p>
          </div>

          {/* Empty cart */}
          {items.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">
                <span>🛍</span>
              </div>

              <h2>Giỏ hàng đang trống</h2>

              <p>
                Hãy khám phá các sản phẩm của LUMI và tìm món đồ yêu thích của
                bạn.
              </p>

              <button
                type="button"
                className="cart-primary-button"
                onClick={() => navigate("/products")}
              >
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            <div className="cart-layout">
              {/* =========================
                  Cart Items
              ========================= */}
              <section className="cart-items">
                <div className="cart-items-header">
                  <span>Sản phẩm</span>
                  <span>Đơn giá</span>
                  <span>Số lượng</span>
                  <span>Thành tiền</span>
                </div>

                {items.map((item) => {
                  const product = item?.variant?.product;

                  const price = getItemPrice(item);

                  const quantity = Number(item.quantity || 0);

                  const itemTotal = price * quantity;

                  return (
                    <article className="cart-item" key={item.id}>
                      {/* =================
                          Product
                      ================= */}
                      <div className="cart-item-product">
                        <div className="cart-item-image">
                          <img
                            src={getItemImage(item)}
                            alt={product?.name || "Sản phẩm"}
                          />
                        </div>

                        <div className="cart-item-info">
                          <h3>{product?.name || "Sản phẩm"}</h3>

                          <div className="cart-item-variant">
                            {item?.variant?.color && (
                              <span>Màu: {item.variant.color}</span>
                            )}

                            {item?.variant?.size && (
                              <span>Size: {item.variant.size}</span>
                            )}
                          </div>

                          {/* Remove trên mobile */}
                          <button
                            type="button"
                            className="cart-remove-mobile"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 size={15} />
                            Xóa
                          </button>
                        </div>
                      </div>

                      {/* =================
                          Price
                      ================= */}
                      <div className="cart-item-price">
                        {price.toLocaleString("vi-VN")}₫
                      </div>

                      {/* =================
                          Quantity
                      ================= */}
                      <div className="cart-item-quantity">
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateQuantity(item.id, quantity - 1)
                          }
                          disabled={quantity <= 1}
                          aria-label="Giảm số lượng"
                        >
                          <Minus size={14} />
                        </button>

                        <span>{quantity}</span>

                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateQuantity(item.id, quantity + 1)
                          }
                          aria-label="Tăng số lượng"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* =================
                          Total
                      ================= */}
                      <div className="cart-item-total">
                        <span>{itemTotal.toLocaleString("vi-VN")}₫</span>

                        <button
                          type="button"
                          className="cart-remove-button"
                          onClick={() => handleRemoveItem(item.id)}
                          aria-label="Xóa sản phẩm"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </article>
                  );
                })}
              </section>

              {/* =========================
                  Order Summary
              ========================= */}
              <aside className="cart-summary">
                <h2>Tóm tắt đơn hàng</h2>

                {/* Subtotal */}
                <div className="cart-summary-row">
                  <span>Tạm tính</span>

                  <strong>{subtotal.toLocaleString("vi-VN")}₫</strong>
                </div>

                {/* Shipping */}
                <div className="cart-summary-row">
                  <span>Phí vận chuyển</span>

                  <strong>{shippingFee.toLocaleString("vi-VN")}₫</strong>
                </div>

                <div className="cart-summary-divider" />

                {/* Total */}
                <div className="cart-summary-total">
                  <span>Tổng cộng</span>

                  <strong>{total.toLocaleString("vi-VN")}₫</strong>
                </div>

                {/* Checkout */}
                <button
                  type="button"
                  className="cart-checkout-button"
                  onClick={() => navigate("/checkout")}
                >
                  Tiến hành thanh toán
                </button>

                {/* Continue shopping */}
                <button
                  type="button"
                  className="cart-continue-button"
                  onClick={() => navigate("/products")}
                >
                  Tiếp tục mua sắm
                </button>
              </aside>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Cart;
