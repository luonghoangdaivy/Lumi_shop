import { useCallback, useEffect, useState } from "react";
import {
  Search,
  Users,
  ShieldCheck,
  UserRound,
  RefreshCw,
  Eye,
  X,
  Mail,
  Phone,
  MapPin,
  CalendarDays,
} from "lucide-react";
import api from "../../api/axios";
import "../../styles/admin/admin-users.css";

const formatDate = (date) => {
  if (!date) return "Chưa có thông tin";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) return "Chưa có thông tin";

  return value.toLocaleDateString("vi-VN");
};

const getInitials = (name) => {
  if (!name) return "U";

  return name
    .trim()
    .split(/\s+/)
    .slice(-2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/users", {
        params: {
          search: search.trim(),
          role,
        },
      });

      const result = response.data;
      const userList = Array.isArray(result) ? result : result.data;

      if (!Array.isArray(userList)) {
        throw new Error("Dữ liệu người dùng trả về không hợp lệ.");
      }

      setUsers(userList);
    } catch (err) {
      console.error("Lỗi tải danh sách người dùng:", err);

      setUsers([]);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Không thể tải danh sách khách hàng.",
      );
    } finally {
      setLoading(false);
    }
  }, [search, role]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const totalAdmins = users.filter((user) => user.role === "ADMIN").length;

  const totalCustomers = users.filter((user) => user.role === "USER").length;

  return (
    <div className="admin-users">
      <div className="admin-users__header">
        <div>
          <span className="admin-users__eyebrow">QUẢN LÝ HỆ THỐNG</span>

          <h1>Khách hàng</h1>

          <p>
            Theo dõi thông tin và quản lý tài khoản người dùng của Lumi Shop.
          </p>
        </div>

        <button
          className="admin-users__refresh"
          onClick={fetchUsers}
          disabled={loading}
          type="button"
        >
          <RefreshCw size={17} />
          Làm mới
        </button>
      </div>

      <div className="admin-users__stats">
        <div className="admin-users__stat-card">
          <div className="admin-users__stat-icon admin-users__stat-icon--blue">
            <Users size={22} />
          </div>

          <div>
            <span>Tài khoản tìm thấy</span>
            <strong>{users.length}</strong>
          </div>
        </div>

        <div className="admin-users__stat-card">
          <div className="admin-users__stat-icon admin-users__stat-icon--green">
            <UserRound size={22} />
          </div>

          <div>
            <span>Khách hàng</span>
            <strong>{totalCustomers}</strong>
          </div>
        </div>

        <div className="admin-users__stat-card">
          <div className="admin-users__stat-icon admin-users__stat-icon--purple">
            <ShieldCheck size={22} />
          </div>

          <div>
            <span>Quản trị viên</span>
            <strong>{totalAdmins}</strong>
          </div>
        </div>
      </div>

      <section className="admin-users__panel">
        <div className="admin-users__panel-header">
          <div>
            <h2>Danh sách tài khoản</h2>
            <p>Tra cứu thông tin người dùng trong hệ thống.</p>
          </div>
        </div>

        <div className="admin-users__filters">
          <div className="admin-users__search">
            <Search size={19} />

            <input
              type="search"
              placeholder="Tìm tên, email hoặc số điện thoại..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          <select
            aria-label="Lọc theo vai trò"
            value={role}
            onChange={(event) => setRole(event.target.value)}
          >
            <option value="">Tất cả vai trò</option>
            <option value="USER">Khách hàng</option>
            <option value="ADMIN">Quản trị viên</option>
          </select>
        </div>

        {error && (
          <div className="admin-users__error">
            <span>{error}</span>

            <button type="button" onClick={fetchUsers}>
              Thử lại
            </button>
          </div>
        )}

        <div className="admin-users__table-wrap">
          <table className="admin-users__table">
            <thead>
              <tr>
                <th>Người dùng</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Vai trò</th>
                <th>Ngày tạo</th>
                <th>Chi tiết</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="admin-users__message">
                    <RefreshCw className="admin-users__spinner" size={22} />
                    Đang tải danh sách...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="6" className="admin-users__message">
                    Không thể hiển thị dữ liệu.
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="admin-users__message">
                    Không tìm thấy tài khoản nào.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="admin-users__identity">
                        <div className="admin-users__avatar">
                          {getInitials(user.name)}
                        </div>

                        <div>
                          <strong>{user.name || "Chưa cập nhật"}</strong>
                          <span>ID: {user.id}</span>
                        </div>
                      </div>
                    </td>

                    <td>{user.email || "—"}</td>

                    <td>{user.phone || "—"}</td>

                    <td>
                      <span
                        className={`admin-users__role ${
                          user.role === "ADMIN"
                            ? "admin-users__role--admin"
                            : "admin-users__role--user"
                        }`}
                      >
                        {user.role === "ADMIN" ? "Quản trị viên" : "Khách hàng"}
                      </span>
                    </td>

                    <td>{formatDate(user.createdAt || user.created_at)}</td>

                    <td>
                      <button
                        type="button"
                        className="admin-users__detail-btn"
                        aria-label={`Xem ${user.name || "người dùng"}`}
                        onClick={() => setSelectedUser(user)}
                      >
                        <Eye size={17} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="admin-users__footer">
          Hiển thị {loading ? 0 : users.length} tài khoản
        </div>
      </section>

      {selectedUser && (
        <div
          className="admin-users__overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedUser(null);
            }
          }}
        >
          <section
            className="admin-users__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-user-detail-title"
          >
            <div className="admin-users__modal-header">
              <div>
                <span>THÔNG TIN TÀI KHOẢN</span>
                <h2 id="admin-user-detail-title">Chi tiết người dùng</h2>
              </div>

              <button
                type="button"
                className="admin-users__close"
                aria-label="Đóng"
                onClick={() => setSelectedUser(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="admin-users__profile">
              <div className="admin-users__profile-avatar">
                {getInitials(selectedUser.name)}
              </div>

              <h3>{selectedUser.name || "Chưa cập nhật"}</h3>

              <span
                className={`admin-users__role ${
                  selectedUser.role === "ADMIN"
                    ? "admin-users__role--admin"
                    : "admin-users__role--user"
                }`}
              >
                {selectedUser.role === "ADMIN" ? "Quản trị viên" : "Khách hàng"}
              </span>
            </div>

            <div className="admin-users__details">
              <div>
                <Mail size={18} />
                <section>
                  <span>Email</span>
                  <strong>{selectedUser.email || "Chưa cập nhật"}</strong>
                </section>
              </div>

              <div>
                <Phone size={18} />
                <section>
                  <span>Số điện thoại</span>
                  <strong>{selectedUser.phone || "Chưa cập nhật"}</strong>
                </section>
              </div>

              <div>
                <MapPin size={18} />
                <section>
                  <span>Địa chỉ</span>
                  <strong>{selectedUser.address || "Chưa cập nhật"}</strong>
                </section>
              </div>

              <div>
                <CalendarDays size={18} />
                <section>
                  <span>Ngày tạo tài khoản</span>
                  <strong>
                    {formatDate(
                      selectedUser.createdAt || selectedUser.created_at,
                    )}
                  </strong>
                </section>
              </div>
            </div>

            <button
              type="button"
              className="admin-users__modal-done"
              onClick={() => setSelectedUser(null)}
            >
              Đóng
            </button>
          </section>
        </div>
      )}
    </div>
  );
}
