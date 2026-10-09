import api from "./axios";

// Lấy danh sách tỉnh / thành
export const getProvinces = async () => {
  const response = await api.get("/locations/provinces");
  return response.data;
};

// Lấy danh sách phường / xã theo tỉnh
export const getWards = async (provinceCode) => {
  const response = await api.get(`/locations/provinces/${provinceCode}/wards`);

  return response.data;
};
