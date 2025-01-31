import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Card } from "@/components/ui/card";
import api from "../../../utils/api";
import { useAuthSlice } from "@/hooks/useAuthSlice";
import { format } from "date-fns";

interface Agenda {
  _id: string;
  name: string;
  description: string;
  uniqueLink: string;
}

interface Appointment {
  _id: string;
  startTime: string;
  endTime: string;
  clientName: string;
  status: string;
}

export const CalendarView = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [agendas, setAgendas] = useState<Agenda[]>([]);
  const [selectedAgendaId, setSelectedAgendaId] = useState<string | null>(null);
  const { user } = useAuthSlice();
  console.log(user);
  const accountId = user?.accounts?._id;

  useEffect(() => {
    if (accountId) {
      fetchAgendas();
    }
  }, [accountId]);

  useEffect(() => {
    if (selectedAgendaId) {
      fetchAppointments();
    }
  }, [selectedAgendaId]);

  const fetchAgendas = async () => {
    try {
      const response = await api.get(`/api/agenda/account/${accountId}`);
      setAgendas(response.data);
      // Seleccionar la primera agenda por defecto si existe
      if (response.data.length > 0 && !selectedAgendaId) {
        setSelectedAgendaId(response.data[0]._id);
      }
    } catch (error) {
      console.error("Error al cargar las agendas:", error);
      toast.error("Error al cargar las agendas");
    }
  };

  const fetchAppointments = async () => {
    if (!selectedAgendaId) return;

    try {
      const response = await api.get(`/api/agenda/${selectedAgendaId}/appointments`);
      const formattedEvents = response.data.map((apt: Appointment) => ({
        id: apt._id,
        title: apt.clientName || "Reservado",
        start: apt.startTime,
        end: apt.endTime,
        backgroundColor: getStatusColor(apt.status),
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error("Error al cargar las citas:", error);
      toast.error("Error al cargar las citas");
    }
  };

  const fetchAvailableSlots = async (date: Date) => {
    if (!selectedAgendaId) return;

    try {
      const formattedDate = format(date, "yyyy-MM-dd");
      const response = await api.get(`/api/agenda/${selectedAgendaId}/available-slots?date=${formattedDate}`);

      console.log("Available slots response:", response.data);

      return response.data.availableSlots;
    } catch (error) {
      console.error("Error detallado:", error.response?.data || error.message);
      toast.error("Error al obtener horarios disponibles");
      return [];
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "#4CAF50";
      case "pending":
        return "#FFC107";
      case "cancelled":
        return "#F44336";
      default:
        return "#2196F3";
    }
  };

  const handleDateSelect = (selectInfo: any) => {
    toast.info("Función de selección de fecha en desarrollo");
  };

  const handleEventClick = (clickInfo: any) => {
    toast.info(`Cita: ${clickInfo.event.title}`);
  };

  const handleAgendaSelect = (agendaId: string) => {
    setSelectedAgendaId(agendaId);
  };

  return (
    <div className='flex flex-col gap-4 p-4'>
      <h2 className='text-2xl font-bold mb-4'>Mis Agendas</h2>

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6'>
        {agendas.map((agenda) => (
          <Card
            key={agenda._id}
            className={`p-4 cursor-pointer transition-all ${selectedAgendaId === agenda._id ? "border-2 border-blue-500" : ""}`}
            onClick={() => handleAgendaSelect(agenda._id)}
          >
            <h3 className='text-xl font-bold'>{agenda.name}</h3>
            <p className='text-gray-600'>{agenda.description}</p>
            <div className='mt-2'>
              <p className='text-sm text-gray-500'>Link de agenda:</p>
              <code className='bg-gray-100 p-1 rounded text-sm block mt-1 overflow-x-auto'>{`${window.location.origin}/agenda/${agenda.uniqueLink}`}</code>
            </div>
          </Card>
        ))}
      </div>

      {selectedAgendaId && (
        <Card className='p-4'>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView='timeGridWeek'
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={events}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            select={handleDateSelect}
            eventClick={handleEventClick}
            locale='es'
            slotMinTime='00:00:00'
            slotMaxTime='24:00:00'
            allDaySlot={false}
            height='auto'
            expandRows={true}
          />
        </Card>
      )}
    </div>
  );
};
