import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  User as UserIcon,
  MapPin,
  Package,
  Heart,
  LogOut,
  Camera,
  Mail,
  Phone,
  ChevronRight,
  Home,
  Plus,
  Pencil,
  Trash2,
  Star,
  X,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

import { updateMe } from "../api/auth.api";
import { getOrders } from "../api/order.api";
import { getProvinces, getWards } from "../api/location.api";

import {
  getAddresses,
  createAddress,
  updateAddress,
  setDefaultAddress,
  deleteAddress,
} from "../api/address.api";

import "../styles/user/user.css";

const User = () => {
  const navigate = useNavigate();

  const { user, setUser, logout, checkAuth } = useAuth();

  // ========================================
  // TAB
  // ========================================

  const [activeTab, setActiveTab] = useState("profile");

  // ========================================
  // PROFILE
  // ========================================

  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const [profileLoading, setProfileLoading] = useState(false);

  // ========================================
  // AVATAR
  // ========================================

  const [avatar, setAvatar] = useState("");

  // ========================================
  // ADDRESS
  // ========================================

  const [addresses, setAddresses] = useState([]);

  const [showAddressModal, setShowAddressModal] = useState(false);

  const [editingAddressId, setEditingAddressId] = useState(null);

  const [addressForm, setAddressForm] = useState({
    name: "",
    phone: "",
    address: "",
    provinceCode: "",
    provinceName: "",
    wardCode: "",
    wardName: "",
    isDefault: false,
  });

  const [addressLoading, setAddressLoading] = useState(false);

  // ========================================
  // LOCATION
  // ========================================

  const [provinces, setProvinces] = useState([]);

  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");

  const [selectedWard, setSelectedWard] = useState("");

  const [locationLoading, setLocationLoading] = useState(false);

  // ========================================
  // ORDERS
  // ========================================

  const [orders, setOrders] = useState([]);

  const [ordersLoading, setOrdersLoading] = useState(false);

  // ========================================
  // LOAD ADDRESSES FROM DATABASE
  // ========================================

  const loadAddresses = async () => {
    try {
      setAddressLoading(true);

      const response = await getAddresses();

      console.log("GET ADDRESSES RESPONSE:", response);

      const data = response?.data || [];

      if (!Array.isArray(data)) {
        setAddresses([]);
        return;
      }

      // DB format -> UI format
      const mappedAddresses = data.map((item) => ({
        id: item.id,

        name: item.full_name || "",

        phone: item.phone || "",

        address: item.address_line || "",

        provinceCode: item.province_code || "",

        provinceName: item.province_name || "",

        wardCode: item.ward_code || "",

        wardName: item.ward_name || "",

        fullAddress: item.full_address || "",

        isDefault: Boolean(item.is_default),

        label: item.label || "",
      }));

      setAddresses(mappedAddresses);

      // Nếu hồ sơ chưa có địa chỉ hoặc địa chỉ cũ không còn tồn tại,
      // ưu tiên chọn địa chỉ mặc định trong danh sách đã lưu.
      setProfileForm((prev) => {
        const currentAddressExists = mappedAddresses.some((item) => {
          const fullAddress =
            item.fullAddress ||
            [item.address, item.wardName, item.provinceName]
              .filter(Boolean)
              .join(", ");
          return fullAddress === prev.address;
        });

        if (currentAddressExists) return prev;

        const defaultAddress = mappedAddresses.find((item) => item.isDefault);
        const fullAddress = defaultAddress
          ? defaultAddress.fullAddress ||
            [
              defaultAddress.address,
              defaultAddress.wardName,
              defaultAddress.provinceName,
            ]
              .filter(Boolean)
              .join(", ")
          : "";

        return { ...prev, address: fullAddress };
      });
    } catch (error) {
      console.error("GET ADDRESSES ERROR:", error);

      console.error("STATUS:", error?.response?.status);

      console.error("DATA:", error?.response?.data);

      setAddresses([]);
    } finally {
      setAddressLoading(false);
    }
  };

  // ========================================
  // LOAD PROVINCES
  // ========================================

  const loadProvinces = async () => {
    try {
      setLocationLoading(true);

      const response = await getProvinces();

      const data = response?.data || response || [];

      setProvinces(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("LỖI LẤY TỈNH/THÀNH:", error);

      setProvinces([]);
    } finally {
      setLocationLoading(false);
    }
  };

  // ========================================
  // INIT
  // ========================================

  useEffect(() => {
    if (!user) return;

    setProfileForm({
      name: user.name || user.username || "",
      phone: user.phone || "",
      address: user.address || "",
    });

    // Avatar vẫn dùng localStorage
    const savedAvatar = localStorage.getItem(`userAvatar_${user.id}`);

    if (savedAvatar) {
      setAvatar(savedAvatar);
    } else {
      setAvatar("");
    }

    // Địa chỉ lấy từ DATABASE
    loadAddresses();

    // Load tỉnh/thành
    loadProvinces();
  }, [user]);

  // ========================================
  // LOAD WARDS
  // ========================================

  const loadWards = async (provinceCode) => {
    if (!provinceCode) {
      setWards([]);
      return [];
    }

    try {
      setLocationLoading(true);

      const response = await getWards(provinceCode);

      const data = response?.data || response || [];

      setWards(Array.isArray(data) ? data : []);

      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("LỖI LẤY PHƯỜNG/XÃ:", error);

      setWards([]);

      return [];
    } finally {
      setLocationLoading(false);
    }
  };

  // ========================================
  // PROFILE
  // ========================================

  const handleProfileChange = (e) => {
    const { name, value } = e.target;

    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!profileForm.name.trim()) {
      alert("Vui lòng nhập họ và tên");

      return;
    }

    try {
      setProfileLoading(true);

      const response = await updateMe({
        name: profileForm.name.trim(),

        phone: profileForm.phone.trim(),

        address: profileForm.address.trim(),
      });

      if (response?.success === false) {
        throw new Error(response.message || "Cập nhật thông tin thất bại");
      }

      alert("Cập nhật thông tin thành công");

      await checkAuth();
    } catch (error) {
      console.error("UPDATE PROFILE ERROR:", error);

      alert(
        error?.response?.data?.message ||
          error?.message ||
          "Không thể cập nhật thông tin",
      );
    } finally {
      setProfileLoading(false);
    }
  };

  // ========================================
  // AVATAR
  // ========================================

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];

    if (!file || !user) return;

    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file hình ảnh");

      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const image = reader.result;

      setAvatar(image);

      localStorage.setItem(`userAvatar_${user.id}`, image);
    };

    reader.readAsDataURL(file);
  };

  // ========================================
  // ADDRESS - ADD
  // ========================================

  const handleAddAddress = () => {
    setEditingAddressId(null);

    setAddressForm({
      name: user?.name || user?.username || "",

      phone: user?.phone || "",

      address: "",

      provinceCode: "",

      provinceName: "",

      wardCode: "",

      wardName: "",

      isDefault: addresses.length === 0,
    });

    setSelectedProvince("");

    setSelectedWard("");

    setWards([]);

    setShowAddressModal(true);
  };

  // ========================================
  // ADDRESS - PROVINCE CHANGE
  // ========================================

  const handleProvinceChange = async (e) => {
    const provinceCode = e.target.value;

    setSelectedProvince(provinceCode);

    setSelectedWard("");

    setWards([]);

    const province = provinces.find(
      (item) => String(item.code) === String(provinceCode),
    );

    setAddressForm((prev) => ({
      ...prev,

      provinceCode,

      provinceName: province?.name || "",

      wardCode: "",

      wardName: "",
    }));

    if (!provinceCode) return;

    await loadWards(provinceCode);
  };

  // ========================================
  // ADDRESS - WARD CHANGE
  // ========================================

  const handleWardChange = (e) => {
    const wardCode = e.target.value;

    setSelectedWard(wardCode);

    const ward = wards.find((item) => String(item.code) === String(wardCode));

    setAddressForm((prev) => ({
      ...prev,

      wardCode,

      wardName: ward?.name || "",
    }));
  };

  // ========================================
  // ADDRESS - EDIT
  // ========================================

  const handleEditAddress = async (address) => {
    setEditingAddressId(address.id);

    setAddressForm({
      name: address.name || "",

      phone: address.phone || "",

      address: address.address || "",

      provinceCode: address.provinceCode || "",

      provinceName: address.provinceName || "",

      wardCode: address.wardCode || "",

      wardName: address.wardName || "",

      isDefault: Boolean(address.isDefault),
    });

    setSelectedProvince(address.provinceCode || "");

    setSelectedWard(address.wardCode || "");

    setShowAddressModal(true);

    if (address.provinceCode) {
      await loadWards(address.provinceCode);
    }
  };

  // ========================================
  // ADDRESS - SAVE TO DATABASE
  // ========================================

  const handleSaveAddress = async (e) => {
    e.preventDefault();

    // -------------------------
    // Validate
    // -------------------------

    if (!addressForm.name.trim()) {
      alert("Vui lòng nhập họ và tên");

      return;
    }

    if (!addressForm.phone.trim()) {
      alert("Vui lòng nhập số điện thoại");

      return;
    }

    if (!/^0\d{9}$/.test(addressForm.phone.trim())) {
      alert("Số điện thoại phải gồm 10 số và bắt đầu bằng 0");

      return;
    }

    if (!addressForm.address.trim()) {
      alert("Vui lòng nhập địa chỉ chi tiết");

      return;
    }

    if (!addressForm.provinceCode) {
      alert("Vui lòng chọn tỉnh/thành");

      return;
    }

    if (!addressForm.wardCode) {
      alert("Vui lòng chọn phường/xã");

      return;
    }

    if (!addressForm.wardName) {
      alert("Không xác định được phường/xã");

      return;
    }

    if (!addressForm.provinceName) {
      alert("Không xác định được tỉnh/thành");

      return;
    }

    // -------------------------
    // Full address
    // -------------------------

    const fullAddress =
      `${addressForm.address.trim()}, ` +
      `${addressForm.wardName}, ` +
      `${addressForm.provinceName}`;

    // -------------------------
    // Data gửi Backend
    // -------------------------

    const addressData = {
      label: null,

      full_name: addressForm.name.trim(),

      phone: addressForm.phone.trim(),

      address_line: addressForm.address.trim(),

      province_code: Number(addressForm.provinceCode),

      province_name: addressForm.provinceName,

      ward_code: Number(addressForm.wardCode),

      ward_name: addressForm.wardName,

      full_address: fullAddress,

      is_default: Boolean(addressForm.isDefault),
    };

    try {
      setAddressLoading(true);

      let response;

      // =========================
      // UPDATE
      // =========================

      if (editingAddressId) {
        response = await updateAddress(editingAddressId, addressData);

        console.log("UPDATE ADDRESS RESPONSE:", response);

        alert("Cập nhật địa chỉ thành công");
      }

      // =========================
      // CREATE
      // =========================
      else {
        response = await createAddress(addressData);

        console.log("CREATE ADDRESS RESPONSE:", response);

        alert("Thêm địa chỉ thành công");
      }

      // =========================
      // Load lại từ DATABASE
      // =========================

      await loadAddresses();

      // =========================
      // Close modal
      // =========================

      setShowAddressModal(false);

      setEditingAddressId(null);

      setWards([]);

      setSelectedProvince("");

      setSelectedWard("");
    } catch (error) {
      console.error("SAVE ADDRESS ERROR:", error);

      console.error("STATUS:", error?.response?.status);

      console.error("DATA:", error?.response?.data);

      alert(error?.response?.data?.message || "Không thể lưu địa chỉ");
    } finally {
      setAddressLoading(false);
    }
  };

  // ========================================
  // ADDRESS - SET DEFAULT
  // ========================================

  const handleSetDefaultAddress = async (id) => {
    try {
      setAddressLoading(true);

      const response = await setDefaultAddress(id);

      console.log("SET DEFAULT ADDRESS RESPONSE:", response);

      await loadAddresses();

      alert("Đã đặt địa chỉ mặc định");
    } catch (error) {
      console.error("SET DEFAULT ADDRESS ERROR:", error);

      console.error("STATUS:", error?.response?.status);

      console.error("DATA:", error?.response?.data);

      alert(error?.response?.data?.message || "Không thể đặt địa chỉ mặc định");
    } finally {
      setAddressLoading(false);
    }
  };

  // ========================================
  // ADDRESS - DELETE
  // ========================================

  const handleDeleteAddress = async (id) => {
    const address = addresses.find((item) => item.id === id);

    if (!address) return;

    const confirmed = window.confirm("Bạn có chắc muốn xóa địa chỉ này?");

    if (!confirmed) return;

    try {
      setAddressLoading(true);

      const response = await deleteAddress(id);

      console.log("DELETE ADDRESS RESPONSE:", response);

      await loadAddresses();

      alert("Xóa địa chỉ thành công");
    } catch (error) {
      console.error("DELETE ADDRESS ERROR:", error);

      console.error("STATUS:", error?.response?.status);

      console.error("DATA:", error?.response?.data);

      alert(error?.response?.data?.message || "Không thể xóa địa chỉ");
    } finally {
      setAddressLoading(false);
    }
  };

  // ========================================
  // ORDERS
  // ========================================

  const loadOrders = async () => {
    try {
      setOrdersLoading(true);

      const response = await getOrders();

      const data = response?.data || response || [];

      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("GET ORDERS ERROR:", error);

      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "orders" && user) {
      loadOrders();
    }
  }, [activeTab, user]);

  // ========================================
  // LOGOUT
  // ========================================

  const handleLogout = () => {
    const confirmed = window.confirm("Bạn có chắc muốn đăng xuất?");

    if (!confirmed) return;

    logout();

    navigate("/login");
  };

  // ========================================
  // ORDER STATUS
  // ========================================

  const getOrderStatusText = (status) => {
    const statusMap = {
      PENDING: "Chờ xác nhận",

      CONFIRMED: "Đã xác nhận",

      SHIPPING: "Đang giao",

      DELIVERED: "Đã giao",

      CANCELLED: "Đã hủy",
    };

    return statusMap[status] || status;
  };

  // ========================================
  // ORDER STATUS CLASS
  // ========================================

  const getOrderStatusClass = (status) => {
    return status?.toLowerCase().replace("_", "-") || "";
  };

  // ========================================
  // NOT LOGIN
  // ========================================

  if (!user) {
    return (
      <div className="user-page">
        <div className="user-empty">
          <h2>Bạn chưa đăng nhập</h2>

          <button onClick={() => navigate("/login")}>Đăng nhập</button>
        </div>
      </div>
    );
  }

  // ========================================
  // RENDER
  // ========================================

  return (
    <div className="user-page">
      <div className="user-dashboard">
        {/* ==================================
            SIDEBAR
        ================================== */}

        <aside className="user-sidebar">
          {/* Avatar */}

          <div className="user-sidebar-profile">
            <div className="user-avatar">
              {avatar ? (
                <img src={avatar} alt="Avatar" />
              ) : (
                <UserIcon size={36} />
              )}

              <label className="avatar-camera" htmlFor="avatar-upload">
                <Camera size={14} />
              </label>

              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                hidden
              />
            </div>

            <div>
              <strong>{user.name || user.username}</strong>

              <span>{user.email}</span>
            </div>
          </div>

          {/* Navigation */}

          <nav className="user-sidebar-nav">
            <button
              className={activeTab === "profile" ? "active" : ""}
              onClick={() => setActiveTab("profile")}
            >
              <UserIcon size={18} />

              <span>Thông tin cá nhân</span>

              <ChevronRight size={15} />
            </button>

            <button
              className={activeTab === "address" ? "active" : ""}
              onClick={() => setActiveTab("address")}
            >
              <MapPin size={18} />

              <span>Địa chỉ</span>

              <ChevronRight size={15} />
            </button>

            <button
              className={activeTab === "orders" ? "active" : ""}
              onClick={() => setActiveTab("orders")}
            >
              <Package size={18} />

              <span>Đơn hàng</span>

              <ChevronRight size={15} />
            </button>

            <button onClick={() => navigate("/favorites")}>
              <Heart size={18} />

              <span>Yêu thích</span>

              <ChevronRight size={15} />
            </button>
          </nav>

          {/* Logout */}

          <button className="user-logout" onClick={handleLogout}>
            <LogOut size={18} />

            <span>Đăng xuất</span>
          </button>
        </aside>

        {/* ==================================
            MAIN CONTENT
        ================================== */}

        <main className="user-content">
          {/* =================================
              PROFILE
          ================================= */}

          {activeTab === "profile" && (
            <section className="user-panel">
              <div className="user-panel-header">
                <div>
                  <h1>Thông tin cá nhân</h1>

                  <p>Quản lý thông tin tài khoản của bạn</p>
                </div>
              </div>

              <form className="profile-form" onSubmit={handleUpdateProfile}>
                <div className="profile-form-grid">
                  <div className="form-group">
                    <label>Tên người dùng</label>

                    <div className="input-with-icon">
                      <UserIcon size={17} />

                      <input
                        value={user.name || user.username || ""}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Email</label>

                    <div className="input-with-icon">
                      <Mail size={17} />

                      <input value={user.email || ""} disabled />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Họ và tên</label>

                    <div className="input-with-icon">
                      <UserIcon size={17} />

                      <input
                        name="name"
                        value={profileForm.name}
                        onChange={handleProfileChange}
                        placeholder="Nhập họ và tên"
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Số điện thoại</label>

                    <div className="input-with-icon">
                      <Phone size={17} />

                      <input
                        name="phone"
                        value={profileForm.phone}
                        onChange={handleProfileChange}
                        placeholder="Nhập số điện thoại"
                      />
                    </div>
                  </div>

                  <div className="form-group full">
                    <label>Địa chỉ</label>

                    <div className="input-with-icon profile-address-select">
                      <Home size={17} />

                      <select
                        name="address"
                        value={profileForm.address}
                        onChange={handleProfileChange}
                        disabled={addressLoading || addresses.length === 0}
                      >
                        <option value="">
                          {addressLoading
                            ? "Đang tải địa chỉ..."
                            : addresses.length === 0
                              ? "Bạn chưa có địa chỉ đã lưu"
                              : "Chọn địa chỉ giao hàng"}
                        </option>

                        {addresses.map((address) => {
                          const fullAddress =
                            address.fullAddress ||
                            [
                              address.address,
                              address.wardName,
                              address.provinceName,
                            ]
                              .filter(Boolean)
                              .join(", ");

                          if (!fullAddress) return null;

                          return (
                            <option key={address.id} value={fullAddress}>
                              {address.label ? `${address.label} - ` : ""}
                              {fullAddress}
                              {address.isDefault ? " (Mặc định)" : ""}
                            </option>
                          );
                        })}
                      </select>
                    </div>

                    {addresses.length === 0 && !addressLoading && (
                      <p className="profile-address-hint">
                        Hãy thêm địa chỉ trong mục Địa chỉ để chọn tại đây.
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="profile-save-btn"
                  disabled={profileLoading}
                >
                  {profileLoading ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </form>
            </section>
          )}

          {/* =================================
              ADDRESS
          ================================= */}

          {activeTab === "address" && (
            <section className="user-panel">
              <div className="user-panel-header address-header">
                <div>
                  <h1>Địa chỉ giao hàng</h1>

                  <p>Quản lý các địa chỉ nhận hàng của bạn</p>
                </div>

                <button
                  className="add-address-btn"
                  onClick={handleAddAddress}
                  disabled={addressLoading}
                >
                  <Plus size={17} />
                  Thêm địa chỉ
                </button>
              </div>

              {/* Loading */}

              {addressLoading && addresses.length === 0 && (
                <div className="user-loading">Đang tải địa chỉ...</div>
              )}

              {/* Address list */}

              <div className="address-list">
                {!addressLoading && addresses.length === 0 ? (
                  <div className="empty-address">
                    <MapPin size={42} />

                    <h3>Chưa có địa chỉ</h3>

                    <p>Thêm địa chỉ để thuận tiện cho việc đặt hàng</p>

                    <button onClick={handleAddAddress}>
                      <Plus size={16} />
                      Thêm địa chỉ
                    </button>
                  </div>
                ) : (
                  addresses.map((address) => (
                    <div
                      className={`address-card ${
                        address.isDefault ? "default" : ""
                      }`}
                      key={address.id}
                    >
                      <div className="address-card-header">
                        <div className="address-person">
                          <strong>{address.name}</strong>

                          <span>{address.phone}</span>
                        </div>

                        {address.isDefault && (
                          <span className="default-badge">Mặc định</span>
                        )}
                      </div>

                      <div className="address-card-body">
                        <MapPin size={17} />

                        <p>{address.fullAddress || address.address}</p>
                      </div>

                      <div className="address-card-actions">
                        {!address.isDefault && (
                          <button
                            onClick={() => handleSetDefaultAddress(address.id)}
                            disabled={addressLoading}
                          >
                            <Star size={15} />
                            Đặt mặc định
                          </button>
                        )}

                        <button
                          onClick={() => handleEditAddress(address)}
                          disabled={addressLoading}
                        >
                          <Pencil size={15} />
                          Sửa
                        </button>

                        <button
                          className="danger"
                          onClick={() => handleDeleteAddress(address.id)}
                          disabled={addressLoading}
                        >
                          <Trash2 size={15} />
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

          {/* =================================
              ORDERS
          ================================= */}

          {activeTab === "orders" && (
            <section className="user-panel">
              <div className="user-panel-header">
                <div>
                  <h1>Đơn hàng của tôi</h1>
                  <p>Theo dõi và quản lý các đơn hàng của bạn</p>
                </div>
              </div>

              {ordersLoading ? (
                <div className="user-loading">Đang tải đơn hàng...</div>
              ) : orders.length === 0 ? (
                <div className="empty-orders">
                  <Package size={42} />
                  <h3>Chưa có đơn hàng</h3>
                  <p>Bạn chưa có đơn hàng nào</p>

                  <button onClick={() => navigate("/products")}>
                    Mua sắm ngay
                  </button>
                </div>
              ) : (
                <div className="user-orders-list">
                  {orders.map((order) => {
                    const items = order.items || [];

                    const getProductImage = (item) => {
                      const product =
                        item?.variant?.product ||
                        item?.product ||
                        item?.variant?.Product;

                      const images = product?.images || product?.Images || [];

                      const primaryImage =
                        images.find((image) => image.is_primary) || images[0];

                      const imageUrl =
                        item.image_url ||
                        primaryImage?.image_url ||
                        product?.image_url;

                      if (!imageUrl) return "/placeholder-product.jpg";

                      return imageUrl.startsWith("http")
                        ? imageUrl
                        : `http://localhost:4000${imageUrl}`;
                    };

                    const getProductName = (item) => {
                      return (
                        item.product_name ||
                        item?.variant?.product?.name ||
                        item?.product?.name ||
                        item?.variant?.Product?.name ||
                        "Sản phẩm"
                      );
                    };

                    const formatPrice = (price) =>
                      `${Number(price || 0).toLocaleString("vi-VN")}₫`;

                    const statusLabels = {
                      PENDING: "Chờ xác nhận",
                      CONFIRMED: "Đã xác nhận",
                      SHIPPING: "Đang giao hàng",
                      DELIVERED: "Đã giao hàng",
                      CANCELLED: "Đã hủy",
                    };

                    const statusClass =
                      order.status?.toLowerCase().replace("_", "-") ||
                      "default";

                    return (
                      <article className="user-order-card" key={order.id}>
                        {/* Header */}
                        <div className="user-order-header">
                          <div className="user-order-code">
                            <span>Mã đơn hàng</span>
                            <strong>
                              {order.order_code || `#${order.id}`}
                            </strong>
                          </div>

                          <span className={`user-order-status ${statusClass}`}>
                            {statusLabels[order.status] ||
                              order.status ||
                              "Không xác định"}
                          </span>
                        </div>

                        {/* Ngày đặt */}
                        <div className="user-order-date">
                          Ngày đặt:{" "}
                          {order.created_at
                            ? new Date(order.created_at).toLocaleDateString(
                                "vi-VN",
                              )
                            : "--"}
                        </div>

                        {/* Sản phẩm */}
                        <div className="user-order-products">
                          {items.length > 0 ? (
                            items.map((item, index) => (
                              <div
                                className="user-order-product"
                                key={item.id || `${order.id}-${index}`}
                              >
                                <img
                                  className="user-order-product-image"
                                  src={getProductImage(item)}
                                  alt={getProductName(item)}
                                  onError={(event) => {
                                    event.currentTarget.onerror = null;
                                    event.currentTarget.src =
                                      "/placeholder-product.jpg";
                                  }}
                                />

                                <div className="user-order-product-info">
                                  <h3>{getProductName(item)}</h3>

                                  {(item.color || item.size) && (
                                    <p>
                                      {item.color && `Màu: ${item.color}`}
                                      {item.color && item.size && " · "}
                                      {item.size && `Size: ${item.size}`}
                                    </p>
                                  )}

                                  <span>Số lượng: {item.quantity || 1}</span>
                                </div>

                                <strong className="user-order-product-price">
                                  {formatPrice(
                                    Number(item.price || 0) *
                                      Number(item.quantity || 1),
                                  )}
                                </strong>
                              </div>
                            ))
                          ) : (
                            <p className="user-order-no-products">
                              Chưa có thông tin sản phẩm trong đơn hàng.
                            </p>
                          )}
                        </div>

                        {/* Footer */}
                        <div className="user-order-footer">
                          <div className="user-order-total">
                            <span>Tổng tiền</span>
                            <strong>{formatPrice(order.total_amount)}</strong>
                          </div>

                          <button
                            type="button"
                            className="user-order-detail-button"
                            onClick={() => navigate(`/orders/${order.id}`)}
                          >
                            Xem chi tiết
                            <ChevronRight size={17} />
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          )}
        </main>
      </div>

      {/* ======================================
          ADDRESS MODAL
      ====================================== */}

      {showAddressModal && (
        <div
          className="address-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddressModal(false);
            }
          }}
        >
          <div className="address-modal">
            {/* Header */}

            <div className="address-modal-header">
              <div>
                <h2>
                  {editingAddressId ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ mới"}
                </h2>

                <p>Nhập thông tin giao hàng</p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={() => setShowAddressModal(false)}
              >
                <X size={20} />
              </button>
            </div>

            {/* Form */}

            <form onSubmit={handleSaveAddress}>
              {/* Name */}

              <div className="form-group">
                <label>Họ và tên</label>

                <input
                  type="text"
                  value={addressForm.name}
                  onChange={(e) =>
                    setAddressForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="Nhập họ và tên"
                />
              </div>

              {/* Phone */}

              <div className="form-group">
                <label>Số điện thoại</label>

                <input
                  type="text"
                  value={addressForm.phone}
                  onChange={(e) =>
                    setAddressForm((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  placeholder="Nhập số điện thoại"
                />
              </div>

              {/* Province + Ward */}

              <div className="address-form-grid">
                {/* Province */}

                <div className="form-group">
                  <label>Tỉnh / Thành phố</label>

                  <div className="select-wrapper">
                    <select
                      value={selectedProvince}
                      onChange={handleProvinceChange}
                    >
                      <option value="">Chọn tỉnh / thành phố</option>

                      {provinces.map((province) => (
                        <option key={province.code} value={province.code}>
                          {province.name}
                        </option>
                      ))}
                    </select>

                    <ChevronRight size={16} className="select-arrow" />
                  </div>
                </div>

                {/* Ward */}

                <div className="form-group">
                  <label>Phường / Xã</label>

                  <div className="select-wrapper">
                    <select
                      value={selectedWard}
                      disabled={!selectedProvince || locationLoading}
                      onChange={handleWardChange}
                    >
                      <option value="">
                        {locationLoading
                          ? "Đang tải phường / xã..."
                          : "Chọn phường / xã"}
                      </option>

                      {wards.map((ward) => (
                        <option key={ward.code} value={ward.code}>
                          {ward.name}
                        </option>
                      ))}
                    </select>

                    <ChevronRight size={16} className="select-arrow" />
                  </div>
                </div>
              </div>

              {/* Address */}

              <div className="form-group">
                <label>Địa chỉ chi tiết</label>

                <textarea
                  value={addressForm.address}
                  onChange={(e) =>
                    setAddressForm((prev) => ({
                      ...prev,

                      address: e.target.value,
                    }))
                  }
                  placeholder="Số nhà, tên đường..."
                  rows={3}
                />
              </div>

              {/* Preview */}

              {addressForm.address &&
                addressForm.wardName &&
                addressForm.provinceName && (
                  <div className="address-preview">
                    <span>Địa chỉ đầy đủ</span>

                    <p>
                      {addressForm.address}, {addressForm.wardName},{" "}
                      {addressForm.provinceName}
                    </p>
                  </div>
                )}

              {/* Default */}

              <label className="default-address-checkbox">
                <input
                  type="checkbox"
                  checked={addressForm.isDefault}
                  onChange={(e) =>
                    setAddressForm((prev) => ({
                      ...prev,

                      isDefault: e.target.checked,
                    }))
                  }
                />

                <span>Đặt làm địa chỉ mặc định</span>
              </label>

              {/* Actions */}

              <div className="address-modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowAddressModal(false)}
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  className="save-address-btn"
                  disabled={addressLoading}
                >
                  {addressLoading
                    ? "Đang lưu..."
                    : editingAddressId
                      ? "Lưu thay đổi"
                      : "Thêm địa chỉ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
