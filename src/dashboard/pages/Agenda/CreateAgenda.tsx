import { useState } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Grid,
  Typography,
  IconButton,
  Alert,
  Container,
} from "@mui/material";
import { TimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import api from "../../../utils/api";
import { useNavigate } from "react-router-dom";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useAuthSlice } from "@/hooks/useAuthSlice";

const DAYS_OF_WEEK = [
  { value: 1, label: "Lunes" },
  { value: 2, label: "Martes" },
  { value: 3, label: "Miércoles" },
  { value: 4, label: "Jueves" },
  { value: 5, label: "Viernes" },
  { value: 6, label: "Sábado" },
  { value: 0, label: "Domingo" },
];

export const CreateAgenda = () => {
  const navigate = useNavigate();
  const [agendaType, setAgendaType] = useState("recurring");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(60);
  const [slots, setSlots] = useState(1);
  const [requiresCapacity, setRequiresCapacity] = useState(false);
  const { user } = useAuthSlice();
  // Para agendas recurrentes
  const [selectedDays, setSelectedDays] = useState([]);
  const [timeSlots, setTimeSlots] = useState([{ start: dayjs().set("hour", 9).set("minute", 0), end: dayjs().set("hour", 10).set("minute", 0) }]);
  const [validFrom, setValidFrom] = useState(dayjs());
  const [validUntil, setValidUntil] = useState(dayjs().add(1, "year"));

  // Para eventos especiales
  const [specialDates, setSpecialDates] = useState([
    {
      date: dayjs(),
      timeSlots: [{ start: dayjs().set("hour", 9).set("minute", 0), end: dayjs().set("hour", 10).set("minute", 0) }],
    },
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const agendaData = {
        name,
        description,
        type: agendaType,
        duration,
        slots,
        requiresCapacity,
        accountId: user.accounts._id,
      };

      if (agendaType === "recurring") {
        agendaData.recurringConfig = {
          daysOfWeek: selectedDays,
          timeSlots: timeSlots.map((slot) => ({
            start: slot.start.format("HH:mm"),
            end: slot.end.format("HH:mm"),
          })),
          validFrom: validFrom.toISOString(),
          validUntil: validUntil.toISOString(),
        };
      } else {
        agendaData.specialDates = specialDates.map((special) => ({
          date: special.date.toISOString(),
          timeSlots: special.timeSlots.map((slot) => ({
            start: slot.start.format("HH:mm"),
            end: slot.end.format("HH:mm"),
          })),
        }));
      }

      await api.post("/api/agenda", agendaData);
      toast.success("Agenda creada exitosamente");
      navigate("/dashboard/agenda");
    } catch (error) {
      console.error("Error al crear la agenda:", error);
      toast.error("Error al crear la agenda");
    }
  };

  const addTimeSlot = () => {
    const lastSlot = timeSlots[timeSlots.length - 1];
    const newStart = lastSlot.end.clone();
    const newEnd = newStart.add(1, "hour");
    setTimeSlots([...timeSlots, { start: newStart, end: newEnd }]);
  };

  const removeTimeSlot = (index) => {
    setTimeSlots(timeSlots.filter((_, i) => i !== index));
  };

  const addSpecialDate = () => {
    setSpecialDates([
      ...specialDates,
      {
        date: dayjs(),
        timeSlots: [{ start: dayjs().set("hour", 9).set("minute", 0), end: dayjs().set("hour", 10).set("minute", 0) }],
      },
    ]);
  };

  const removeSpecialDate = (index) => {
    setSpecialDates(specialDates.filter((_, i) => i !== index));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth='lg' className='py-6 space-y-8'>
        <Card>
          <CardContent>
            <Typography variant='h5' gutterBottom>
              Crear Nueva Agenda
            </Typography>

            <Alert severity='info' className='mb-4'>
              <strong>Recurrente:</strong> Una agenda recurrente se repite en los días y horarios seleccionados.
            </Alert>
            <Alert severity='info' className='mb-4'>
              <strong>Evento Especial:</strong> Un evento especial ocurre en fechas y horarios específicos.
            </Alert>
            <Alert severity='info' className='mb-4'>
              <strong>Capacidad:</strong> Indica si es necesario especificar la cantidad de personas para la cita.
            </Alert>
            <Alert severity='info' className='mb-4'>
              <strong>Slots disponibles:</strong> Indica el número de citas disponibles en cada horario.
            </Alert>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant='h5' gutterBottom>
                    Crear Nueva Agenda
                  </Typography>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField fullWidth label='Nombre' value={name} onChange={(e) => setName(e.target.value)} required />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Tipo de Agenda</InputLabel>
                    <Select value={agendaType} onChange={(e) => setAgendaType(e.target.value)} label='Tipo de Agenda'>
                      <MenuItem value='recurring'>Recurrente</MenuItem>
                      <MenuItem value='special'>Evento Especial</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField fullWidth label='Descripción' multiline rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type='number'
                    label='Duración (minutos)'
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField fullWidth type='number' label='Slots disponibles' value={slots} onChange={(e) => setSlots(Number(e.target.value))} required />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={<Checkbox checked={requiresCapacity} onChange={(e) => setRequiresCapacity(e.target.checked)} />}
                    label='¿Requiere especificar cantidad de personas?'
                  />
                </Grid>

                {agendaType === "recurring" ? (
                  <>
                    <Grid item xs={12}>
                      <Typography variant='h6' gutterBottom>
                        Días y Horarios Recurrentes
                      </Typography>
                    </Grid>

                    <Grid item xs={12}>
                      <FormControl fullWidth>
                        <InputLabel>Días de la Semana</InputLabel>
                        <Select
                          multiple
                          value={selectedDays}
                          onChange={(e) => setSelectedDays(e.target.value)}
                          label='Días de la Semana'
                          renderValue={(selected) => selected.map((day) => DAYS_OF_WEEK.find((d) => d.value === day)?.label).join(", ")}
                        >
                          {DAYS_OF_WEEK.map((day) => (
                            <MenuItem key={day.value} value={day.value}>
                              <Checkbox checked={selectedDays.indexOf(day.value) > -1} />
                              {day.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>

                    {timeSlots.map((slot, index) => (
                      <Grid item xs={12} container spacing={2} key={index}>
                        <Grid item xs={5}>
                          <TimePicker
                            label='Hora inicio'
                            value={slot.start}
                            onChange={(newValue) => {
                              const newSlots = [...timeSlots];
                              newSlots[index].start = newValue;
                              setTimeSlots(newSlots);
                            }}
                          />
                        </Grid>
                        <Grid item xs={5}>
                          <TimePicker
                            label='Hora fin'
                            value={slot.end}
                            onChange={(newValue) => {
                              const newSlots = [...timeSlots];
                              newSlots[index].end = newValue;
                              setTimeSlots(newSlots);
                            }}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <IconButton color='error' onClick={() => removeTimeSlot(index)} disabled={timeSlots.length === 1}>
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    ))}

                    <Grid item xs={12}>
                      <Button startIcon={<AddIcon />} onClick={addTimeSlot} variant='outlined'>
                        Agregar Horario
                      </Button>
                    </Grid>
                  </>
                ) : (
                  <>
                    {specialDates.map((specialDate, dateIndex) => (
                      <Grid item xs={12} key={dateIndex}>
                        <Card variant='outlined'>
                          <CardContent>
                            <Grid container spacing={2}>
                              <Grid item xs={12}>
                                <Typography variant='subtitle1'>Fecha Especial {dateIndex + 1}</Typography>
                              </Grid>

                              {specialDate.timeSlots.map((slot, slotIndex) => (
                                <Grid item xs={12} container spacing={2} key={slotIndex}>
                                  <Grid item xs={5}>
                                    <TimePicker
                                      label='Hora inicio'
                                      value={slot.start}
                                      onChange={(newValue) => {
                                        const newDates = [...specialDates];
                                        newDates[dateIndex].timeSlots[slotIndex].start = newValue;
                                        setSpecialDates(newDates);
                                      }}
                                    />
                                  </Grid>
                                  <Grid item xs={5}>
                                    <TimePicker
                                      label='Hora fin'
                                      value={slot.end}
                                      onChange={(newValue) => {
                                        const newDates = [...specialDates];
                                        newDates[dateIndex].timeSlots[slotIndex].end = newValue;
                                        setSpecialDates(newDates);
                                      }}
                                    />
                                  </Grid>
                                  <Grid item xs={2}>
                                    <IconButton
                                      color='error'
                                      onClick={() => {
                                        const newDates = [...specialDates];
                                        newDates[dateIndex].timeSlots = newDates[dateIndex].timeSlots.filter((_, i) => i !== slotIndex);
                                        setSpecialDates(newDates);
                                      }}
                                      disabled={specialDate.timeSlots.length === 1}
                                    >
                                      <DeleteIcon />
                                    </IconButton>
                                  </Grid>
                                </Grid>
                              ))}

                              <Grid item xs={12}>
                                <Button
                                  startIcon={<AddIcon />}
                                  onClick={() => {
                                    const newDates = [...specialDates];
                                    const lastSlot = specialDate.timeSlots[specialDate.timeSlots.length - 1];
                                    newDates[dateIndex].timeSlots.push({
                                      start: lastSlot.end.clone(),
                                      end: lastSlot.end.add(1, "hour"),
                                    });
                                    setSpecialDates(newDates);
                                  }}
                                  variant='outlined'
                                  size='small'
                                >
                                  Agregar Horario
                                </Button>
                              </Grid>
                            </Grid>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}

                    <Grid item xs={12}>
                      <Button startIcon={<AddIcon />} onClick={addSpecialDate} variant='outlined'>
                        Agregar Fecha Especial
                      </Button>
                    </Grid>
                  </>
                )}

                <Grid item xs={12}>
                  <Button type='submit' variant='contained' color='primary' size='large' fullWidth>
                    Crear Agenda
                  </Button>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Container>
    </LocalizationProvider>
  );
};
