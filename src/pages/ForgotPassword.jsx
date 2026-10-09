import { Link } from "react-router-dom";

import "../styles/auth/forgot-password.css";

function ForgotPassword() {
  return (
    <main className="forgot-password-page">
      <div className="forgot-password-container">
        <div className="forgot-password-card">
          <div className="forgot-password-header">
            <h1>Quên mật khẩu?</h1>

            <p>
              Tính năng đặt lại mật khẩu sẽ được kết nối với hệ thống email của
              Lumi.
            </p>
          </div>

          <div className="forgot-password-message">
            <p>
              Vui lòng liên hệ quản trị viên để được hỗ trợ đặt lại mật khẩu.
            </p>
          </div>

          <Link to="/login" className="forgot-password-back">
            Quay lại đăng nhập
          </Link>
        </div>
      </div>
    </main>
  );
}

export default ForgotPassword;
