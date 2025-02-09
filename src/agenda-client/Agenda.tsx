import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AvailableSlotsTable from "./AvailableSlotsTable.tsx";

import api from "../utils/api.js";

const fetchAvailableSlots = async (agendaId) => {
  try {
    // Primero intentar obtener por ID
    let response = await api.get(`/api/agenda/${agendaId}/available-slots`);

    if (response.status === 404) {
      // Si no se encuentra por ID, intentar por uniqueLink
      response = await api.get(`/api/agenda/by-link/${agendaId}`);
    }

    const data = response.data;
    return {
      availableSlotsByDay: data.availableSlotsByDay || {},
      name: data.name || "",
      description: data.description || "",
      type: data.type || "",
      requiresCapacity: data.requiresCapacity || false,
      recurringConfig: {
        daysOfWeek: data.recurringConfig?.daysOfWeek || [],
        timeSlots: data.recurringConfig?.timeSlots || [],
        validFrom: data.recurringConfig?.validFrom || null,
        validUntil: data.recurringConfig?.validUntil || null,
        duration: data.recurringConfig?.duration || 0,
        slots: data.recurringConfig?.slots || 0,
      },
      uniqueLink: data.uniqueLink || "",
    };
  } catch (error) {
    console.error("Error al obtener las horas disponibles:", error);
    return {
      availableSlotsByDay: {},
      name: "",
      description: "",
      type: "",
      requiresCapacity: false,
      recurringConfig: {
        daysOfWeek: [],
        timeSlots: [],
        validFrom: null,
        validUntil: null,
        duration: 0,
        slots: 0,
      },
      uniqueLink: "",
    };
  }
};

const Agenda = () => {
  const { agendaId } = useParams();
  const [availableSlotsByDay, setAvailableSlotsByDay] = useState({});
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [agendaConfig, setAgendaConfig] = useState({
    type: "",
    requiresCapacity: false,
    recurringConfig: {
      daysOfWeek: [],
      timeSlots: [],
      validFrom: null,
      validUntil: null,
      duration: 0,
      slots: 0,
    },
    uniqueLink: "",
  });

  useEffect(() => {
    const getAvailableSlots = async () => {
      const response = await fetchAvailableSlots(agendaId);
      setName(response.name);
      setDescription(response.description);
      setAvailableSlotsByDay(response.availableSlotsByDay);
      setAgendaConfig({
        type: response.type,
        requiresCapacity: response.requiresCapacity,
        recurringConfig: response.recurringConfig,
        uniqueLink: response.uniqueLink,
      });
    };
    getAvailableSlots();
  }, [agendaId]);

  return (
    <div className=' bg-gray-100/20 w-screen m-auto m-0'>
      <AvailableSlotsTable availableSlotsByDay={availableSlotsByDay} name={name} agendaId={agendaId} description={description} />
    </div>
  );
};

export default Agenda;
