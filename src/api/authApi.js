import { apiClient } from "./apiClient";

export function loginApi(email, password) {
  return apiClient("/auth/login", "POST", { email, password });
}

export function getProfileApi(token) {
  return apiClient("/auth/profile", "GET", null, token);
}
