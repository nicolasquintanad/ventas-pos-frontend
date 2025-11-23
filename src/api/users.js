import api from "./axios";

// Obtener lista de usuarios
export const getUsers = async () => {
  const res = await api.get("/users");
  return res.data;
};

// Crear usuario
export const createUser = async (payload) => {
  const res = await api.post("/users", payload);
  return res.data;
};

// Editar usuario
export const updateUser = async (id, payload) => {
  const res = await api.put(`/users/${id}`, payload);
  return res.data;
};

// Eliminar usuario
export const deleteUser = async (id) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};
