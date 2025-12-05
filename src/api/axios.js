import axios from "axios";
import { message, Modal } from "antd";

const api = axios.create({
  //Descomentar al trabajar desarrollo
  baseURL: "https://localhost:44334",

  //Modificar al subir en el servidor
  // baseURL: "http://192.168.1.50:5000",
});

// Agregar token automáticamente a cada request
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }

  return config;
});

// 🚨 MANEJO GLOBAL DE ERRORES
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const data = error.response?.data;
    let msg =
      data?.Message || // API en mayúscula
      data?.message || // API en minúscula
      data?.error || // algunos controladores usan "error"
      error.message || // error axios
      "Error inesperado 😥"; // fallback

    // Si el backend envía un objeto, convertirlo a string
    if (typeof msg === "object") msg = JSON.stringify(msg);

    Modal.error({
      title: "⚠️ ¡Atención!",
      content: msg,
      okText: "Entendido",
      zIndex: 99999, // 👈 ahora siempre arriba
      maskClosable: true,
    });

    return Promise.reject(error);
  }
);

export default api;
