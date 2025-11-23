import api from "./axios";

export const getKardexByProduct = (idProducto) =>
  api.get(`/products/historial/${idProducto}`).then((res) => res.data);
