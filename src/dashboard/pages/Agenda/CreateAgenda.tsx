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
  Link,
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
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(60);
  const [slots, setSlots] = useState(1);
  const [requiresCapacity, setRequiresCapacity] = useState(false);
  const [way, setWay] = useState("presencial");
  const [virtualLink, setVirtualLink] = useState("");
  const { user } = useAuthSlice();
  const [selectedDays, setSelectedDays] = useState([]);
  const [timeSlots, setTimeSlots] = useState([{ start: dayjs().set("hour", 9).set("minute", 0), end: dayjs().set("hour", 10).set("minute", 0) }]);
  const [validFrom, setValidFrom] = useState(dayjs());
  const [validUntil, setValidUntil] = useState(dayjs().add(1, "year"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const agendaData = {
        name,
        description,
        type: "recurring",
        duration,
        slots,
        requiresCapacity,
        accountId: user.accounts._id,
        way,
        virtualLink: way === "presencial" ? "" : virtualLink,
        recurringConfig: {
          daysOfWeek: selectedDays,
          timeSlots: timeSlots.map((slot) => ({
            start: slot.start.format("HH:mm"),
            end: slot.end.format("HH:mm"),
          })),
          validFrom: validFrom.toISOString(),
          validUntil: validUntil.toISOString(),
        },
      };

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
    if (timeSlots.length > 1) {
      setTimeSlots(timeSlots.filter((_, i) => i !== index));
    }
  };

  const handleSlotsChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setSlots("");
    } else {
      const numValue = parseInt(value);
      setSlots(numValue < 1 ? 1 : numValue);
    }
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
              <strong>Agenda Recurrente:</strong> Se repite en los días y horarios seleccionados.
            </Alert>

            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label='Nombre'
                    placeholder='Ej. "Agenda de consultorio de Dr. Juan Pérez"'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Modalidad</InputLabel>
                    <Select value={way} onChange={(e) => setWay(e.target.value)} label='Modalidad'>
                      <MenuItem value='presencial'>Presencial</MenuItem>
                      <MenuItem value='virtual'>Virtual</MenuItem>
                      <MenuItem value='ambas'>Ambas</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {(way === "virtual" || way === "ambas") && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label='Enlace de videollamada (Google Meet)'
                      placeholder='https://meet.google.com/xxx-xxxx-xxx'
                      value={virtualLink}
                      onChange={(e) => setVirtualLink(e.target.value)}
                      required={way === "virtual"}
                      helperText='Ingresa un enlace permanente de Google Meet. Este enlace se enviará a todos los clientes con citas virtuales.'
                    />
                    <Alert severity='info' sx={{ mt: 2 }}>
                      <Typography variant='body2'>
                        <strong>¿Cómo crear un enlace permanente de Google Meet?</strong>
                        <ol style={{ marginTop: "8px", paddingLeft: "16px" }}>
                          <li>
                            Ve a{" "}
                            <Link href='https://meet.google.com/' target='_blank' rel='noopener noreferrer'>
                              meet.google.com
                            </Link>
                          </li>
                          <li>Haz clic en "Nueva reunión" y selecciona "Obtener un enlace para compartir"</li>
                          <li>Copia el enlace generado y pégalo aquí</li>
                          <li>Este mismo enlace puede usarse para múltiples citas y clientes</li>
                        </ol>
                        <strong>Nota:</strong> Un enlace permanente de Google Meet puede usarse para todas tus citas virtuales. No es necesario crear un enlace
                        nuevo para cada cliente.
                      </Typography>
                    </Alert>
                  </Grid>
                )}

                <Grid item xs={12}>
                  <TextField fullWidth label='Descripción' multiline rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type='number'
                    label='Duración (minutos)'
                    value={duration}
                    onChange={(e) => setDuration(Math.max(1, Number(e.target.value)))}
                    required
                    inputProps={{ min: 1 }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label='Slots disponibles'
                    value={slots}
                    onChange={handleSlotsChange}
                    onBlur={() => {
                      if (slots === "" || slots < 1) setSlots(1);
                    }}
                    required
                    type='text'
                    inputMode='numeric'
                    pattern='[0-9]*'
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControlLabel
                    control={<Checkbox checked={requiresCapacity} onChange={(e) => setRequiresCapacity(e.target.checked)} />}
                    label='¿Requiere especificar cantidad de personas?'
                  />
                </Grid>

                <Grid item xs={12}>
                  <Typography variant='h6' gutterBottom sx={{ mt: 2 }}>
                    Días y Horarios
                  </Typography>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth required>
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
