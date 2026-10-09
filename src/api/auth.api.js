import api from "./axios";

// ======================================
// REGISTER
// ======================================

export const register = async (data) => {
  const response = await api.post("/auth/register", data);

  return response.data;
};

// ======================================
// LOGIN
// ======================================

export const login = async (data) => {
  const response = await api.post("/auth/login", data);

  return response.data;
};

// ======================================
// GET CURRENT USER
// ======================================

export const getMe = async () => {
  const response = await api.get("/auth/me");

  return response.data;
};

// ======================================
// UPDATE CURRENT USER
// ======================================

export const updateMe = async (data) => {
  const response = await api.put("/auth/me", data);

  return response.data;
};
