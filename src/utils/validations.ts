export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (password) => {
  return password.trim().length >= 6;
};

export const validateName = (isRegister, name) => {
  return isRegister ? (name.trim().length > 0 ? "" : "El nombre es requerido") : "";
};
