import { useEffect, useState } from "react";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

import { getCart, updateCartItem, removeCartItem } from "../api/cart.api";

import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:4000";

function Cart() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const fetchCart = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCart();

      console.log("Cart:", response);

      setCart(response.data);
    } catch (error) {
      console.error("Get cart error:", error);

      setError(error.response?.data?.message || "Không thể tải giỏ hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // ==========================
  // UPDATE QUANTITY
  // ==========================

  const handleUpdateQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;

    try {
      await updateCartItem(itemId, quantity);

      await fetchCart();
    } catch (error) {
      console.error("Update cart error:", error);

      alert(error.response?.data?.message || "Không thể cập nhật số lượng");
    }
  };

  // ==========================
  // REMOVE ITEM
  // ==========================

  const handleRemoveItem = async (itemId) => {
    try {
      await removeCartItem(itemId);

      await fetchCart();
    } catch (error) {
      console.error("Remove cart error:", error);

      alert(error.response?.data?.message || "Không thể xóa sản phẩm");
    }
  };

  // ==========================
  // LOADING
  // ==========================

  if (loading) {
    return (
      <>
        <Header />

        <main className="cart-page">
          <div className="container">
            <p>Đang tải giỏ hàng...</p>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // ==========================
  // ERROR
  // ==========================

  if (error) {
    return (
      <>
        <Header />

        <main className="cart-page">
          <div className="container">
            <p>{error}</p>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  const items = cart?.items || [];

  // ==========================
  // TOTAL
  // ==========================

  const total = items.reduce((sum, item) => {
    const price = Number(item.variant?.product?.price || 0);

    return sum + price * item.quantity;
  }, 0);

  return (
    <>
      <Header />

      <main className="cart-page">
        <div className="container">
          <div className="cart-breadcrumb">Trang chủ / Giỏ hàng</div>

          <h1>Giỏ hàng</h1>

          {items.length === 0 ? (
            <div className="cart-empty">
              <h2>Giỏ hàng đang trống</h2>

              <p>Bạn chưa có sản phẩm nào trong giỏ hàng.</p>
            </div>
          ) : (
            <div className="cart-content">
              {/* ======================
                  ITEMS
              ====================== */}

              <div className="cart-items">
                {items.map((item) => {
                  const variant = item.variant;
                  const product = variant?.product;

                  const image =
                    product?.images?.find((image) => image.is_primary) ||
                    product?.images?.[0];

                  const price = Number(product?.price || 0);

                  return (
                    <div className="cart-item" key={item.id}>
                      {/* IMAGE */}

                      <div className="cart-item-image">
                        {image && (
                          <img
                            src={`${API_URL}${image.image_url}`}
                            alt={product?.name}
                          />
                        )}
                      </div>

                      {/* INFO */}

                      <div className="cart-item-info">
                        <h3>{product?.name}</h3>

                        <p>Màu: {variant?.color}</p>

                        <p>Size: {variant?.size}</p>

                        <p>{price.toLocaleString("vi-VN")} ₫</p>
                      </div>

                      {/* QUANTITY */}

                      <div className="cart-item-quantity">
                        <button
                          type="button"
                          disabled={item.quantity <= 1}
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          -
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>

                      {/* SUBTOTAL */}

                      <div className="cart-item-subtotal">
                        {(price * item.quantity).toLocaleString("vi-VN")} ₫
                      </div>

                      {/* REMOVE */}

                      <button
                        type="button"
                        className="cart-item-remove"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        Xóa
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* ======================
                  SUMMARY
              ====================== */}

              <aside className="cart-summary">
                <h2>Tổng đơn hàng</h2>

                <div className="cart-summary-row">
                  <span>Tạm tính</span>

                  <strong>{total.toLocaleString("vi-VN")} ₫</strong>
                </div>

                <div className="cart-summary-row">
                  <span>Phí vận chuyển</span>

                  <span>Tính khi thanh toán</span>
                </div>

                <div className="cart-summary-total">
                  <span>Tổng cộng</span>

                  <strong>{total.toLocaleString("vi-VN")} ₫</strong>
                </div>

                <button
                  type="button"
                  className="checkout-button"
                  onClick={() => navigate("/checkout")}
                >
                  Tiến hành thanh toán
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
