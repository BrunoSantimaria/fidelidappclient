import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Delete, Share } from "@mui/icons-material";

import { toast } from "react-toastify";
import { useDashboard } from "../../../hooks";
import { useNavigateTo } from "../../../hooks/useNavigateTo";

export const TableAgenda = () => {
  const { agendas, deleteAgenda } = useDashboard();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [agendaToDelete, setAgendaToDelete] = useState<string | null>(null);
  const { handleNavigate } = useNavigateTo();
  const handleShare = (agendaId: string) => {
    const agendaLink = `${window.location.origin}/agendas/${agendaId}`;
    navigator.clipboard.writeText(agendaLink);
    toast.info("Enlace de la agenda copiado al portapapeles.");
  };

  const handleDelete = (agendaId: string) => {
    setAgendaToDelete(agendaId);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDeleteConfirmed = async () => {
    if (agendaToDelete) {
      await deleteAgenda(agendaToDelete);

      setDialogOpen(false);
    }
  };

  const getAvailableDays = (days) => {
    const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    return days.map((day) => dayNames[day]).join(", ");
  };

  const getAvailableHours = (hours) => {
    return hours.map((hour) => `${hour.start} - ${hour.end}`).join(", ");
  };

  return (
    <>
      <span className='text-2xl font-bold'>Aquí puedes crear y gestionar tus agendas.</span>

      {agendas.length ? (
        <>
          <TableContainer component={Paper} className='shadow-md rounded-lg'>
            <Table>
              <TableHead className='bg-gradient-to-br from-gray-50 to-main/30'>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Duración del Evento (min)</TableCell>
                  <TableCell>Días Disponibles</TableCell>
                  <TableCell>Horas Disponibles</TableCell>
                  <TableCell>Slots</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {agendas?.map((agenda) => (
                  <TableRow key={agenda._id} className='odd:bg-white even:bg-gray-100'>
                    <TableCell className='cursor-pointer' onClick={() => handleNavigate(`/agendas/${agenda._id}`)}>
                      {agenda.name}
                    </TableCell>
                    <TableCell>{agenda.eventDuration}</TableCell>
                    <TableCell>{getAvailableDays(agenda.availableDays)}</TableCell>
                    <TableCell>{getAvailableHours(agenda.availableHours)}</TableCell>
                    <TableCell>{agenda.slots}</TableCell>
                    <TableCell>
                      <Tooltip title='Eliminar'>
                        <IconButton color='error' onClick={() => handleDelete(agenda._id)}>
                          <Delete />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title='Compartir'>
                        <IconButton color='primary' onClick={() => handleShare(agenda._id)}>
                          <Share />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Dialog de confirmación */}
          <Dialog open={dialogOpen} onClose={handleDialogClose}>
            <DialogTitle>Eliminar Agenda</DialogTitle>
            <DialogContent>
              <DialogContentText>¿Estás seguro de que deseas eliminar esta agenda? Esta acción no se puede deshacer.</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose} color='primary'>
                Cancelar
              </Button>
              <Button onClick={handleDeleteConfirmed} color='error'>
                Eliminar
              </Button>
            </DialogActions>
          </Dialog>
          <Button variant='contained' onClick={() => handleNavigate("/dashboard/agenda/create")}>
            Crear nueva agenda.
          </Button>
        </>
      ) : (
        <section className='shadow-md shadow-neutral-200 bg-gradient-to-br from-gray-100 to-main/30 p-6 rounded-md'>
          <div className='flex flex-col space-y-6'>
            <span className='text-center text-lg text-black/60'>No hay agendas disponibles, empieza creando una en el botón de abajo.</span>
            <Button variant='contained' onClick={() => handleNavigate("/dashboard/agenda/create")}>
              Crear nueva agenda.
            </Button>
          </div>
        </section>
      )}
    </>
  );
};
