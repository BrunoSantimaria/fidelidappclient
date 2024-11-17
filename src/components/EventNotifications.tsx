import { toast } from "react-toastify";
import { useNotifications } from "../context/NotificationContext";
import { useAuthSlice } from "../hooks/useAuthSlice";
import { useEffect } from "react";

export const EventNotifications = () => {
  const { user } = useAuthSlice();
  const url = import.meta.env.VITE_API_URL;
  const { dispatch } = useNotifications();

  useEffect(() => {
    if (!user?.accounts?._id) return;

    const setupEventListeners = () => {
      const token = localStorage.getItem("token");
      console.log("🔌 Configurando SSE...");

      const eventSource = new EventSource(`${url}/api/events/${user.accounts._id}?token=${token}`, { withCredentials: true });

      // Confirmar conexión establecida
      eventSource.onopen = () => {
        console.log("🟢 Conexión SSE establecida");
        toast.success("Conectado al servidor de notificaciones", {
          position: "top-right",
          autoClose: 2000,
        });
      };

      // Mejorar el manejo de errores
      eventSource.onerror = (error) => {
        console.error("🔴 Error en la conexión SSE:", error);
        toast.error("Se perdió la conexión con el servidor de notificaciones", {
          position: "top-right",
          autoClose: 3000,
        });
        eventSource.close();
      };

      // Listener general para debugging
      eventSource.onmessage = (event) => {
        console.log("📨 Evento SSE recibido:", event);
      };

      // Unión a promoción
      eventSource.addEventListener("promotion_join", (event) => {
        try {
          const data = JSON.parse(event.data);
          toast.success(`¡${data.clientName} se unió a la promoción ${data.promotionTitle}!`);
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: Date.now().toString(),
              message: `¡${data.clientName} se unió a la promoción ${data.promotionTitle}!`,
              type: "success",
              timestamp: new Date(),
              read: false,
            },
          });
        } catch (error) {
          console.error("Error al procesar evento promotion_join:", error);
        }
      });

      // Creación de promoción
      eventSource.addEventListener("promotion_created", (event) => {
        try {
          const data = JSON.parse(event.data);
          toast.success(`Nueva promoción creada: ${data.promotionTitle}`);
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: Date.now().toString(),
              message: `Nueva promoción creada: ${data.promotionTitle}`,
              type: "success",
              timestamp: new Date(),
              read: false,
            },
          });
        } catch (error) {
          console.error("Error al procesar evento promotion_created:", error);
        }
      });

      // Promoción expirada
      eventSource.addEventListener("promotion_expired", (event) => {
        try {
          const data = JSON.parse(event.data);
          toast.warning(`La promoción ${data.promotionTitle} ha expirado`, {
            position: "top-right",
            autoClose: 5000,
          });
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: Date.now().toString(),
              message: `La promoción ${data.promotionTitle} ha expirado`,
              type: "warning",
              timestamp: new Date(),
              read: false,
            },
          });
        } catch (error) {
          console.error("Error al procesar evento promotion_expired:", error);
        }
      });

      // Envío de email
      eventSource.addEventListener("email_sent", (event) => {
        try {
          const data = JSON.parse(event.data);
          toast.info(data.message);
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: Date.now().toString(),
              message: data.message,
              type: "info",
              timestamp: new Date(),
              read: false,
            },
          });
        } catch (error) {
          console.error("Error al procesar evento email_sent:", error);
        }
      });

      // Visita registrada
      eventSource.addEventListener("visit_added", (event) => {
        try {
          const data = JSON.parse(event.data);
          toast.info(`${data.clientName} registró una visita en ${data.promotionTitle}`);
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: Date.now().toString(),
              message: `${data.clientName} registró una visita en ${data.promotionTitle}`,
              type: "info",
              timestamp: new Date(),
              read: false,
            },
          });
        } catch (error) {
          console.error("Error al procesar evento visit_added:", error);
        }
      });

      // Puntos agregados
      eventSource.addEventListener("points_added", (event) => {
        try {
          const data = JSON.parse(event.data);
          toast.info(`${data.clientName} sumó ${data.points} puntos en ${data.promotionTitle}. Total: ${data.totalPoints} puntos`);
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: Date.now().toString(),
              message: `${data.clientName} sumó ${data.points} puntos en ${data.promotionTitle}. Total: ${data.totalPoints} puntos`,
              type: "info",
              timestamp: new Date(),
              read: false,
            },
          });
        } catch (error) {
          console.error("Error al procesar evento points_added:", error);
        }
      });

      // Canje de premio
      eventSource.addEventListener("reward_redeemed", (event) => {
        try {
          const data = JSON.parse(event.data);
          toast.success(`${data.clientName} canjeó ${data.rewardDescription} en ${data.promotionTitle}`);
          dispatch({
            type: "ADD_NOTIFICATION",
            payload: {
              id: Date.now().toString(),
              message: `${data.clientName} canjeó ${data.rewardDescription} en ${data.promotionTitle}`,
              type: "success",
              timestamp: new Date(),
              read: false,
            },
          });
        } catch (error) {
          console.error("Error al procesar evento reward_redeemed:", error);
        }
      });

      return eventSource;
    };

    const eventSource = setupEventListeners();

    return () => {
      if (eventSource) {
        console.log("🔌 Cerrando conexión SSE");
        eventSource.close();
      }
    };
  }, [user?.accounts?._id, url, dispatch]);

  return null;
};
