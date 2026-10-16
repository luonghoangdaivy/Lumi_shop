import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";

import "../styles/auth/reset-password.css";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!token) {
      setError("Liên kết đặt lại mật khẩu không hợp lệ hoặc thiếu token.");
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:4000/auth/reset-password",
        {
          token,
          password,
          confirmPassword,
        },
      );

      setSuccess(true);
      setMessage(
        response.data.message ||
          "Đổi mật khẩu thành công. Bạn có thể đăng nhập lại.",
      );
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Không thể đổi mật khẩu. Vui lòng thử lại.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="reset-password-page">
      <div className="reset-password-container">
        <div className="reset-password-card">
          <div className="reset-password-header">
            <h1>Đặt lại mật khẩu</h1>
            <p>Hãy tạo mật khẩu mới cho tài khoản Lumi của bạn.</p>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit}>
              <div className="reset-password-form-group">
                <label htmlFor="password">Mật khẩu mới</label>
                <input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Nhập mật khẩu mới"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                  disabled={loading}
                />
              </div>

              <div className="reset-password-form-group">
                <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                <input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Nhập lại mật khẩu mới"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={6}
                  required
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="reset-password-error" role="alert">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="reset-password-submit"
                disabled={loading}
              >
                {loading ? "Đang cập nhật..." : "Đổi mật khẩu"}
              </button>
            </form>
          ) : (
            <div className="reset-password-success" role="status">
              <p>{message}</p>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="reset-password-submit"
              >
                Đăng nhập ngay
              </button>
            </div>
          )}

          {!success && (
            <Link to="/login" className="reset-password-back">
              Quay lại đăng nhập
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}

export default ResetPassword;
