import api from "./axios";

// Lấy danh sách đánh giá của sản phẩm
export const getProductReviews = async (productId) => {
  const response = await api.get(`/products/${productId}/reviews`);

  return response.data;
};

// Thêm đánh giá
export const createReview = async (productId, data) => {
  const response = await api.post(`/products/${productId}/reviews`, data);

  return response.data;
};

// Cập nhật đánh giá
export const updateReview = async (reviewId, data) => {
  const response = await api.put(`/reviews/${reviewId}`, data);

  return response.data;
};

// Xóa đánh giá
export const deleteReview = async (reviewId) => {
  const response = await api.delete(`/reviews/${reviewId}`);

  return response.data;
};
