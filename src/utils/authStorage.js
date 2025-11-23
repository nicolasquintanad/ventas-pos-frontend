export const getUserLS = () => {
  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

export const setUserLS = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearUserLS = () => {
  localStorage.removeItem("user");
};
