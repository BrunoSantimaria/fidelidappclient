export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateName = (isRegister, name) => {
  return isRegister ? (name.length > 0 ? "" : "El nombre es requerido") : "";
};
