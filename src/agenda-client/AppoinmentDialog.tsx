import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, TextField } from "@mui/material";
import { toast } from "react-toastify";
import api from "../utils/api";

const AppointmentDialog = ({ open, handleClose, selectedSlot, selectedDate, agendaId }) => {
  const [clientEmail, setClientEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!clientEmail) {
      setError("Email del cliente es obligatorio");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientEmail)) {
      setError("Formato de correo electrónico inválido");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/api/agenda/createAppointment", {
        agendaId,
        clientEmail,
        startTime: selectedSlot.startTime,
      });

      if (response.status === 201) {
        toast.success("Cita programada correctamente");
        handleClose();
      }
    } catch (err) {
      console.error("Error creando la cita:", err);
      toast.error("Error creating appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Confirmar Cita</DialogTitle>
      <DialogContent>
        {selectedSlot && (
          <Typography>
            ¿Quiéres programar una cita en {selectedDate} de las {selectedSlot.startTime.split("T")[1].split(":00.")[0]} hasta las{" "}
            {selectedSlot.endTime.split("T")[1].split(":00.")[0]}?
          </Typography>
        )}
        <TextField
          label='Email del Cliente'
          value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
          fullWidth
          margin='dense'
          error={Boolean(error)}
          helperText={error}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleConfirm} color='primary' variant='contained' disabled={loading}>
          {loading ? "Cargando..." : "Confirmar Cita"}
        </Button>
        <Button onClick={handleClose} color='primary' variant='outlined'>
          Cancelar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AppointmentDialog;
