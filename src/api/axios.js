import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:44334",
});

// Agregar token automáticamente a cada request
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});

export default api;
