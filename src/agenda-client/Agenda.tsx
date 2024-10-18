import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import AvailableSlotsTable from "./AvailableSlotsTable.tsx";
import ExistingAppointments from "./ExistingAppointments.tsx";
import api from "../utils/api.js";
import { NavBar } from "../layaout/NavBar.tsx";
import Footer from "../layaout/Footer.tsx";
api;

const fetchAvailableSlots = async (agendaId) => {
  try {
    const response = await api.get(`/api/agenda/getAvailableSlots/${agendaId}`);
    return { availableSlotsByDay: response.data.availableSlotsByDay, name: response.data.name, description: response.data.description };
  } catch (error) {
    console.error("Error al obtener las horas disponibles:", error);
    return {};
  }
};

const Agenda = () => {
  const { agendaId } = useParams();
  const [availableSlotsByDay, setAvailableSlotsByDay] = useState({});
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const getAvailableSlots = async () => {
      const { availableSlotsByDay, name, description } = await fetchAvailableSlots(agendaId);
      setName(name);
      setDescription(description);
      setAvailableSlotsByDay(availableSlotsByDay);
    };
    //asd
    getAvailableSlots();
  }, [agendaId]);
  const refs = {
    homeRef: useRef(null),
    servicesRef: useRef(null),
    patternRef: useRef(null),
    howItWorksRef: useRef(null),
    testimonialsRef: useRef(null),
    stepsRef: useRef(null),
    plansRef: useRef(null),
    faqsRef: useRef(null),
    contactRef: useRef(null),
  };
  return (
    <div className='mx-20'>
      <AvailableSlotsTable availableSlotsByDay={availableSlotsByDay} name={name} agendaId={agendaId} description={description} />
      <ExistingAppointments agendaId={agendaId} />
    </div>
  );
};

export default Agenda;
