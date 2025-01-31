import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { toast } from "react-toastify";
import api from "../utils/api";

const fetchExistingAppointments = async (agendaId) => {
  try {
    const response = await api.get(`/api/agenda/${agendaId}/appointments`);
    return response.data;
  } catch (error) {
    console.error("Error fetching existing appointments:", error);
    return [];
  }
};

const ExistingAppointments = ({ agendaId }) => {
  const [appointments, setAppointments] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState({ open: false, action: null, appointmentId: null });

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const data = await fetchExistingAppointments(agendaId);
        setAppointments(data);
      } catch (error) {
        console.error("Error loading appointments:", error);
        toast.error("Error al cargar las citas");
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, [agendaId]);

  const handleOpenDialog = (action, appointmentId) => {
    setOpenDialog({ open: true, action, appointmentId });
  };

  const handleCloseDialog = () => {
    setOpenDialog({ open: false, action: null, appointmentId: null });
  };

  const handleConfirmAction = async () => {
    const { action, appointmentId } = openDialog;
    try {
      await api.post(`/api/agenda/${action}Appointment/${appointmentId}`);
      toast.success(`Appointment ${action}ed successfully`);
      window.location.reload();
    } catch (error) {
      console.error(`Error ${action}ing appointment:`, error);
      toast.error(`Error ${action}ing appointment`);
    } finally {
      handleCloseDialog();
    }
  };

  if (loading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' minHeight='200px'>
        <CircularProgress />
      </Box>
    );
  }

  if (!appointments || appointments.length === 0) {
    return (
      <Box p={3}>
        <Typography variant='h6' align='center'>
          No hay citas programadas
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Hora Inicio</TableCell>
              <TableCell>Hora Fin</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appointment) => {
              // Asegurarse de que las fechas sean válidas
              const startTime = new Date(appointment.startTime);
              const endTime = new Date(appointment.endTime);

              return (
                <TableRow key={appointment._id}>
                  <TableCell>{appointment.clientName || "Sin nombre"}</TableCell>
                  <TableCell>{appointment.clientEmail || "Sin email"}</TableCell>
                  <TableCell>{startTime.toLocaleDateString()}</TableCell>
                  <TableCell>{startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</TableCell>
                  <TableCell>{endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</TableCell>
                  <TableCell>{appointment.status || "Pendiente"}</TableCell>
                  <TableCell sx={{ textAlign: "center" }}>
                    {appointment.status === "Past" || appointment.status === "Confirmed" ? (
                      <>
                        <Button variant='contained' size='small' onClick={() => handleOpenDialog("complete", appointment._id)} sx={{ mr: 2 }}>
                          Completar
                        </Button>
                        <Button variant='outlined' size='small' color='error' onClick={() => handleOpenDialog("noShow", appointment._id)} sx={{ mr: 2 }}>
                          Ocultar
                        </Button>
                      </>
                    ) : appointment.status === "Completed" ? (
                      <></>
                    ) : (
                      <>
                        <Button variant='contained' size='small' onClick={() => handleOpenDialog("confirm", appointment._id)} sx={{ mr: 2 }}>
                          Confirmar
                        </Button>
                        <Button variant='outlined' size='small' color='error' onClick={() => handleOpenDialog("cancel", appointment._id)}>
                          Cancelar
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog.open} onClose={handleCloseDialog}>
        <DialogTitle>{`Confirm ${openDialog.action} appointment`}</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to {openDialog.action} this appointment?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleConfirmAction} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExistingAppointments;
