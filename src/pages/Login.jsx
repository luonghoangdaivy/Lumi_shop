import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { login as loginApi } from "../api/auth.api";
import { useAuth } from "../context/AuthContext";

import "../styles/auth/login.css";

function Login() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    // Validate email
    if (!formData.email.trim()) {
      setError("Vui lòng nhập email");
      return;
    }

    // Validate password
    if (!formData.password) {
      setError("Vui lòng nhập mật khẩu");
      return;
    }

    try {
      setLoading(true);

      const response = await loginApi({
        email: formData.email.trim(),
        password: formData.password,
      });

      console.log("LOGIN API RESPONSE:", response);

      await login(response);

      // Login thành công
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Email hoặc mật khẩu không chính xác";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-container">
        <div className="login-card">
          {/* Header */}
          <div className="login-header">
            <h1>Đăng nhập</h1>

            <p>Đăng nhập vào tài khoản Lumi của bạn</p>
          </div>

          {/* Error */}
          {error && <div className="login-error">{error}</div>}

          {/* Form */}
          <form className="login-form" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="login-form-group">
              <label htmlFor="email">Email</label>

              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Nhập email của bạn"
                autoComplete="email"
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div className="login-form-group">
              <label htmlFor="password">Mật khẩu</label>

              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu"
                autoComplete="current-password"
                disabled={loading}
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="login-submit-button"
              disabled={loading}
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          {/* Links */}
          <div className="login-links">
            <div className="login-register">
              <span>Chưa có tài khoản?</span>

              <Link to="/register">Đăng ký</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Login;
