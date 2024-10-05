import axios from "axios";

// Configurar axios para incluir cookies en las solicitudes entre diferentes dominios
axios.defaults.withCredentials = true;

// Crear una instancia de axios con configuraciones por defecto
const api = axios.create({
  baseURL: "http://localhost:8080", // Cambia esta URL por la base URL de tu API
  timeout: 10000, // Tiempo de espera de 10 segundos
});

// Interceptor de solicitudes
api.interceptors.request.use(
  (config) => {
    // Puedes añadir aquí headers por defecto si es necesario
    // config.headers['Authorization'] = `Bearer ${tuToken}`;
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
    if (error.response && error.response.status === 401) {
      // Por ejemplo, redireccionar al login si el token expira
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
