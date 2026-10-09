import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute({ requiredRole }) {
  const location = useLocation();

  // Đọc thông tin đăng nhập từ localStorage.
  // Tên key phải khớp với cách Login.jsx đang lưu dữ liệu.
  const token =
    localStorage.getItem("accessToken") || localStorage.getItem("token");

  const storedUser =
    localStorage.getItem("user") || localStorage.getItem("currentUser");

  let user = null;

  try {
    user = storedUser ? JSON.parse(storedUser) : null;
  } catch {
    user = null;
  }

  // Chưa đăng nhập
  if (!token) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // Đã đăng nhập nhưng chưa có thông tin user
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // Không đủ quyền
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
