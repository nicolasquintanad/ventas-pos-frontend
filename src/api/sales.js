import api from "./axios";

export const createSale = (data) =>
  api.post("/ventas", data).then((r) => r.data);
