"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, CheckCircle } from "lucide-react";
import dayjs from "dayjs";
import "dayjs/locale/es";
import api from "../utils/api";
import { toast } from "react-toastify";
import { es } from "date-fns/locale";

const steps = ["Fecha", "Hora", "Detalles", "Confirmación"];

const AvailableSlotsTable = ({ agendaId, name, description }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [availableDays, setAvailableDays] = useState([]);
  const [agendaData, setAgendaData] = useState(null);

  // Campos del formulario
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [numberOfPeople, setNumberOfPeople] = useState(1);

  useEffect(() => {
    const fetchAgendaData = async () => {
      try {
        const response = await api.get(`/api/agenda/by-link/${agendaId}`);
        console.log("Datos completos de la agenda:", response.data);
        setAgendaData(response.data);

        if (response.data.type === "recurring") {
          setAvailableDays(response.data.recurringConfig.daysOfWeek || []);
        }
      } catch (error) {
        console.error("Error al cargar la agenda:", error);
      }
    };

    fetchAgendaData();
  }, [agendaId]);

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDate, agendaId]);

  const fetchAvailableSlots = async () => {
    try {
      const formattedDate = selectedDate.format("YYYY-MM-DD");
      console.log("Fecha formateada:", formattedDate);

      // Obtener la agenda
      const agendaResponse = await api.get(`/api/agenda/by-link/${agendaId}`);
      console.log("Respuesta agenda:", agendaResponse.data);

      // Modificar la llamada para obtener solo las citas sin populate
      const appointmentsResponse = await api.get(`/api/agenda/${agendaId}/appointments?date=${formattedDate}`);
      const existingAppointments = appointmentsResponse.data;
      console.log("Citas existentes:", existingAppointments);

      if (agendaResponse.data.recurringConfig) {
        const { timeSlots } = agendaResponse.data.recurringConfig;
        const duration = agendaResponse.data.duration;
        const slots = [];
        const firstSlot = timeSlots[0];
        const capacity = firstSlot.capacity || 1;

        let currentTime = dayjs(`${formattedDate} ${firstSlot.start}`);
        const endTime = dayjs(`${formattedDate} ${firstSlot.end}`);

        while (currentTime.isBefore(endTime)) {
          const startTime = currentTime.clone();
          const endTime = startTime.clone().add(duration, "minutes");
          const existingBookings = existingAppointments.filter((appointment) => dayjs(appointment.startTime).isSame(startTime));

          // Calcular capacidad disponible considerando el número de personas por reserva
          const usedCapacity = existingBookings.reduce((total, appointment) => total + (appointment.numberOfPeople || 1), 0);
          const availableCapacity = capacity - usedCapacity;

          if (availableCapacity > 0) {
            slots.push({
              startTime,
              endTime,
              availableCapacity,
              totalCapacity: capacity,
            });
          }

          currentTime = currentTime.add(duration, "minutes");
        }

        console.log(
          "Slots generados:",
          slots.map((slot) => ({
            start: slot.startTime.format("HH:mm"),
            end: slot.endTime.format("HH:mm"),
            disponibles: slot.availableCapacity,
            capacidadTotal: slot.totalCapacity,
          }))
        );

        setAvailableSlots(slots);
      }
    } catch (error) {
      console.error("Error al cargar horarios:", error);
      toast.error("Error al cargar horarios disponibles");
    }
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleBookingConfirmation();
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBookingConfirmation = async () => {
    try {
      const appointmentData = {
        agendaId,
        startTime: selectedSlot.startTime.format(),
        endTime: selectedSlot.endTime.format(),
        clientName,
        clientEmail,
        clientPhone,
        notes,
        numberOfPeople,
      };
      console.log(appointmentData);
      await api.post("/api/agenda/appointments", appointmentData);
      setShowConfirmation(true);
    } catch (error) {
      console.error("Error al confirmar la reserva:", error);
      toast.error("Error al confirmar la reserva");
    }
  };

  const isDateDisabled = (date) => {
    if (!availableDays.length) return true;

    const day = dayjs(date).day();
    const isAvailableDay = availableDays.includes(day);
    const isPastDate = dayjs(date).isBefore(dayjs(), "day");

    console.log(
      "Evaluando fecha:",
      dayjs(date).format("YYYY-MM-DD"),
      "Día:",
      day,
      "Días disponibles:",
      availableDays,
      "Es día disponible:",
      isAvailableDay,
      "Es fecha pasada:",
      isPastDate
    );

    return !isAvailableDay || isPastDate;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className='space-y-4'>
            <div className='p-4 bg-white rounded-lg shadow-md flex justify-center'>
              <Calendar
                mode='single'
                selected={selectedDate.toDate()}
                onSelect={(date) => setSelectedDate(dayjs(date))}
                disabled={isDateDisabled}
                locale={es}
                fromDate={new Date()}
                toDate={dayjs().add(3, "months").toDate()}
                initialFocus
                classNames={{
                  months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                  month: "space-y-4",
                  caption: "flex justify-center pt-1 relative items-center h-10",
                  caption_label: "text-sm font-medium text-[#5b7898]",
                  nav: "flex items-center justify-center text-center absolute w-full",
                  nav_button:
                    "h-10 w-10 bg-[#5b7898] text-white hover:bg-[#5b7898]/90 rounded-md transition-colors text-center disabled:opacity-50 disabled:hover:bg-[#5b7898]",
                  nav_button_previous: "absolute left-1",
                  nav_button_next: "absolute right-1",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex",
                  head_cell: "text-[#5b7898] rounded-md w-9 font-semibold text-[0.8rem]",
                  row: "flex w-full mt-2",
                  cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-[#5b7898]/10",
                  day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100 rounded-md transition-colors focus:outline-none focus-visible:ring focus-visible:ring-[#5b7898] focus-visible:ring-opacity-50",
                  day_selected: "bg-[#5b7898] text-white hover:bg-[#5b7898] hover:text-white",
                  day_today: "bg-[#5b7898]/20 text-[#5b7898] font-semibold",
                  day_outside: "text-gray-400 opacity-50",
                  day_disabled: "text-gray-400 hover:bg-transparent opacity-50 cursor-not-allowed",
                  day_range_middle: "aria-selected:bg-[#5b7898]/20",
                  day_hidden: "invisible",
                }}
                components={{
                  DayContent: ({ date }) => {
                    const isDisabled = isDateDisabled(date);
                    const isSelected = selectedDate && dayjs(date).isSame(selectedDate, "day");
                    const isToday = dayjs(date).isSame(dayjs(), "day");

                    return (
                      <div
                        className={`
                          h-9 w-9 flex items-center justify-center rounded-md transition-colors
                          ${
                            isSelected
                              ? "bg-[#5b7898] text-white font-semibold"
                              : isDisabled
                              ? "text-gray-300 cursor-not-allowed bg-gray-50"
                              : isToday
                              ? "bg-[#5b7898]/20 text-[#5b7898] font-semibold hover:bg-[#5b7898]/30"
                              : "bg-[#5b7898]/20 text-[#5b7898] font-medium hover:bg-[#5b7898]/30 hover:text-[#5b7898] border-2 border-[#5b7898]"
                          }
                        `}
                      >
                        {date.getDate()}
                      </div>
                    );
                  },
                }}
              />
            </div>
            {availableSlots.length > 0 && (
              <div className='text-center mt-4'>
                <p className='text-sm text-[#5b7898]'>{availableSlots.reduce((total, slot) => total + slot.availableCapacity, 0)} espacios disponibles</p>
              </div>
            )}
          </div>
        );
      case 1:
        return (
          <div className='space-y-4'>
            {agendaData?.recurringConfig?.timeSlots[0]?.capacity > 1 && (
              <div className='mb-4 bg-white p-4 rounded-lg shadow-sm border border-[#5b7898]/20'>
                <Label htmlFor='people' className='text-sm font-medium text-[#5b7898]'>
                  Número de personas
                </Label>
                <div className='flex items-center space-x-2 mt-1'>
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() => setNumberOfPeople(Math.max(1, numberOfPeople - 1))}
                    disabled={numberOfPeople <= 1}
                    className='border-[#5b7898] text-[#5b7898] hover:bg-[#5b7898]/10'
                  >
                    -
                  </Button>
                  <Input
                    id='people'
                    type='number'
                    min={1}
                    max={Math.min(selectedSlot?.availableCapacity || 1, agendaData.recurringConfig.timeSlots[0].capacity)}
                    value={numberOfPeople}
                    onChange={(e) => setNumberOfPeople(parseInt(e.target.value))}
                    className='w-20 text-center border-[#5b7898]/20 focus:border-[#5b7898]'
                  />
                  <Button
                    type='button'
                    variant='outline'
                    size='sm'
                    onClick={() =>
                      setNumberOfPeople(Math.min(numberOfPeople + 1, selectedSlot?.availableCapacity || agendaData.recurringConfig.timeSlots[0].capacity))
                    }
                    disabled={numberOfPeople >= (selectedSlot?.availableCapacity || agendaData.recurringConfig.timeSlots[0].capacity)}
                    className='border-[#5b7898] text-[#5b7898] hover:bg-[#5b7898]/10'
                  >
                    +
                  </Button>
                </div>
              </div>
            )}
            <div className='grid grid-cols-2 gap-2'>
              {availableSlots.map((slot, index) => (
                <Button
                  key={index}
                  onClick={() => setSelectedSlot(slot)}
                  variant={selectedSlot === slot ? "default" : "outline"}
                  className={`p-2 h-auto transition-all ${
                    selectedSlot === slot ? "bg-[#5b7898] text-white hover:bg-[#5b7898]/90" : "border-[#5b7898]/20 hover:border-[#5b7898] hover:bg-[#5b7898]/10"
                  }`}
                  disabled={slot.availableCapacity < numberOfPeople}
                >
                  <div className='text-sm'>
                    <div className='font-semibold'>{slot.startTime.format("HH:mm")}</div>
                    <div className='text-xs'>
                      {slot.availableCapacity} disponible{slot.availableCapacity !== 1 && "s"}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        );
      case 2:
        return (
          <div className='space-y-4'>
            <div>
              <Label htmlFor='name'>Nombre</Label>
              <Input id='name' value={clientName} onChange={(e) => setClientName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor='email'>Correo electrónico</Label>
              <Input id='email' type='email' value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
            </div>
            <div>
              <Label htmlFor='phone'>Teléfono</Label>
              <Input id='phone' type='tel' value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} />
            </div>
            <div>
              <Label htmlFor='notes'>Notas adicionales</Label>
              <Textarea id='notes' value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
          </div>
        );
      case 3:
        return (
          <div className='space-y-4'>
            <p>
              <strong>Fecha:</strong> {selectedDate.format("DD/MM/YYYY")}
            </p>
            <p>
              <strong>Hora:</strong> {selectedSlot?.startTime.format("HH:mm")} - {selectedSlot?.endTime.format("HH:mm")}
            </p>
            <p>
              <strong>Nombre:</strong> {clientName}
            </p>
            <p>
              <strong>Correo electrónico:</strong> {clientEmail}
            </p>
            <p>
              <strong>Teléfono:</strong> {clientPhone}
            </p>
            <p>
              <strong>Notas:</strong> {notes || "Ninguna"}
            </p>
          </div>
        );
    }
  };

  if (showConfirmation) {
    return (
      <Card className='w-full max-w-md mx-auto mt-8'>
        <CardContent className='pt-6'>
          <div className='text-center'>
            <CheckCircle className='w-16 h-16 text-green-500 mx-auto mb-4' />
            <h2 className='text-2xl font-bold mb-2'>¡Reserva Confirmada!</h2>
            <p className='text-gray-600 mb-4'>
              Gracias por tu reserva. Te esperamos el {selectedDate.format("DD/MM/YYYY")} a las {selectedSlot?.startTime.format("HH:mm")}.
            </p>
            <Button onClick={() => window.location.reload()} className='mt-4'>
              Hacer otra reserva
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#5b7898]/5 to-[#5b7898]/10 p-4 flex items-center justify-center'>
      <Card className='w-full max-w-md shadow-lg bg-white'>
        <CardHeader className='pb-2'>
          <CardTitle className='text-2xl font-bold text-center text-[#5b7898]'>{name}</CardTitle>
          <p className='text-center text-[#5b7898]/80 text-sm'>{description}</p>
        </CardHeader>
        <CardContent>
          <div className='mb-6'>
            <div className='flex justify-between items-center'>
              {steps.map((step, index) => (
                <div key={step} className={`flex flex-col items-center ${index <= currentStep ? "text-[#5b7898]" : "text-[#5b7898]/40"}`}>
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-2 ${
                      index <= currentStep ? "bg-[#5b7898] text-white" : "bg-[#5b7898]/10 text-[#5b7898]"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <span className='text-xs'>{step}</span>
                </div>
              ))}
            </div>
          </div>
          {renderStepContent()}
          <div className='mt-6 flex justify-between'>
            {currentStep > 0 && (
              <Button onClick={handlePreviousStep} variant='outline' className='border-[#5b7898]/20 text-[#5b7898] hover:bg-[#5b7898]/10'>
                <ArrowLeft className='mr-2 h-4 w-4' /> Atrás
              </Button>
            )}
            <Button
              onClick={handleNextStep}
              className={`ml-auto bg-[#5b7898] hover:bg-[#5b7898]/90 text-white ${
                (currentStep === 0 && !selectedDate) ||
                (currentStep === 1 && !selectedSlot) ||
                (currentStep === 2 && (!clientName || !clientEmail || !clientPhone))
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={
                (currentStep === 0 && !selectedDate) ||
                (currentStep === 1 && !selectedSlot) ||
                (currentStep === 2 && (!clientName || !clientEmail || !clientPhone))
              }
            >
              {currentStep === steps.length - 1 ? "Confirmar Reserva" : "Siguiente"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AvailableSlotsTable;
