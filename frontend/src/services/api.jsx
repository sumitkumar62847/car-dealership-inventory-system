import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const registerUser = async (userData) => {
  const response = await api.post(
    "/auth/register",
    userData
  );

  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post(
    "/auth/login",
    credentials
  );

  return response.data;
};


export const getVehicles = async () => {
  const response = await api.get("/vehicles");

  return response.data;
};

export const searchVehicles = async (params) => {
  const response = await api.get(
    "/vehicles/search",
    {
      params,
    }
  );

  return response.data;
};

export const createVehicle = async (vehicleData) => {
  const response = await api.post(
    "/vehicles",
    vehicleData
  );

  return response.data;
};

export const updateVehicle = async (
  id,
  vehicleData
) => {
  const response = await api.put(
    `/vehicles/${id}`,
    vehicleData
  );

  return response.data;
};

export const deleteVehicle = async (id) => {
  const response = await api.delete(
    `/vehicles/${id}`
  );

  return response.data;
};

export const purchaseVehicle = async (id) => {
  const response = await api.post(
    `/vehicles/${id}/purchase`
  );

  return response.data;
};

export const restockVehicle = async (
  id,
  quantity
) => {
  const response = await api.post(
    `/vehicles/${id}/restock`,
    {
      quantity,
    }
  );

  return response.data;
};












export default api;