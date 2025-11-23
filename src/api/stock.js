import api from "./axios";

// Registrar entrada de stock
export const createStockEntry = (payload) =>
  api.post("/stock/entrada", payload).then((r) => r.data);

// Listar entradas con filtros opcionales
export const getStockEntries = (filters = {}) => {
  const params = new URLSearchParams();

  if (filters.desde) params.append("desde", filters.desde);
  if (filters.hasta) params.append("hasta", filters.hasta);
  if (filters.idProducto) params.append("idProducto", filters.idProducto);
  if (filters.idProveedor) params.append("idProveedor", filters.idProveedor);

  return api
    .get(`/stock/entrada/list?${params.toString()}`)
    .then((r) => r.data);
};

// Obtener proveedores
export const getProveedores = () => api.get("/proveedores").then((r) => r.data);

export const anularEntradaStock = (id, idUsuario) =>
  api
    .put(`/stock/entrada/anular/${id}?idUsuario=${idUsuario}`)
    .then((r) => r.data);
