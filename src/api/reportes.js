import api from "./axios";

export const getReporteVentas = async (params) => {
  const res = await api.get("/reporte/ventas", { params });
  return res.data;
};

export const exportReporteExcel = async (params) => {
  return api.get("/reporte/ventas/excel", {
    params,
    responseType: "blob",
  });
};

export const exportReportePdf = async (params) => {
  return api.get("/reporte/ventas/pdf", {
    params,
    responseType: "blob",
  });
};

export const getReporteProductos = async (params) => {
  const res = await api.get("/reporte/productos", { params });
  return res.data;
};

export const getFiltrosReporteProductos = async () => {
  const res = await api.get("/reporte/productos-filtro");
  return res.data;
};
