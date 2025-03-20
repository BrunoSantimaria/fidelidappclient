import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, TextField } from "@mui/material";
import { toast } from "react-toastify";
import api from "../utils/api";

const AppointmentDialog = ({ open, handleClose, selectedSlot, selectedDate, agendaId }) => {
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    notes: "",
    numberOfPeople: 1,
    way: "",
    virtualLink: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.clientName.trim()) newErrors.clientName = "El nombre es obligatorio";
    if (!formData.clientEmail.trim()) {
      newErrors.clientEmail = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientEmail)) {
      newErrors.clientEmail = "Email inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await api.post("/api/agenda/appointments", {
        agendaId,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        ...formData,
      });

      if (response.status === 201) {
        toast.success("Solicitud de cita enviada. Por favor revisa tu correo para confirmarla.");
        handleClose();
      }
    } catch (err) {
      console.error("Error al crear la cita:", err);
      toast.error(err.response?.data?.message || "Error al crear la cita");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>Solicitar Cita</DialogTitle>
      <DialogContent>
        <Typography variant='subtitle1' gutterBottom>
          Fecha: {selectedDate}
          <br />
          Hora: {selectedSlot?.startTime.split("T")[1].split(":00.")[0]} - {selectedSlot?.endTime.split("T")[1].split(":00.")[0]}
        </Typography>

        <TextField
          name='clientName'
          label='Nombre completo'
          value={formData.clientName}
          onChange={handleChange}
          fullWidth
          margin='dense'
          error={!!errors.clientName}
          helperText={errors.clientName}
        />

        <TextField
          name='clientEmail'
          label='Email'
          value={formData.clientEmail}
          onChange={handleChange}
          fullWidth
          margin='dense'
          error={!!errors.clientEmail}
          helperText={errors.clientEmail}
        />

        <TextField name='clientPhone' label='Teléfono (opcional)' value={formData.clientPhone} onChange={handleChange} fullWidth margin='dense' />

        <TextField
          name='notes'
          label='Notas adicionales (opcional)'
          value={formData.notes}
          onChange={handleChange}
          fullWidth
          margin='dense'
          multiline
          rows={2}
        />

        <TextField
          name='numberOfPeople'
          label='Número de personas'
          type='number'
          value={formData.numberOfPeople}
          onChange={handleChange}
          fullWidth
          margin='dense'
          InputProps={{ inputProps: { min: 1 } }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='inherit'>
          Cancelar
        </Button>
        <Button onClick={handleConfirm} color='primary' variant='contained' disabled={loading}>
          {loading ? "Enviando..." : "Solicitar Cita"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AppointmentDialog;
