import api from "./axios";

export const getProveedores = async () => {
  const res = await api.get("/proveedores");
  return res.data;
};
export const createProveedores = (data) =>
  api.post("/proveedores", data).then((r) => r.data);

export const updateProveedores = (id, data) =>
  api.put(`/proveedores/${id}`, data).then((r) => r.data);

export const deleteProveedores = (id) =>
  api.delete(`/proveedores/${id}`).then((r) => r.data);
