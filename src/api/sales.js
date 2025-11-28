import api from "./axios";

export const createSale = (data) =>
  api.post("/ventas", data).then((r) => r.data);
export const getDetalleVenta = (id) =>
  api.get(`/ventas/${id}/detalle`).then((r) => r.data);
export const getVentasDelDia = () => api.get("/ventas/dia").then((r) => r.data);
