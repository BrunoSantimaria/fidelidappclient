import React, { useEffect } from "react";
import { toast } from "react-toastify";
import EventService from "../services/eventService";

const EventNotifications = ({ accountId }) => {
  useEffect(() => {
    const token = localStorage.getItem("token");

    const setupEventListeners = () => {
      const eventSource = new EventSource(`/api/events/${accountId}`);

      eventSource.addEventListener("promotion_join", (event) => {
        const data = JSON.parse(event.data);
        toast.success(`¡${data.clientName} se unió a la promoción ${data.promotionTitle}!`, {
          position: "top-right",
          autoClose: 5000,
        });
      });

      eventSource.addEventListener("points_added", (event) => {
        const data = JSON.parse(event.data);
        toast.info(
          `${data.clientName} sumó ${data.points} puntos en ${data.promotionTitle}. 
           Total: ${data.totalPoints} puntos`,
          {
            position: "top-right",
            autoClose: 5000,
          }
        );
      });

      eventSource.addEventListener("promotion_redeem", (event) => {
        const data = JSON.parse(event.data);
        toast.success(`¡${data.clientName} canjeó su premio en ${data.promotionTitle}!`, {
          position: "top-right",
          autoClose: 5000,
        });
      });

      return eventSource;
    };

    const eventSource = setupEventListeners();

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [accountId]);

  return null; // Este componente no renderiza nada visualmente
};

export default EventNotifications;
