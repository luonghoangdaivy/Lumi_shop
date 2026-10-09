import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/auth/register.css";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!name || !email || !password || !formData.confirmPassword) {
      setError("Vui lòng nhập đầy đủ họ tên, email và mật khẩu.");
      return;
    }

    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    if (password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);

    try {
      /*
       * The backend error shown in DevTools mentions `username`, `email`,
       * and `password`. Send `username` as well as `name` to cover the common
       * field-name mismatch. Confirm the exact fields against auth.controller.js.
       */
      const response = await api.post("/auth/register", {
        username: name,
        name,
        email,
        password,
      });

      setSuccess(
        response?.data?.message || "Đăng ký thành công. Vui lòng đăng nhập.",
      );

      window.setTimeout(() => navigate("/login"), 700);
    } catch (err) {
      const status = err?.response?.status;
      const serverMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.response?.data?.errors?.[0]?.message;

      if (status === 409) {
        setError(serverMessage || "Email hoặc tài khoản đã tồn tại.");
      } else if (status === 400) {
        setError(
          serverMessage ||
            "Dữ liệu đăng ký chưa đúng định dạng hoặc còn thiếu trường bắt buộc.",
        );
      } else {
        setError(
          serverMessage || "Không thể đăng ký lúc này. Vui lòng thử lại.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page">
      <section className="register-card">
        <header className="register-header">
          <h1>Tạo tài khoản</h1>
          <p>Đăng ký tài khoản Lumi</p>
        </header>

        {error && (
          <div className="register-alert register-alert-error" role="alert">
            {error}
          </div>
        )}
        {success && (
          <div className="register-alert register-alert-success" role="status">
            {success}
          </div>
        )}

        <form className="register-form" onSubmit={handleSubmit}>
          <div className="register-field">
            <label htmlFor="register-name">Họ và tên</label>
            <input
              id="register-name"
              name="name"
              type="text"
              autoComplete="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập họ và tên"
              required
            />
          </div>

          <div className="register-field">
            <label htmlFor="register-email">Email</label>
            <input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="name@example.com"
              required
            />
          </div>

          <div className="register-field">
            <label htmlFor="register-password">Mật khẩu</label>
            <input
              id="register-password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Ít nhất 6 ký tự"
              minLength={6}
              required
            />
          </div>

          <div className="register-field">
            <label htmlFor="register-confirm-password">Xác nhận mật khẩu</label>
            <input
              id="register-confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Nhập lại mật khẩu"
              minLength={6}
              required
            />
          </div>

          <button className="register-submit" type="submit" disabled={loading}>
            {loading ? "Đang đăng ký..." : "Đăng ký"}
          </button>
        </form>

        <p className="register-footer">
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </section>
    </main>
  );
}
