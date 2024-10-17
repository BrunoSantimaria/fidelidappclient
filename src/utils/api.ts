import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;
export const baseURL = API_URL;

axios.defaults.withCredentials = true; // Con esto, las cookies se enviarán automáticamente

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Asegura que las cookies se envíen en solicitudes CORS
});

// Interceptor de solicitudes
api.interceptors.request.use(
  (config) => {
    // No necesitas agregar manualmente las cookies aquí. Las cookies
    // se enviarán automáticamente si están configuradas con withCredentials.
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
    return Promise.reject(error);
  }
);

export default api;
