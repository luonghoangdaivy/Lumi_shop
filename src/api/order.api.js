import api from "./axios";

// Tạo đơn hàng
export const createOrder = async (data) => {
  const response = await api.post("/orders", data);

  return response.data;
};

// Lấy danh sách đơn hàng
export const getOrders = async () => {
  const response = await api.get("/orders");

  return response.data;
};

// Lấy chi tiết đơn hàng
export const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);

  return response.data;
};

// Hủy đơn hàng
export const cancelOrder = async (id) => {
  const response = await api.put(`/orders/${id}/cancel`);

  return response.data;
};

// Cập nhật trạng thái đơn hàng (Admin)
export const updateOrderStatus = async (id, status) => {
  const response = await api.put(`/orders/${id}/status`, {
    status,
  });

  return response.data;
};
