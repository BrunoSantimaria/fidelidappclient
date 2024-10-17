import React, { useState } from "react";
import { Button, Container, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../utils/api";

const ConfirmAppointment = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirm = async () => {
    try {
      const response = await api.post("/api/agenda/confirmAppointment/" + appointmentId);
      if (response.status === 200) {
        toast.success("Cita confirmada con éxito.");
        navigate("/thank-you");
      } else {
        toast.error("Error al confirmar la cita.");
      }
    } catch (error) {
      console.error("Error al enviar la solicitud:", error);
      toast.error("Error al enviar la solicitud.");
    } finally {
      handleCloseDialog();
    }
  };

  return (
    <Container sx={{ margin: "auto", textAlign: "center" }}>
      <Typography variant='h4' gutterBottom>
        Confirmar Cita
      </Typography>
      <Typography variant='body1' paragraph>
        Para confirmar tu cita haz click a continuación.
      </Typography>
      <Button variant='contained' color='primary' onClick={handleOpenDialog}>
        Confirmar Cita
      </Button>

      {/* Dialog para confirmación */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Confirmar Cita</DialogTitle>
        <DialogContent>
          <DialogContentText>¿Estás seguro de que deseas confirmar esta cita? Esta acción no se puede deshacer.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color='secondary'>
            Cancelar
          </Button>
          <Button onClick={handleConfirm} color='primary' variant='contained'>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ConfirmAppointment;
