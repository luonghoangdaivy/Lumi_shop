import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";

import { login } from "../api/auth.api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const response = await login(form);

      console.log("Login response:", response);

      // Lưu JWT
      localStorage.setItem("accessToken", response.data.accessToken);

      // Lưu thông tin user nếu cần
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Về trang chủ
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);

      setError(
        error.response?.data?.message || "Email hoặc mật khẩu không chính xác",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main className="auth-page">
        <div className="container">
          <div className="auth-form">
            <h1>Đăng nhập</h1>

            <p>Đăng nhập để tiếp tục mua sắm tại Lumi.</p>

            {error && <div className="auth-error">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email</label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Nhập email"
                  required
                />
              </div>

              <div className="form-group">
                <label>Mật khẩu</label>

                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Nhập mật khẩu"
                  required
                />
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "Đang đăng nhập..." : "Đăng nhập"}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Login;
