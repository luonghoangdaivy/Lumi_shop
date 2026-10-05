import api from "./axios";

export const getProductReviews = async (productId) => {
  const response = await api.get(`/products/${productId}/reviews`);

  return response.data;
};

export const createReview = async (productId, data) => {
  const response = await api.post(`/products/${productId}/reviews`, data);

  return response.data;
};

export const updateReview = async (reviewId, data) => {
  const response = await api.put(`/reviews/${reviewId}`, data);

  return response.data;
};

export const deleteReview = async (reviewId) => {
  const response = await api.delete(`/reviews/${reviewId}`);

  return response.data;
};
