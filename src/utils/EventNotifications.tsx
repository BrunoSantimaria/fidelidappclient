import React, { useEffect } from "react";
import { showToast } from "./toast";
import EventService from "../services/eventService";

const EventNotifications = ({ accountId }) => {
  useEffect(() => {
    const setupEventListeners = () => {
      const eventSource = new EventSource(`/api/events/${accountId}`);

      eventSource.addEventListener("promotion_join", (event) => {
        const data = JSON.parse(event.data);
        showToast.success(`¡${data.clientName} se unió a la promoción ${data.promotionTitle}!`);
      });

      eventSource.addEventListener("points_added", (event) => {
        const data = JSON.parse(event.data);
        showToast.info(`${data.clientName} sumó ${data.points} puntos en ${data.promotionTitle}. Total: ${data.totalPoints} puntos`);
      });

      eventSource.addEventListener("promotion_redeem", (event) => {
        const data = JSON.parse(event.data);
        showToast.success(`¡${data.clientName} canjeó su premio en ${data.promotionTitle}!`);
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

  return null;
};

export default EventNotifications;
