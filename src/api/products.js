import api from "./axios";

export const getProducts = () => api.get("/products").then((r) => r.data);
export const getProductTypes = () =>
  api.get("/products/types").then((r) => r.data);
export const createProduct = (data) =>
  api.post("/products", data).then((r) => r.data);
export const updateProduct = (id, data) =>
  api.put(`/products/${id}`, data).then((r) => r.data);
export const deleteProduct = (id) =>
  api.delete(`/products/${id}`).then((r) => r.data);
export const getStockProducto = (id) =>
  api.get(`/products/stock/${id}`).then((r) => r.data);
export const getProductproductTypes = () =>
  api.get("/products/product-types").then((r) => r.data);

export const createProductType = (data) =>
  api.post("/types", data).then((r) => r.data);

export const updateProductType = (id, data) =>
  api.put(`/types/${id}`, data).then((r) => r.data);

export const deleteProductType = (id) =>
  api.delete(`/types/${id}`).then((r) => r.data);
export const getAlertasStock = () =>
  api.get("/products/alertas-stock").then((r) => r.data);
export const getAlertasResumen = () =>
  api.get("/products/alertas-resumen").then((r) => r.data);
export const getProductosCriticos = () =>
  api.get("/products/productos-criticos").then((r) => r.data);
