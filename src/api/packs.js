import api from "./axios";

// Crear pack
export const createPack = (data) =>
  api.post("/packs", data).then((r) => r.data);

// Listar packs
export const getPacks = () => api.get("/packs").then((r) => r.data);

// Obtener detalles de pack
export const getPackDetails = (id) =>
  api.get(`/packs/${id}/detalles`).then((r) => r.data);
