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
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { BiInfoCircle } from "react-icons/bi";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const steps = ["Fecha", "Hora", "Detalles", "Confirmación"];

const theme = createTheme({
  palette: {
    primary: {
      main: "#5b7898",
    },
  },
});

export const AvailableSlotsTable = ({ agendaId, name, description }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [appointmentWay, setAppointmentWay] = useState("presencial");

  useEffect(() => {
    const fetchAgendaData = async () => {
      try {
        const response = await api.get(`/api/agenda/by-link/${agendaId}`);
        console.log(response.data);
        setAgendaData(response.data);

        if (response.data.way !== "ambas") {
          setAppointmentWay(response.data.way);
        }

        if (response.data.type === "recurring") {
          setAvailableDays(response.data.recurringConfig.daysOfWeek || []);
          const nextAvailableDay = findNextAvailableDay(dayjs());
          setSelectedDate(nextAvailableDay);
        }
      } catch (error) {
        console.error("Error al cargar la agenda:", error);
      }
    };

    fetchAgendaData();
  }, [agendaId]);

  const findNextAvailableDay = (startDate) => {
    let date = dayjs(startDate);
    let daysChecked = 0;

    if (availableDays.includes(date.day())) {
      return date;
    }

    while (daysChecked < 14) {
      date = date.add(1, "day");
      if (availableDays.includes(date.day())) {
        return date;
      }
      daysChecked++;
    }
    return date;
  };

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDate]);

  const fetchAvailableSlots = async () => {
    try {
      const formattedDate = selectedDate.format("YYYY-MM-DD");
      const agendaResponse = await api.get(`/api/agenda/by-link/${agendaId}`);
      const appointmentsResponse = await api.get(`/api/agenda/${agendaId}/appointments?date=${formattedDate}`);
      const existingAppointments = appointmentsResponse.data;
      if (agendaResponse.data.recurringConfig) {
        const { timeSlots } = agendaResponse.data.recurringConfig;
        const duration = agendaResponse.data.duration;
        const slots = [];

        for (const timeSlot of timeSlots) {
          let currentTime = dayjs(`${formattedDate} ${timeSlot.start}`);
          const endTime = dayjs(`${formattedDate} ${timeSlot.end}`);

          while (currentTime.add(duration, "minutes").isSameOrBefore(endTime)) {
            const slotStartTime = currentTime;
            const slotEndTime = currentTime.add(duration, "minutes");

            const conflictingAppointments = existingAppointments.filter((appointment) => {
              const appointmentStart = dayjs(appointment.startTime);
              const appointmentEnd = dayjs(appointment.endTime);
              return slotStartTime.isSameOrBefore(appointmentEnd) && slotEndTime.isSameOrAfter(appointmentStart);
            });

            if (conflictingAppointments.length < (timeSlot.capacity || 1)) {
              slots.push({
                startTime: slotStartTime,
                endTime: slotEndTime,
                availableCapacity: (timeSlot.capacity || 1) - conflictingAppointments.length,
                totalCapacity: timeSlot.capacity || 1,
              });
            }

            currentTime = currentTime.add(duration, "minutes");
          }
        }

        console.log("Slots generados:", slots);
        setAvailableSlots(slots);
      }
    } catch (error) {
      console.error("Error al cargar horarios:", error);
      toast.error("Error al cargar horarios disponibles");
    }
  };

  useEffect(() => {
    if (selectedDate && agendaData) {
      fetchAvailableSlots();
    }
  }, [selectedDate, agendaData]);

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      if (currentStep === 2) {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(clientEmail)) {
          toast.error("Por favor ingresa un correo electrónico válido");
          return;
        }
      }
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

  const checkPendingAppointments = async (email) => {
    try {
      const response = await api.get(`/api/agenda/appointments/pending?email=${email}`);
      console.log("Citas pendientes:", response.data);
      return response.data.count || 0;
    } catch (error) {
      console.error("Error al verificar citas pendientes:", error);
      return 0;
    }
  };

  const handleBookingConfirmation = async () => {
    try {
      setIsSubmitting(true);
      const pendingCount = await checkPendingAppointments(clientEmail);
      if (pendingCount >= 3) {
        toast.error("No puedes agendar más citas. Tienes más de 3 citas pendientes.");
        return;
      }

      const appointmentData = {
        agendaId,
        startTime: selectedSlot?.startTime.format(),
        endTime: selectedSlot?.endTime.format(),
        clientName,
        clientEmail,
        clientPhone,
        notes,
        numberOfPeople,
        way: appointmentWay,
        virtualLink: agendaData?.virtualLink || "",
      };
      console.log(appointmentData);
      await api.post("/api/agenda/appointments", appointmentData);
      setShowConfirmation(true);
    } catch (error) {
      console.error("Error al confirmar la reserva:", error);
      toast.error("Error al confirmar la reserva");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDateDisabled = (date) => {
    if (!availableDays.length) return true;

    const day = dayjs(date).day();
    const isAvailableDay = availableDays.includes(day);
    const isPastDate = dayjs(date).isBefore(dayjs(), "day");

    return !isAvailableDay || isPastDate;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className='space-y-4 '>
            <div className='p-4 bg-white rounded-lg shadow-md'>
              <ThemeProvider theme={theme}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='es'>
                  <DatePicker
                    label='Selecciona una fecha'
                    value={selectedDate}
                    onChange={(newValue) => {
                      if (newValue) {
                        const nextAvailable = findNextAvailableDay(newValue);
                        setSelectedDate(nextAvailable);
                      }
                    }}
                    disablePast
                    maxDate={dayjs().add(3, "months")}
                    shouldDisableDate={isDateDisabled}
                    views={["day"]}
                    format='DD/MM/YYYY'
                    sx={{
                      width: "100%",
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "#5b7898",
                        },
                        "&:hover fieldset": {
                          borderColor: "#5b7898",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#5b7898",
                        },
                      },
                      "& .MuiInputLabel-root": {
                        color: "#5b7898",
                      },
                    }}
                  />
                </LocalizationProvider>
              </ThemeProvider>
            </div>
            {availableSlots.length > 0 && (
              <div className='text-center mt-4'>
                <p className='text-sm text-[#5b7898]'>
                  {availableSlots.length} horarios disponibles para el {selectedDate.format("DD/MM/YYYY")}
                </p>
              </div>
            )}
          </div>
        );
      case 1:
        return (
          <div className='space-y-4 '>
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
              <Label htmlFor='way'>Modalidad</Label>
              <select
                id='way'
                value={appointmentWay}
                onChange={(e) => setAppointmentWay(e.target.value)}
                disabled={agendaData?.way !== "ambas"}
                className={`w-full p-2 border rounded-md ${agendaData?.way !== "ambas" ? "bg-gray-100" : "bg-white"}`}
              >
                <option value='presencial'>Presencial</option>
                <option value='virtual'>Virtual</option>
              </select>
            </div>
            {agendaData?.requiresCapacity && (
              <div>
                <Label htmlFor='numberOfPeople'>Número de personas</Label>
                <Input id='numberOfPeople' type='number' value={numberOfPeople} onChange={(e) => setNumberOfPeople(parseInt(e.target.value))} />
              </div>
            )}

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
      <Card className='w-full max-w-md mx-auto mt-8 my-0 flex items-center justify-center mt-40'>
        <CardContent className='pt-6'>
          <div className='text-center'>
            <BiInfoCircle className='w-16 h-16 text-green-500 mx-auto mb-4' />
            <h2 className='text-2xl font-bold mb-2'>¡Te enviamos un correo para confirmar la reserva!</h2>
            {/* <p className='text-gray-600 mb-4'>
              Gracias por tu reserva. Te esperamos el {selectedDate.format("DD/MM/YYYY")} a las {selectedSlot?.startTime.format("HH:mm")}.
            </p> */}
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
                (currentStep === 2 && (!clientName || !clientEmail || !clientPhone)) ||
                (currentStep === steps.length - 1 && isSubmitting)
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
              disabled={
                (currentStep === 0 && !selectedDate) ||
                (currentStep === 1 && !selectedSlot) ||
                (currentStep === 2 && (!clientName || !clientEmail || !clientPhone)) ||
                (currentStep === steps.length - 1 && isSubmitting)
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
