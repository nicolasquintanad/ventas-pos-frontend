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

export const getSugerenciasHoy = () =>
  api.get("/proveedores/sugerencias-hoy").then((r) => r.data);

export const sendSugerenciasHoyEmail = () =>
  api.post("/proveedores/sugerencias-hoy/email").then((r) => r.data);

// export const getSugerenciasByDate = async (fecha) => {
//   const resp = await fetch(
//     api.get(`/proveedores/sugerencias-por-dia?fecha=${fecha}`)
//   );
//   return await resp.json();
// };
export const getSugerenciasByDate = (fecha) =>
  api
    .get(`/proveedores/sugerencias-por-dia?fecha=${fecha}`)
    .then((r) => r.data);
