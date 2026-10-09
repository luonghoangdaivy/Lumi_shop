import { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../api/auth.api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // KIỂM TRA ĐĂNG NHẬP
  // =========================
  const checkAuth = async () => {
    const token = localStorage.getItem("accessToken");

    console.log("AUTH CHECK TOKEN:", token);

    // Không có token
    if (!token) {
      console.log("Không có accessToken");
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      console.log("Đang gọi GET /auth/me...");

      const response = await getMe();

      console.log("GET /auth/me RESPONSE:", response);

      const currentUser = response?.data;

      if (!currentUser) {
        throw new Error("Không lấy được thông tin user");
      }

      console.log("USER SAU KHI RELOAD:", currentUser);

      setUser(currentUser);

      localStorage.setItem("user", JSON.stringify(currentUser));
    } catch (error) {
      console.error("CHECK AUTH ERROR:", error);

      console.error("STATUS:", error?.response?.status);

      console.error("DATA:", error?.response?.data);

      /*
       * Chỉ xóa token khi token thực sự không hợp lệ
       */
      if (error?.response?.status === 401) {
        console.log("Token không hợp lệ hoặc đã hết hạn");

        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
      }

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOGIN
  // =========================
  const login = async (response) => {
    console.log("LOGIN RESPONSE:", response);

    const token = response?.data?.accessToken;
    const loggedInUser = response?.data?.user;

    if (!token) {
      throw new Error("Không tìm thấy accessToken");
    }

    // Lưu token
    localStorage.setItem("accessToken", token);

    console.log("ACCESS TOKEN ĐÃ LƯU:", token);

    // Nếu login đã trả user
    if (loggedInUser) {
      setUser(loggedInUser);

      localStorage.setItem("user", JSON.stringify(loggedInUser));

      return loggedInUser;
    }

    // Nếu login không trả user
    await checkAuth();

    return loggedInUser;
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    console.log("LOGOUT");

    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");

    setUser(null);
  };

  // =========================
  // CHECK AUTH KHI APP LOAD
  // =========================
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        login,
        logout,
        checkAuth,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth phải được sử dụng bên trong AuthProvider");
  }

  return context;
}
