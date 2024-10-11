import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Select, MenuItem, InputLabel, FormControl, Box, Grid } from "@mui/material";

import { toast } from "react-toastify";
import api from "../../../utils/api";
export const CreateAgenda = () => {
  const [name, setAgendaName] = useState("");
  const [eventDuration, setEventDuration] = useState("");
  const [availableDays, setAvailableDays] = useState([]);
  const [availableHours, setAvailableHours] = useState([]);
  const [slots, setSlots] = useState("");
  const navigate = useNavigate();

  const handleDayChange = (event) => setAvailableDays(event.target.value);
  const handleHourChange = (event) => setAvailableHours(event.target.value);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (eventDuration <= 0 || slots <= 0) {
      toast.error("La duración y los cupos deben ser mayores que cero");
      return;
    }
    try {
      const response = await api.post("/api/agenda/createagenda", {
        name,
        slots,
        eventDuration,
        availableDays,
        availableHours,
      });
      console.log("Agenda creada correctamente:", response.data);
      toast.success("Agenda creada correctamente");
      navigate("/dashboard/");
    } catch (error) {
      console.error("Error creando la agenda:", error);
      toast.error("No se ha podido crear la agenda");
    }
  };

  return (
    <section className='flex flex-col p-10 ml-0 md:w-[95%] md:ml-20 lg:ml-20 w-full gap-5'>
      <span className='font-bold text-4xl'>Crear una nueva agenda</span>
      <Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField label='Nombre de Agenda' value={name} onChange={(e) => setAgendaName(e.target.value)} fullWidth margin='normal' required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label='Cupos'
              value={slots}
              onChange={(e) => setSlots(e.target.value)}
              fullWidth
              margin='normal'
              type='number'
              inputProps={{ min: 1 }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label='Duración (Minutos)'
              value={eventDuration}
              onChange={(e) => setEventDuration(e.target.value)}
              fullWidth
              margin='normal'
              type='number'
              inputProps={{ min: 1 }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth margin='normal'>
              <InputLabel>Días Disponibles</InputLabel>
              <Select multiple value={availableDays} onChange={handleDayChange} renderValue={(selected) => selected.join(", ")} required>
                {["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"].map((day) => (
                  <MenuItem key={day} value={day}>
                    {day}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth margin='normal'>
              <InputLabel>Horas Disponibles</InputLabel>
              <Select multiple value={availableHours} onChange={handleHourChange} renderValue={(selected) => selected.join(", ")}>
                {[
                  "00:00",
                  "01:00",
                  "02:00",
                  "03:00",
                  "04:00",
                  "05:00",
                  "06:00",
                  "07:00",
                  "08:00",
                  "09:00",
                  "10:00",
                  "11:00",
                  "12:00",
                  "13:00",
                  "14:00",
                  "15:00",
                  "16:00",
                  "17:00",
                  "18:00",
                  "19:00",
                  "20:00",
                  "21:00",
                  "22:00",
                  "23:00",
                ].map((hour) => (
                  <MenuItem key={hour} value={hour}>
                    {hour}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
          Crear Agenda
        </Button>
      </Box>
    </section>
  );
};
