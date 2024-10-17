import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
export const baseURL = API_URL;

axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor de solicitudes
api.interceptors.request.use(
  (config) => {
    // Asegúrate de que la cookie se envía en las solicitudes
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("authToken="))
      ?.split("=")[1];

    if (token) {
      // Agregar la cookie manualmente si es necesario
      config.headers["Cookie"] = `token=${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de respuestas
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Manejar errores aquí
    // if (error.response && error.response.status === 401) {
    //   // Por ejemplo, redireccionar al login si el token expira
    //   // window.location.href = '/login';
    // }
    return Promise.reject(error);
  }
);

export default api;
