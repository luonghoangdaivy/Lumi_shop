import api from "./axios";

// ========================================
// GET ALL ADDRESSES
// ========================================

export const getAddresses = async () => {
  const response = await api.get("/addresses");

  return response.data;
};

// ========================================
// GET ADDRESS BY ID
// ========================================

export const getAddressById = async (id) => {
  const response = await api.get(`/addresses/${id}`);

  return response.data;
};

// ========================================
// CREATE ADDRESS
// ========================================

export const createAddress = async (data) => {
  const response = await api.post("/addresses", data);

  return response.data;
};

// ========================================
// UPDATE ADDRESS
// ========================================

export const updateAddress = async (id, data) => {
  const response = await api.put(`/addresses/${id}`, data);

  return response.data;
};

// ========================================
// SET DEFAULT ADDRESS
// ========================================

export const setDefaultAddress = async (id) => {
  const response = await api.put(`/addresses/${id}/default`);

  return response.data;
};

// ========================================
// DELETE ADDRESS
// ========================================

export const deleteAddress = async (id) => {
  const response = await api.delete(`/addresses/${id}`);

  return response.data;
};
