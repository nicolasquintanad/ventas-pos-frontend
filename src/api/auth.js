import api from "./axios";

export const loginRequest = (username, password) =>
  api.post("/auth/login", { username, password }).then((r) => r.data);
