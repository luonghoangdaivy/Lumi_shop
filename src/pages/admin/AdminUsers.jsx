import { useCallback, useEffect, useMemo, useState } from "react";
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
  Ban,
  CheckCircle,
} from "lucide-react";

import api from "../../api/axios";
import "../../styles/admin/admin-users.css";

const formatDate = (date) => {
  if (!date) return "Chưa có thông tin";

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) return "Chưa có thông tin";

  return value.toLocaleDateString("vi-VN");
};

// Chuẩn hóa role vì API/database có thể trả khác kiểu chữ.
const normalizeRole = (role) => {
  const value = String(role || "")
    .trim()
    .toUpperCase();

  if (["ADMIN", "ADMINISTRATOR"].includes(value)) return "ADMIN";
  if (["USER", "CUSTOMER", "CLIENT"].includes(value)) return "USER";

  return value;
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

const isUserBanned = (user) =>
  Boolean(user?.is_banned ?? user?.isBanned ?? user?.banned ?? false);

const getUserList = (response) => {
  const result = response?.data;

  if (Array.isArray(result)) return result;
  if (Array.isArray(result?.data)) return result.data;
  if (Array.isArray(result?.users)) return result.users;

  return [];
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [changingStatus, setChangingStatus] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      // Lấy danh sách đầy đủ rồi lọc tại frontend.
      // Cách này tránh trường hợp backend chưa xử lý đúng query role.
      const response = await api.get("/users");
      const userList = getUserList(response);

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
          "Không thể tải danh sách người dùng.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return users.filter((user) => {
      const userRole = normalizeRole(user.role);

      const matchesRole = !role || userRole === role;

      const matchesSearch =
        !keyword ||
        [
          user.name,
          user.full_name,
          user.username,
          user.email,
          user.phone,
          String(user.id ?? ""),
        ].some((value) =>
          String(value || "")
            .toLowerCase()
            .includes(keyword),
        );

      const banned = isUserBanned(user);

      const matchesStatus =
        !status ||
        (status === "BANNED" && banned) ||
        (status === "ACTIVE" && !banned);

      return matchesRole && matchesSearch && matchesStatus;
    });
  }, [users, search, role, status]);

  const totalAdmins = users.filter(
    (user) => normalizeRole(user.role) === "ADMIN",
  ).length;

  const totalCustomers = users.filter(
    (user) => normalizeRole(user.role) === "USER",
  ).length;

  const updateSelectedUser = (updatedUser) => {
    setUsers((current) =>
      current.map((user) =>
        String(user.id) === String(updatedUser.id) ? updatedUser : user,
      ),
    );

    setSelectedUser(updatedUser);
  };

  const handleToggleBan = async () => {
    if (!selectedUser || changingStatus) return;

    const banned = isUserBanned(selectedUser);
    const action = banned ? "mở khóa" : "khóa";

    const confirmed = window.confirm(
      `Bạn có chắc muốn ${action} tài khoản "${selectedUser.name || selectedUser.email}"?`,
    );

    if (!confirmed) return;

    try {
      setChangingStatus(true);

      /*
       * Endpoint dự kiến:
       * PATCH /users/:id/ban
       *
       * Backend cần hỗ trợ endpoint này và trả về user
       * có trường is_banned hoặc isBanned.
       */
      const response = await api.patch(`/users/${selectedUser.id}/ban`, {
        is_banned: !banned,
      });

      const result = response.data?.data || response.data;

      const updatedUser = {
        ...selectedUser,
        ...result,
        is_banned: result?.is_banned ?? result?.isBanned ?? !banned,
      };

      updateSelectedUser(updatedUser);

      // Tải lại danh sách để đồng bộ dữ liệu từ database.
      await fetchUsers();

      // Giữ thông tin chi tiết đã cập nhật sau khi tải lại.
      setSelectedUser(updatedUser);

      alert(
        banned
          ? "Đã gửi yêu cầu mở khóa tài khoản."
          : "Đã gửi yêu cầu khóa tài khoản.",
      );
    } catch (err) {
      console.error("Lỗi thay đổi trạng thái tài khoản:", err);

      alert(
        err.response?.data?.message ||
          "Không thể thay đổi trạng thái tài khoản. Hãy kiểm tra API khóa tài khoản ở backend.",
      );
    } finally {
      setChangingStatus(false);
    }
  };

  const selectedRole = normalizeRole(selectedUser?.role);
  const selectedBanned = isUserBanned(selectedUser);

  return (
    <div className="admin-users">
      <div className="admin-users__header">
        <div>
          <span className="admin-users__eyebrow">QUẢN LÝ HỆ THỐNG</span>

          <h1>Quản lý người dùng</h1>

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
            <span>Tài khoản</span>
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
            <p>Tra cứu, xem chi tiết và quản lý trạng thái tài khoản.</p>
          </div>
        </div>

        <div className="admin-users__filters">
          <div className="admin-users__search">
            <Search size={19} />

            <input
              type="search"
              placeholder="Tìm tên, email, số điện thoại..."
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

          <select
            aria-label="Lọc trạng thái tài khoản"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="ACTIVE">Đang hoạt động</option>
            <option value="BANNED">Đã khóa</option>
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
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Chi tiết</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="admin-users__message">
                    <RefreshCw className="admin-users__spinner" size={22} />
                    Đang tải danh sách...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="admin-users__message">
                    Không thể hiển thị dữ liệu.
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="admin-users__message">
                    Không tìm thấy tài khoản phù hợp.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const userRole = normalizeRole(user.role);
                  const banned = isUserBanned(user);

                  return (
                    <tr key={user.id}>
                      <td>
                        <div className="admin-users__identity">
                          <div className="admin-users__avatar">
                            {getInitials(
                              user.name || user.full_name || user.username,
                            )}
                          </div>

                          <div>
                            <strong>
                              {user.name ||
                                user.full_name ||
                                user.username ||
                                "Chưa cập nhật"}
                            </strong>
                            <span>ID: {user.id}</span>
                          </div>
                        </div>
                      </td>

                      <td>{user.email || "—"}</td>
                      <td>{user.phone || "—"}</td>

                      <td>
                        <span
                          className={`admin-users__role ${
                            userRole === "ADMIN"
                              ? "admin-users__role--admin"
                              : "admin-users__role--user"
                          }`}
                        >
                          {userRole === "ADMIN"
                            ? "Quản trị viên"
                            : userRole === "USER"
                              ? "Khách hàng"
                              : user.role || "Chưa xác định"}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`admin-users__status ${
                            banned
                              ? "admin-users__status--banned"
                              : "admin-users__status--active"
                          }`}
                        >
                          {banned ? "Đã khóa" : "Hoạt động"}
                        </span>
                      </td>

                      <td>{formatDate(user.createdAt || user.created_at)}</td>

                      <td>
                        <button
                          type="button"
                          className="admin-users__detail-btn"
                          aria-label={`Xem ${
                            user.name || user.email || "người dùng"
                          }`}
                          onClick={() => setSelectedUser(user)}
                        >
                          <Eye size={17} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="admin-users__footer">
          Hiển thị {loading ? 0 : filteredUsers.length} / {users.length} tài
          khoản
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
                {getInitials(
                  selectedUser.name ||
                    selectedUser.full_name ||
                    selectedUser.username,
                )}
              </div>

              <h3>
                {selectedUser.name ||
                  selectedUser.full_name ||
                  selectedUser.username ||
                  "Chưa cập nhật"}
              </h3>

              <span
                className={`admin-users__role ${
                  selectedRole === "ADMIN"
                    ? "admin-users__role--admin"
                    : "admin-users__role--user"
                }`}
              >
                {selectedRole === "ADMIN"
                  ? "Quản trị viên"
                  : selectedRole === "USER"
                    ? "Khách hàng"
                    : selectedUser.role || "Chưa xác định"}
              </span>

              <span
                className={`admin-users__status ${
                  selectedBanned
                    ? "admin-users__status--banned"
                    : "admin-users__status--active"
                }`}
              >
                {selectedBanned ? "Đã khóa" : "Đang hoạt động"}
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
                  <strong>
                    {selectedUser.address ||
                      selectedUser.full_address ||
                      "Chưa cập nhật"}
                  </strong>
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

            <div className="admin-users__modal-actions">
              {selectedRole !== "ADMIN" && (
                <button
                  type="button"
                  className={`admin-users__ban-btn ${
                    selectedBanned ? "admin-users__ban-btn--unban" : ""
                  }`}
                  onClick={handleToggleBan}
                  disabled={changingStatus}
                >
                  {changingStatus ? (
                    <RefreshCw size={17} className="admin-users__spinner" />
                  ) : selectedBanned ? (
                    <CheckCircle size={17} />
                  ) : (
                    <Ban size={17} />
                  )}

                  {changingStatus
                    ? "Đang xử lý..."
                    : selectedBanned
                      ? "Mở khóa tài khoản"
                      : "Khóa tài khoản"}
                </button>
              )}

              <button
                type="button"
                className="admin-users__modal-done"
                onClick={() => setSelectedUser(null)}
              >
                Đóng
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
