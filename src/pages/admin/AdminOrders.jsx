import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Eye,
  XCircle,
  ShoppingBag,
  PackageCheck,
  X,
} from "lucide-react";

import {
  getAdminOrders as getOrders,
  cancelOrder,
  updateOrderStatus,
} from "../../api/order.api";

import "../../styles/admin/admin-orders.css";

const ITEMS_PER_PAGE = 10;

const ORDER_STATUSES = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  SHIPPING: "Đang giao",
  DELIVERED: "Đã giao",
  CANCELLED: "Đã hủy",
};

const PAYMENT_STATUSES = {
  PENDING: "Chưa thanh toán",
  PAID: "Đã thanh toán",
  FAILED: "Thanh toán thất bại",
};

const ALLOWED_NEXT_STATUSES = {
  PENDING: ["CONFIRMED", "CANCELLED"],
  CONFIRMED: ["SHIPPING", "CANCELLED"],
  SHIPPING: ["DELIVERED"],
  DELIVERED: [],
  CANCELLED: [],
};

const formatCurrency = (amount) =>
  Number(amount || 0).toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
  });

const formatDate = (date) => {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) return "—";

  return parsed.toLocaleString("vi-VN");
};

// Hiển thị mã đơn riêng; dùng ID làm dự phòng cho dữ liệu cũ.
const getOrderCode = (order) =>
  order?.order_code || `LUMI-${String(order?.id ?? "").padStart(6, "0")}`;

const extractOrders = (responseData) => {
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.data)) return responseData.data;
  if (Array.isArray(responseData?.orders)) return responseData.orders;
  return null;
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState(null);

  // State phân trang
  const [currentPage, setCurrentPage] = useState(1);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getOrders();
      const data =
        extractOrders(response) || extractOrders(response?.data) || [];

      setOrders(data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Không thể tải danh sách đơn hàng.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Tìm kiếm và lọc đơn hàng trên toàn bộ dữ liệu đã tải
  const filteredOrders = useMemo(() => {
    const search = keyword.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesSearch =
        !search ||
        String(getOrderCode(order)).toLowerCase().includes(search) ||
        String(order.id ?? "")
          .toLowerCase()
          .includes(search) ||
        String(order.user_id ?? "")
          .toLowerCase()
          .includes(search) ||
        String(order.shipping_phone ?? "")
          .toLowerCase()
          .includes(search) ||
        String(order.shipping_address ?? "")
          .toLowerCase()
          .includes(search);

      const matchesStatus =
        statusFilter === "ALL" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [orders, keyword, statusFilter]);

  // Tính tổng số trang
  const totalPages = Math.max(
    1,
    Math.ceil(filteredOrders.length / ITEMS_PER_PAGE),
  );

  // Trở về trang hợp lệ khi dữ liệu hoặc bộ lọc thay đổi
  useEffect(() => {
    setCurrentPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  // Khi tìm kiếm hoặc lọc trạng thái, quay về trang đầu
  const handleKeywordChange = (value) => {
    setKeyword(value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (value) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  // Chỉ lấy đơn hàng thuộc trang hiện tại
  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return filteredOrders.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredOrders, currentPage]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const updateLocalOrder = (id, changes) => {
    setOrders((current) =>
      current.map((order) =>
        String(order.id) === String(id) ? { ...order, ...changes } : order,
      ),
    );
  };

  const handleStatusChange = async (order, nextStatus) => {
    if (nextStatus === order.status) return;

    const allowed = ALLOWED_NEXT_STATUSES[order.status] || [];

    if (!allowed.includes(nextStatus)) {
      setError("Không thể chuyển sang trạng thái này.");
      return;
    }

    const confirmed = window.confirm(
      `Cập nhật đơn ${getOrderCode(order)} từ "${ORDER_STATUSES[order.status]}" sang "${ORDER_STATUSES[nextStatus]}"?`,
    );

    if (!confirmed) return;

    try {
      setProcessingId(order.id);
      setError("");
      setSuccess("");

      await updateOrderStatus(order.id, nextStatus);

      updateLocalOrder(order.id, { status: nextStatus });
      setSuccess(`Đã cập nhật trạng thái đơn ${getOrderCode(order)}.`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Không thể cập nhật trạng thái đơn hàng.",
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleCancel = async (order) => {
    if (!["PENDING", "CONFIRMED"].includes(order.status)) {
      setError("Chỉ được hủy đơn đang chờ xác nhận hoặc đã xác nhận.");
      return;
    }

    const confirmed = window.confirm(
      `Bạn có chắc muốn hủy đơn hàng ${getOrderCode(order)}?`,
    );

    if (!confirmed) return;

    try {
      setProcessingId(order.id);
      setError("");
      setSuccess("");

      await cancelOrder(order.id);

      updateLocalOrder(order.id, { status: "CANCELLED" });
      setSuccess(`Đã hủy đơn hàng ${getOrderCode(order)}.`);
    } catch (err) {
      setError(err.response?.data?.message || "Không thể hủy đơn hàng.");
    } finally {
      setProcessingId(null);
    }
  };

  const summary = useMemo(
    () => ({
      total: orders.length,
      pending: orders.filter((o) => o.status === "PENDING").length,
      shipping: orders.filter((o) => o.status === "SHIPPING").length,
      delivered: orders.filter((o) => o.status === "DELIVERED").length,
    }),
    [orders],
  );

  return (
    <main className="admin-orders">
      <header className="admin-orders-header">
        <div>
          <span className="orders-eyebrow">LUMI SHOP / ADMIN</span>
          <h1>Quản lý đơn hàng</h1>
          <p>Theo dõi đơn hàng, thanh toán và tiến trình giao hàng.</p>
        </div>

        <button
          type="button"
          className="orders-refresh-btn"
          onClick={fetchOrders}
          disabled={loading}
        >
          <RefreshCw size={17} />
          Làm mới
        </button>
      </header>

      <section className="orders-summary">
        <article className="orders-summary-card">
          <span>Tổng đơn hàng</span>
          <strong>{summary.total}</strong>
          <small>Tất cả đơn trong API trả về</small>
        </article>

        <article className="orders-summary-card">
          <span>Chờ xác nhận</span>
          <strong>{summary.pending}</strong>
          <small>Cần xử lý tiếp</small>
        </article>

        <article className="orders-summary-card">
          <span>Đang giao</span>
          <strong>{summary.shipping}</strong>
          <small>Đang vận chuyển</small>
        </article>

        <article className="orders-summary-card">
          <span>Đã giao</span>
          <strong>{summary.delivered}</strong>
          <small>Giao hàng hoàn tất</small>
        </article>
      </section>

      <section className="orders-panel">
        <div className="orders-panel-heading">
          <div>
            <h2>Danh sách đơn hàng</h2>
            <p>Tra cứu và xử lý từng đơn hàng.</p>
          </div>
          <span className="orders-count">{filteredOrders.length} đơn</span>
        </div>

        <div className="orders-toolbar">
          <label className="orders-search">
            <Search size={18} />
            <input
              value={keyword}
              onChange={(event) => handleKeywordChange(event.target.value)}
              placeholder="Tìm mã đơn, mã khách hàng, số điện thoại..."
              aria-label="Tìm kiếm đơn hàng"
            />
          </label>

          <select
            className="orders-filter"
            value={statusFilter}
            onChange={(event) => handleStatusFilterChange(event.target.value)}
            aria-label="Lọc trạng thái đơn hàng"
          >
            <option value="ALL">Tất cả trạng thái</option>
            {Object.entries(ORDER_STATUSES).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="orders-alert orders-alert-error" role="alert">
            <span>{error}</span>
            <button type="button" onClick={() => setError("")}>
              Đóng
            </button>
          </div>
        )}

        {success && (
          <div className="orders-alert orders-alert-success" role="status">
            <span>{success}</span>
            <button type="button" onClick={() => setSuccess("")}>
              Đóng
            </button>
          </div>
        )}

        <div className="orders-table-wrapper">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Đơn hàng</th>
                <th>Khách hàng</th>
                <th>Ngày đặt</th>
                <th>Tổng tiền</th>
                <th>Thanh toán</th>
                <th>Trạng thái</th>
                <th>Cập nhật trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8}>
                    <div className="orders-empty">Đang tải đơn hàng...</div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="orders-empty">
                      <ShoppingBag size={34} />
                      <strong>Không tìm thấy đơn hàng</strong>
                      <span>Thử thay đổi từ khóa hoặc trạng thái lọc.</span>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedOrders.map((order) => {
                  const nextStatuses =
                    ALLOWED_NEXT_STATUSES[order.status] || [];

                  return (
                    <tr key={order.id}>
                      <td>
                        <strong className="orders-id">
                          {getOrderCode(order)}
                        </strong>
                        <span className="orders-subtext">
                          {order.payment_method === "COD"
                            ? "COD"
                            : order.payment_method || "—"}
                        </span>
                      </td>

                      <td>
                        <strong>Khách hàng #{order.user_id}</strong>
                        <span className="orders-subtext">
                          {order.shipping_phone || "Chưa có số điện thoại"}
                        </span>
                      </td>

                      <td>{formatDate(order.created_at || order.createdAt)}</td>

                      <td className="orders-amount">
                        {formatCurrency(order.total_amount)}
                      </td>

                      <td>
                        <span
                          className={`orders-payment ${(order.payment_status || "PENDING").toLowerCase()}`}
                        >
                          {PAYMENT_STATUSES[order.payment_status] ||
                            order.payment_status ||
                            "Chưa rõ"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`orders-status ${(order.status || "PENDING").toLowerCase()}`}
                        >
                          {ORDER_STATUSES[order.status] ||
                            order.status ||
                            "Chưa rõ"}
                        </span>
                      </td>

                      <td>
                        {nextStatuses.length > 0 ? (
                          <select
                            className="orders-status-select"
                            value=""
                            disabled={processingId === order.id}
                            onChange={(event) => {
                              const value = event.target.value;
                              if (value) {
                                handleStatusChange(order, value);
                              }
                            }}
                            aria-label={`Cập nhật trạng thái đơn ${order.id}`}
                          >
                            <option value="">
                              {processingId === order.id
                                ? "Đang lưu..."
                                : "Chọn trạng thái"}
                            </option>
                            {nextStatuses.map((status) => (
                              <option key={status} value={status}>
                                {ORDER_STATUSES[status]}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="orders-final-state">
                            <PackageCheck size={15} />
                            Đã kết thúc
                          </span>
                        )}
                      </td>

                      <td>
                        <div className="orders-actions">
                          <button
                            type="button"
                            className="orders-view-btn"
                            title="Xem thông tin đơn"
                            aria-label={`Xem đơn ${order.id}`}
                            onClick={() => setSelectedOrderForDetail(order)}
                          >
                            <Eye size={16} />
                          </button>

                          {["PENDING", "CONFIRMED"].includes(order.status) && (
                            <button
                              type="button"
                              className="orders-cancel-btn"
                              title="Hủy đơn hàng"
                              aria-label={`Hủy đơn ${order.id}`}
                              disabled={processingId === order.id}
                              onClick={() => handleCancel(order)}
                            >
                              <XCircle size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        <footer className="orders-footer">
          <span className="orders-footer-info">
            {filteredOrders.length === 0
              ? "Hiển thị 0 đơn hàng"
              : `Hiển thị ${(currentPage - 1) * ITEMS_PER_PAGE + 1}–${Math.min(
                  currentPage * ITEMS_PER_PAGE,
                  filteredOrders.length,
                )} / ${filteredOrders.length} đơn hàng`}
          </span>

          <div className="orders-pagination">
            <button
              type="button"
              className="orders-page-btn"
              disabled={currentPage === 1 || loading}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Trang trước
            </button>

            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (page) => (
                <button
                  type="button"
                  key={page}
                  className={`orders-page-btn ${
                    currentPage === page ? "active" : ""
                  }`}
                  aria-label={`Trang ${page}`}
                  aria-current={currentPage === page ? "page" : undefined}
                  disabled={loading}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </button>
              ),
            )}

            <button
              type="button"
              className="orders-page-btn"
              disabled={currentPage === totalPages || loading}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Trang sau
            </button>
          </div>
        </footer>
      </section>

      {selectedOrderForDetail && (
        <div
          className="order-modal-backdrop"
          onClick={() => setSelectedOrderForDetail(null)}
        >
          <div
            className="order-modal-content"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="order-modal-header">
              <div>
                <h2>
                  Chi tiết đơn hàng {getOrderCode(selectedOrderForDetail)}
                </h2>
                <p>
                  Đặt ngày{" "}
                  {formatDate(
                    selectedOrderForDetail.created_at ||
                      selectedOrderForDetail.createdAt,
                  )}
                </p>
              </div>
              <button
                type="button"
                className="order-modal-close"
                onClick={() => setSelectedOrderForDetail(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="order-modal-body">
              <div className="order-modal-section">
                <h3>Thông tin khách hàng &amp; Giao hàng</h3>
                <div className="order-modal-grid">
                  <div>
                    <label>Khách hàng:</label>
                    <span>
                      {selectedOrderForDetail.user?.username ||
                        selectedOrderForDetail.user?.name ||
                        selectedOrderForDetail.user?.email ||
                        "Khách vãng lai"}
                    </span>
                  </div>

                  <div>
                    <label>Email:</label>
                    <span>{selectedOrderForDetail.user?.email || "—"}</span>
                  </div>

                  <div>
                    <label>Số điện thoại:</label>
                    <span>
                      {selectedOrderForDetail.shipping_phone ||
                        selectedOrderForDetail.phone ||
                        "—"}
                    </span>
                  </div>

                  <div>
                    <label>Trạng thái đơn:</label>
                    <span
                      className={`orders-status ${(selectedOrderForDetail.status || "PENDING").toLowerCase()}`}
                    >
                      {ORDER_STATUSES[selectedOrderForDetail.status] ||
                        selectedOrderForDetail.status ||
                        "Chưa rõ"}
                    </span>
                  </div>

                  <div>
                    <label>Phương thức TT:</label>
                    <span>
                      {selectedOrderForDetail.payment_method || "COD"}
                    </span>
                  </div>

                  <div>
                    <label>Trạng thái TT:</label>
                    <span
                      className={`orders-payment ${(selectedOrderForDetail.payment_status || "PENDING").toLowerCase()}`}
                    >
                      {PAYMENT_STATUSES[
                        selectedOrderForDetail.payment_status
                      ] ||
                        selectedOrderForDetail.payment_status ||
                        "Chưa rõ"}
                    </span>
                  </div>

                  <div className="order-modal-full">
                    <label>Địa chỉ nhận hàng:</label>
                    <span>
                      {selectedOrderForDetail.shipping_address || "—"}
                    </span>
                  </div>

                  {selectedOrderForDetail.note && (
                    <div className="order-modal-full">
                      <label>Ghi chú:</label>
                      <span>{selectedOrderForDetail.note}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="order-modal-section">
                <h3>Sản phẩm ({selectedOrderForDetail.items?.length || 0})</h3>

                <div className="order-modal-table-wrap">
                  <table className="order-modal-table">
                    <thead>
                      <tr>
                        <th>Sản phẩm</th>
                        <th>Phân loại</th>
                        <th>Đơn giá</th>
                        <th>Số lượng</th>
                        <th>Tạm tính</th>
                      </tr>
                    </thead>

                    <tbody>
                      {selectedOrderForDetail.items?.map((item) => (
                        <tr key={item.id}>
                          <td>
                            {item.variant?.product?.name || `Mã sp #${item.id}`}
                          </td>

                          <td>
                            {[item.variant?.color, item.variant?.size]
                              .filter(Boolean)
                              .join(" / ") || "—"}
                          </td>

                          <td>{formatCurrency(item.price)}</td>
                          <td>{item.quantity}</td>
                          <td>
                            {formatCurrency(
                              Number(item.price) * Number(item.quantity),
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="order-modal-total">
                  <span>Tổng tiền thanh toán:</span>
                  <strong>
                    {formatCurrency(selectedOrderForDetail.total_amount)}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
