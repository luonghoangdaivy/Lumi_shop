import api from "./axios";

// Lấy giỏ hàng
export const getCart = async () => {
  const response = await api.get("/cart");

  return response.data;
};

// Thêm sản phẩm vào giỏ hàng
export const addToCart = async (variantId, quantity = 1) => {
  const response = await api.post("/cart/items", {
    variant_id: variantId,
    quantity,
  });

  return response.data;
};

// Cập nhật số lượng
export const updateCartItem = async (itemId, quantity) => {
  const response = await api.put(`/cart/items/${itemId}`, {
    quantity,
  });

  return response.data;
};

// Xóa sản phẩm khỏi giỏ hàng
export const removeCartItem = async (itemId) => {
  const response = await api.delete(`/cart/items/${itemId}`);

  return response.data;
};
