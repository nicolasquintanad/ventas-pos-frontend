import api from "./axios";

// Listar cajas disponibles
export const getCajas = () => api.get("/caja").then((r) => r.data);

// Caja activa del usuario actual
export const getCajaActiva = async (idUsuario) => {
  const res = await api.get(`/caja/activa/${idUsuario}`);
  return res.data;
};

// Abrir caja
export const abrirCaja = (idUsuario, idCaja, montoInicial) =>
  api.post(
    `/caja/apertura?idUsuario=${idUsuario}&idCaja=${idCaja}&montoInicial=${montoInicial}`
  );

// Cerrar caja
export const cerrarCaja = (idUsuario) =>
  api.post(`/caja/cierre?idUsuario=${idUsuario}`).then((r) => r.data);
