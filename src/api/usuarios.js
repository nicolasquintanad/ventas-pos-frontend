import api from "./axios";
import { getUserLS } from "../utils/authStorage";

const user = getUserLS();

// Obtener lista de usuarios
export const getUsuarios = () => {
  const user = getUserLS();
  return api.get(`/usuarios?idAdmin=${user.id}`).then((r) => r.data);
};

export const crearUsuario = (data) => {
  const user = getUserLS();
  return api
    .post(`/usuarios/crear?idAdmin=${user.id}`, data)
    .then((r) => r.data);
};

export const editarUsuario = (id, data) => {
  const user = getUserLS();
  return api
    .put(`/usuarios/editar/${id}?idAdmin=${user.id}`, data)
    .then((r) => r.data);
};

export const cambiarEstadoUsuario = (id) => {
  const user = getUserLS();
  return api
    .delete(`/usuarios/estado/${id}?idAdmin=${user.id}`)
    .then((r) => r.data);
};
