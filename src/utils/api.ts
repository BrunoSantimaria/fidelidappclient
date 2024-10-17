import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;
export const baseURL = API_URL;

axios.defaults.withCredentials = true; // Para enviar cookies automáticamente

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Asegura que las cookies se envíen en solicitudes CORS
});

// Interceptor de solicitudes
api.interceptors.request.use(
  (config) => {
    // Obtener el token del localStorage
    const token = localStorage.getItem("token");

    // Si el token existe, lo agregamos al encabezado Authorization
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
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
    // Manejar errores aquí, por ejemplo, refrescar el token o redirigir al login
    return Promise.reject(error);
  }
);

export default api;
