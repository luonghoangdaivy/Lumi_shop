import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import "../styles/auth/forgot-password.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("Vui lòng nhập email.");
      return;
    }

    try {
      setLoading(true);

      // Nếu project có axios instance riêng, hãy dùng instance đó.
      await axios.post("http://localhost:4000/auth/forgot-password", {
        email: email.trim(),
      });

      setMessage(
        "Nếu email đã đăng ký, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu. Vui lòng kiểm tra hộp thư và thư mục Spam.",
      );
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Không thể gửi yêu cầu. Vui lòng thử lại sau.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="forgot-password-card">
          <div className="forgot-password-header">
            <h1>Quên mật khẩu?</h1>
            <p>
              Nhập email bạn đã dùng để đăng ký tài khoản Lumi. Chúng tôi sẽ gửi
              liên kết đặt lại mật khẩu cho bạn.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="forgot-password-form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Nhập email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
                disabled={loading}
              />
            </div>

            {message && (
              <div className="forgot-password-message" role="status">
                <p>{message}</p>
              </div>
            )}

            {error && (
              <div className="forgot-password-error" role="alert">
                <p>{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="forgot-password-submit"
              disabled={loading}
            >
              {loading ? "Đang gửi..." : "Gửi link đặt lại mật khẩu"}
            </button>
          </form>

          <Link to="/login" className="forgot-password-back">
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </main>
  );
}

export default ForgotPassword;
