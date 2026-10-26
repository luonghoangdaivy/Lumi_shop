import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getCart } from "../api/cart.api";
import { createOrder } from "../api/order.api";
import { getAddresses, createAddress } from "../api/address.api";
import { getProvinces, getWards } from "../api/location.api";

import "../styles/checkout/checkout.css";

const API_URL = "http://localhost:4000";
const ADD_NEW_ADDRESS = "__add_new_address__";
const SELECTED_CART_KEY = "lumi_selected_cart_item_ids";

const emptyAddressForm = {
  name: "",
  phone: "",
  address: "",
  provinceCode: "",
  provinceName: "",
  wardCode: "",
  wardName: "",
  isDefault: false,
};

function getResponseList(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  if (Array.isArray(response?.data?.data)) {
    return response.data.data;
  }
  return [];
}

function mapAddress(item) {
  return {
    id: item.id,
    name: item.full_name || "",
    phone: item.phone || "",
    address: item.address_line || "",
    provinceCode: item.province_code ?? "",
    provinceName: item.province_name || "",
    wardCode: item.ward_code ?? "",
    wardName: item.ward_name || "",
    fullAddress:
      item.full_address ||
      [item.address_line, item.ward_name, item.province_name]
        .filter(Boolean)
        .join(", "),
    isDefault: Boolean(item.is_default),
    label: item.label || "",
  };
}

function getSelectedCartIds(items) {
  try {
    const saved = sessionStorage.getItem(SELECTED_CART_KEY);

    if (!saved) return [];

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) return [];

    const validIds = parsed
      .map(String)
      .filter((id) => items.some((item) => String(item.id) === id));

    return [...new Set(validIds)];
  } catch (error) {
    console.error("Read selected cart items error:", error);
    return [];
  }
}

function Checkout() {
  const navigate = useNavigate();

  const [cart, setCart] = useState(null);
  const [selectedCartIds, setSelectedCartIds] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState(emptyAddressForm);

  const [provinces, setProvinces] = useState([]);
  const [wards, setWards] = useState([]);

  const [locationLoading, setLocationLoading] = useState(false);
  const [savingAddress, setSavingAddress] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Tải giỏ hàng, danh sách sản phẩm đã chọn và địa chỉ.
  useEffect(() => {
    let active = true;

    async function fetchCheckoutData() {
      setLoading(true);
      setError("");

      try {
        const [cartResponse, addressResponse] = await Promise.all([
          getCart(),
          getAddresses(),
        ]);

        if (!active) return;

        const cartData = cartResponse?.data || cartResponse;
        const cartItems = cartData?.items || [];

        setCart(cartData);

        // Chỉ giữ các ID sản phẩm đã được chọn ở trang giỏ hàng.
        const savedIds = getSelectedCartIds(cartItems);
        setSelectedCartIds(savedIds);

        const mappedAddresses =
          getResponseList(addressResponse).map(mapAddress);

        setAddresses(mappedAddresses);

        const defaultAddress =
          mappedAddresses.find((item) => item.isDefault) || mappedAddresses[0];

        if (defaultAddress) {
          setSelectedAddressId(String(defaultAddress.id));
          setShowNewAddressForm(false);
        } else {
          setSelectedAddressId(ADD_NEW_ADDRESS);
          setShowNewAddressForm(true);
        }

        // Không cho phép thanh toán nếu chưa chọn sản phẩm.
        if (savedIds.length === 0) {
          setError(
            "Bạn chưa chọn sản phẩm để thanh toán. Vui lòng quay lại giỏ hàng và chọn sản phẩm.",
          );
        }
      } catch (fetchError) {
        console.error("Load checkout data error:", fetchError);

        if (active) {
          setError(
            fetchError.response?.data?.message ||
              "Không thể tải giỏ hàng hoặc địa chỉ nhận hàng. Vui lòng thử lại.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    fetchCheckoutData();

    return () => {
      active = false;
    };
  }, []);

  // Tải danh sách tỉnh/thành.
  useEffect(() => {
    let active = true;

    async function fetchProvinceList() {
      try {
        const response = await getProvinces();

        if (active) {
          setProvinces(getResponseList(response));
        }
      } catch (fetchError) {
        console.error("Load provinces error:", fetchError);
      }
    }

    fetchProvinceList();

    return () => {
      active = false;
    };
  }, []);

  const items = cart?.items || [];

  // Danh sách dùng để hiển thị, tính tiền và checkout.
  const selectedItems = useMemo(() => {
    const selectedSet = new Set(selectedCartIds.map(String));

    return items.filter((item) => selectedSet.has(String(item.id)));
  }, [items, selectedCartIds]);

  const selectedAddress = useMemo(
    () =>
      addresses.find(
        (address) => String(address.id) === String(selectedAddressId),
      ),
    [addresses, selectedAddressId],
  );

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

  const subtotal = selectedItems.reduce((sum, item) => {
    return sum + getItemPrice(item) * Number(item.quantity || 0);
  }, 0);

  const shippingFee = selectedItems.length > 0 ? 30000 : 0;
  const total = subtotal + shippingFee;

  const handleAddressSelect = (event) => {
    const value = event.target.value;

    setSelectedAddressId(value);

    if (value === ADD_NEW_ADDRESS) {
      setShowNewAddressForm(true);
      setNewAddressForm(emptyAddressForm);
      setWards([]);
      return;
    }

    setShowNewAddressForm(false);
  };

  const handleNewAddressChange = (event) => {
    const { name, value, options, selectedIndex } = event.target;

    if (name === "provinceCode") {
      const selectedProvince = options[selectedIndex];

      setNewAddressForm((previous) => ({
        ...previous,
        provinceCode: value,
        provinceName: selectedProvince?.dataset?.name || "",
        wardCode: "",
        wardName: "",
      }));

      setWards([]);

      if (value) {
        setLocationLoading(true);

        getWards(value)
          .then((response) => {
            setWards(getResponseList(response));
          })
          .catch((fetchError) => {
            console.error("Load wards error:", fetchError);
            alert("Không thể tải danh sách phường/xã. Vui lòng thử lại.");
          })
          .finally(() => {
            setLocationLoading(false);
          });
      }

      return;
    }

    if (name === "wardCode") {
      const selectedWard = options[selectedIndex];

      setNewAddressForm((previous) => ({
        ...previous,
        wardCode: value,
        wardName: selectedWard?.dataset?.name || "",
      }));

      return;
    }

    setNewAddressForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSaveNewAddress = async () => {
    if (!newAddressForm.name.trim()) {
      alert("Vui lòng nhập họ và tên người nhận.");
      return;
    }

    if (!newAddressForm.phone.trim()) {
      alert("Vui lòng nhập số điện thoại.");
      return;
    }

    if (!newAddressForm.address.trim()) {
      alert("Vui lòng nhập địa chỉ chi tiết.");
      return;
    }

    if (!newAddressForm.provinceCode || !newAddressForm.provinceName) {
      alert("Vui lòng chọn tỉnh/thành phố.");
      return;
    }

    if (!newAddressForm.wardCode || !newAddressForm.wardName) {
      alert("Vui lòng chọn phường/xã.");
      return;
    }

    const payload = {
      label: null,
      full_name: newAddressForm.name.trim(),
      phone: newAddressForm.phone.trim(),
      address_line: newAddressForm.address.trim(),
      province_code: Number(newAddressForm.provinceCode),
      province_name: newAddressForm.provinceName,
      ward_code: Number(newAddressForm.wardCode),
      ward_name: newAddressForm.wardName,
      full_address: [
        newAddressForm.address.trim(),
        newAddressForm.wardName,
        newAddressForm.provinceName,
      ].join(", "),
      is_default: addresses.length === 0 || Boolean(newAddressForm.isDefault),
    };

    try {
      setSavingAddress(true);

      const response = await createAddress(payload);

      if (response?.success === false) {
        throw new Error(response.message || "Không thể lưu địa chỉ.");
      }

      let saved = response?.data?.id
        ? response.data
        : response?.id
          ? response
          : null;

      let nextAddresses;

      if (!saved) {
        const refreshedResponse = await getAddresses();
        const refreshed = getResponseList(refreshedResponse).map(mapAddress);

        const matchingAddress = refreshed.find(
          (item) =>
            item.phone === payload.phone &&
            item.address === payload.address_line,
        );

        nextAddresses = refreshed;

        if (!matchingAddress) {
          throw new Error(
            "Địa chỉ đã gửi nhưng không tìm thấy trong danh sách. Vui lòng tải lại trang.",
          );
        }

        setAddresses(refreshed);
        setSelectedAddressId(String(matchingAddress.id));
      } else {
        const mappedSaved = mapAddress(saved);

        // Bổ sung dữ liệu dự phòng nếu API không trả đủ trường.
        mappedSaved.name = mappedSaved.name || payload.full_name;
        mappedSaved.phone = mappedSaved.phone || payload.phone;
        mappedSaved.address = mappedSaved.address || payload.address_line;
        mappedSaved.provinceName =
          mappedSaved.provinceName || payload.province_name;
        mappedSaved.wardName = mappedSaved.wardName || payload.ward_name;
        mappedSaved.fullAddress =
          mappedSaved.fullAddress || payload.full_address;
        mappedSaved.isDefault = Boolean(payload.is_default);

        nextAddresses = payload.is_default
          ? [
              ...addresses.map((item) => ({
                ...item,
                isDefault: false,
              })),
              mappedSaved,
            ]
          : [...addresses, mappedSaved];

        setAddresses(nextAddresses);
        setSelectedAddressId(String(mappedSaved.id));
      }

      setShowNewAddressForm(false);
      setNewAddressForm(emptyAddressForm);

      alert("Đã lưu địa chỉ nhận hàng.");
    } catch (saveError) {
      console.error("Create address error:", saveError);

      alert(
        saveError.response?.data?.message ||
          saveError.message ||
          "Không thể lưu địa chỉ. Vui lòng thử lại.",
      );
    } finally {
      setSavingAddress(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (selectedItems.length === 0) {
      alert(
        "Bạn chưa chọn sản phẩm để thanh toán. Vui lòng quay lại giỏ hàng.",
      );
      return;
    }

    if (showNewAddressForm || selectedAddressId === ADD_NEW_ADDRESS) {
      alert(
        "Vui lòng lưu địa chỉ mới hoặc chọn một địa chỉ đã lưu trước khi đặt hàng.",
      );
      return;
    }

    if (!selectedAddress) {
      alert("Vui lòng chọn địa chỉ nhận hàng.");
      return;
    }

    if (
      !selectedAddress.name.trim() ||
      !selectedAddress.phone.trim() ||
      !selectedAddress.fullAddress.trim()
    ) {
      alert(
        "Địa chỉ đã chọn thiếu họ tên, số điện thoại hoặc địa chỉ chi tiết. Vui lòng cập nhật trong mục Tài khoản.",
      );
      return;
    }

    try {
      setSubmitting(true);

      // Giữ lại ID đã chọn để tránh đặt nhầm toàn bộ giỏ hàng.
      sessionStorage.setItem(
        SELECTED_CART_KEY,
        JSON.stringify(selectedItems.map((item) => String(item.id))),
      );

      const orderData = {
        shipping_address: selectedAddress.fullAddress,
        shipping_phone: selectedAddress.phone,
        payment_method: "COD",

        // Lưu ý:
        // Backend phải hỗ trợ selected_cart_item_ids thì mới giới hạn
        // được các sản phẩm được tạo trong đơn hàng.
        selected_cart_item_ids: selectedItems.map((item) => item.id),
      };

      const response = await createOrder(orderData);
      const order = response?.data || response;

      navigate("/order-success", {
        state: {
          order,
          selectedCartItemIds: selectedItems.map((item) => item.id),
        },
      });
    } catch (submitError) {
      console.error("Create order error:", submitError);
      console.error("Backend response:", submitError.response?.data);

      alert(
        submitError.response?.data?.message ||
          "Không thể đặt hàng. Vui lòng thử lại.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="checkout-page">
        <div className="container checkout-status">
          Đang tải thông tin thanh toán...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="checkout-page">
        <div className="container">
          <div className="checkout-status checkout-error">{error}</div>

          <button
            type="button"
            className="checkout-back-button"
            onClick={() => navigate("/cart")}
          >
            Quay lại giỏ hàng
          </button>
        </div>
      </main>
    );
  }

  if (selectedItems.length === 0) {
    return (
      <main className="checkout-page">
        <div className="container">
          <div className="checkout-breadcrumb">
            <span>Trang chủ</span>
            <span>/</span>
            <span>Thanh toán</span>
          </div>

          <div className="checkout-empty">
            <h1>Chưa chọn sản phẩm</h1>
            <p>Vui lòng quay lại giỏ hàng và chọn sản phẩm muốn thanh toán.</p>

            <button
              type="button"
              className="checkout-primary-button"
              onClick={() => navigate("/cart")}
            >
              Quay lại giỏ hàng
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <div className="container">
        <div className="checkout-breadcrumb">
          <span>Trang chủ</span>
          <span>/</span>
          <span>Giỏ hàng</span>
          <span>/</span>
          <span>Thanh toán</span>
        </div>

        <div className="checkout-heading">
          <h1>Thanh toán</h1>
          <p>Hoàn tất thông tin để đặt hàng.</p>
        </div>

        <form className="checkout-layout" onSubmit={handleSubmit}>
          <section className="checkout-main">
            <div className="checkout-card">
              <div className="checkout-card-header">
                <h2>Thông tin nhận hàng</h2>
              </div>

              <div className="checkout-form">
                <div className="checkout-form-group">
                  <label htmlFor="saved-address">Chọn địa chỉ nhận hàng</label>

                  <select
                    id="saved-address"
                    value={selectedAddressId}
                    onChange={handleAddressSelect}
                    className="checkout-address-select"
                  >
                    {addresses.length === 0 && (
                      <option value={ADD_NEW_ADDRESS}>
                        + Thêm địa chỉ mới
                      </option>
                    )}

                    {addresses.map((address) => (
                      <option key={address.id} value={String(address.id)}>
                        {address.name} — {address.phone} — {address.fullAddress}
                        {address.isDefault ? " (Mặc định)" : ""}
                      </option>
                    ))}

                    {addresses.length > 0 && (
                      <option value={ADD_NEW_ADDRESS}>
                        + Thêm địa chỉ mới
                      </option>
                    )}
                  </select>
                </div>

                {!showNewAddressForm && selectedAddress && (
                  <div className="checkout-selected-address">
                    <p>
                      <strong>{selectedAddress.name}</strong> ·{" "}
                      {selectedAddress.phone}
                    </p>
                    <p>{selectedAddress.fullAddress}</p>

                    {selectedAddress.isDefault && (
                      <small>Địa chỉ mặc định</small>
                    )}
                  </div>
                )}

                {showNewAddressForm && (
                  <div className="checkout-new-address">
                    <h3>Thêm địa chỉ mới</h3>

                    <div className="checkout-form-group">
                      <label htmlFor="new-address-name">
                        Họ và tên người nhận
                      </label>
                      <input
                        id="new-address-name"
                        name="name"
                        value={newAddressForm.name}
                        onChange={handleNewAddressChange}
                        placeholder="Nhập họ và tên"
                        autoComplete="name"
                      />
                    </div>

                    <div className="checkout-form-group">
                      <label htmlFor="new-address-phone">Số điện thoại</label>
                      <input
                        id="new-address-phone"
                        name="phone"
                        type="tel"
                        value={newAddressForm.phone}
                        onChange={handleNewAddressChange}
                        placeholder="Nhập số điện thoại"
                        autoComplete="tel"
                      />
                    </div>

                    <div className="checkout-form-group">
                      <label htmlFor="new-address-detail">
                        Địa chỉ chi tiết
                      </label>
                      <textarea
                        id="new-address-detail"
                        name="address"
                        value={newAddressForm.address}
                        onChange={handleNewAddressChange}
                        placeholder="Số nhà, tên đường..."
                        rows="3"
                        autoComplete="street-address"
                      />
                    </div>

                    <div className="checkout-form-group">
                      <label htmlFor="new-address-province">
                        Tỉnh/Thành phố
                      </label>
                      <select
                        id="new-address-province"
                        name="provinceCode"
                        value={newAddressForm.provinceCode}
                        onChange={handleNewAddressChange}
                      >
                        <option value="">-- Chọn tỉnh/thành phố --</option>

                        {provinces.map((province) => (
                          <option
                            key={province.code}
                            value={province.code}
                            data-name={province.name}
                          >
                            {province.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="checkout-form-group">
                      <label htmlFor="new-address-ward">Phường/Xã</label>
                      <select
                        id="new-address-ward"
                        name="wardCode"
                        value={newAddressForm.wardCode}
                        onChange={handleNewAddressChange}
                        disabled={
                          !newAddressForm.provinceCode || locationLoading
                        }
                      >
                        <option value="">
                          {locationLoading
                            ? "Đang tải phường/xã..."
                            : "-- Chọn phường/xã --"}
                        </option>

                        {wards.map((ward) => (
                          <option
                            key={ward.code}
                            value={ward.code}
                            data-name={ward.name}
                          >
                            {ward.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <label className="checkout-default-address-option">
                      <input
                        type="checkbox"
                        checked={newAddressForm.isDefault}
                        onChange={(event) =>
                          setNewAddressForm((previous) => ({
                            ...previous,
                            isDefault: event.target.checked,
                          }))
                        }
                      />
                      Đặt làm địa chỉ mặc định
                    </label>

                    <div className="checkout-address-actions">
                      <button
                        type="button"
                        className="checkout-primary-button"
                        onClick={handleSaveNewAddress}
                        disabled={savingAddress || locationLoading}
                      >
                        {savingAddress ? "Đang lưu địa chỉ..." : "Lưu địa chỉ"}
                      </button>

                      {addresses.length > 0 && (
                        <button
                          type="button"
                          className="checkout-back-button"
                          onClick={() => {
                            const fallback =
                              addresses.find((item) => item.isDefault) ||
                              addresses[0];

                            setSelectedAddressId(String(fallback.id));
                            setShowNewAddressForm(false);
                          }}
                        >
                          Hủy
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

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
                    <small>Thanh toán bằng tiền mặt khi nhận được hàng.</small>
                  </span>
                </label>
              </div>
            </div>
          </section>

          <aside className="checkout-summary">
            <div className="checkout-card">
              <div className="checkout-card-header">
                <h2>Đơn hàng</h2>
                <span>{selectedItems.length} sản phẩm được chọn</span>
              </div>

              <div className="checkout-products">
                {selectedItems.map((item) => {
                  const product = item?.variant?.product;
                  const price = getItemPrice(item);
                  const quantity = Number(item.quantity || 0);
                  const itemTotal = price * quantity;

                  return (
                    <div className="checkout-product" key={item.id}>
                      <div className="checkout-product-image">
                        <img
                          src={getItemImage(item)}
                          alt={product?.name || "Sản phẩm"}
                        />
                        <span>{quantity}</span>
                      </div>

                      <div className="checkout-product-info">
                        <h3>{product?.name || "Sản phẩm"}</h3>
                        <p>
                          {item?.variant?.color && `Màu: ${item.variant.color}`}
                          {item?.variant?.color && item?.variant?.size && " • "}
                          {item?.variant?.size && `Size: ${item.variant.size}`}
                        </p>
                      </div>

                      <strong>{itemTotal.toLocaleString("vi-VN")}₫</strong>
                    </div>
                  );
                })}
              </div>

              <div className="checkout-summary-content">
                <div className="checkout-summary-row">
                  <span>Tạm tính</span>
                  <strong>{subtotal.toLocaleString("vi-VN")}₫</strong>
                </div>

                <div className="checkout-summary-row">
                  <span>Phí vận chuyển</span>
                  <strong>{shippingFee.toLocaleString("vi-VN")}₫</strong>
                </div>

                <div className="checkout-summary-divider" />

                <div className="checkout-summary-total">
                  <span>Tổng cộng</span>
                  <strong>{total.toLocaleString("vi-VN")}₫</strong>
                </div>

                <button
                  type="submit"
                  className="checkout-submit-button"
                  disabled={
                    submitting ||
                    savingAddress ||
                    showNewAddressForm ||
                    !selectedAddress ||
                    selectedItems.length === 0
                  }
                >
                  {submitting ? "Đang xử lý..." : "Đặt hàng"}
                </button>

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
  );
}

export default Checkout;
