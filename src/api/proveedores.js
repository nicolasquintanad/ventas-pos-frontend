import api from "./axios";

export const getProveedores = async () => {
  const res = await api.get("/proveedores");
  return res.data;
};
