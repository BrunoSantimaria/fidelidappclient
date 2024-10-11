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
    const response = await api.get(`/api/agenda/getExistingAppointments/${agendaId}`);
    return response.data.appointments;
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

  useEffect(() => {
    const getAppointments = async () => {
      const fetchedAppointments = await fetchExistingAppointments(agendaId);
      if (fetchedAppointments.length > 0) {
        await setIsAdmin(true);
        console.log(isAdmin);
      }
      setAppointments(fetchedAppointments);
      setLoading(false);
    };

    getAppointments();
  }, [agendaId]);

  if (!isAdmin) return null;

  return (
    <Box mt={4} mb={4}>
      <Typography variant='h5' component='div' gutterBottom>
        Citas Existentes
      </Typography>
      {loading ? (
        <Box display='flex' justifyContent='center' alignItems='center' style={{ height: "100px" }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Email del Cliente</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Hora Inicio</TableCell>
                <TableCell>Hora Fin</TableCell>
                <TableCell>Estado</TableCell>
                <TableCell sx={{ textAlign: "center" }}>Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {appointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align='center'>
                    <Typography>No hay citas disponibles.</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                appointments.map((appointment) => (
                  <TableRow key={appointment._id}>
                    <TableCell>{appointment.clientId.email}</TableCell>
                    <TableCell>{appointment.startTime.split("T")[0]}</TableCell>
                    <TableCell>{appointment.startTime.split("T")[1].split(":00.")[0]}</TableCell>
                    <TableCell>{appointment.endTime.split("T")[1].split(":00.")[0]}</TableCell>
                    <TableCell>{appointment.status}</TableCell>
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
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog de confirmación */}
      <Dialog open={openDialog.open} onClose={handleCloseDialog}>
        <DialogTitle>{`Confirm ${openDialog.action} appointment`}</DialogTitle>
        <DialogContent>
          <DialogContentText>Are you sure you want to {openDialog.action} this appointment?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color='primary'>
            Cancel
          </Button>
          <Button onClick={handleConfirmAction} color='primary' autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ExistingAppointments;
