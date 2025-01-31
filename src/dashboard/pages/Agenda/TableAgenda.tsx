import React, { useState, useEffect } from "react";
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
  Tabs,
  Tab,
  Box,
  Chip,
} from "@mui/material";
import { Delete, Share, CalendarMonth, CheckCircle, PendingActions, Analytics, FilterList, Phone, Mail } from "@mui/icons-material";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableHeader } from "@/components/ui/table";
import { TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Users, CheckCircle as LucideCheckCircle, Share2, Trash2 } from "lucide-react";

import { toast } from "react-toastify";
import { useDashboard } from "../../../hooks";
import { useNavigateTo } from "../../../hooks/useNavigateTo";
import api from "@/utils/api";
import { useAuthSlice } from "@/hooks/useAuthSlice";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role='tabpanel' hidden={value !== index} {...other}>
      {value === index && children}
    </div>
  );
}

export const TableAgenda = () => {
  const { agendas, deleteAgenda } = useDashboard();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [agendaToDelete, setAgendaToDelete] = useState<string | null>(null);
  const { handleNavigate } = useNavigateTo();
  const [tabValue, setTabValue] = useState(0);
  const [appointments, setAppointments] = useState<any[]>([]);
  const { user } = useAuthSlice();
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(null);
  const [appointmentDialogOpen, setAppointmentDialogOpen] = useState(false);
  const [stats, setStats] = useState({
    completadas: 0,
    pendientes: 0,
    totalClientes: 0,
  });

  const fetchExistingAppointments = async () => {
    try {
      const response = await api.get(`/api/agenda/account/${user.accounts._id}/appointments`);
      console.log(response.data);
      // Obtener solo los appointments que realmente existen (longitud > 0)
      const uniqueAppointments = response.data.appointmentsByAgenda
        .filter((item) => item.appointments.length > 0)
        .reduce((acc, item) => {
          const appointmentsWithAgendaName = item.appointments.map((appointment) => ({
            ...appointment,
            agendaName: item.agendaName,
          }));
          return [...acc, ...appointmentsWithAgendaName];
        }, []);

      setStats({
        completadas: response.data.metrics.completed || 0,
        pendientes: response.data.metrics.pending || 0,
        totalClientes: response.data.metrics.total || 0,
      });

      return uniqueAppointments;
    } catch (error) {
      console.error("Error fetching existing appointments:", error);
      return [];
    }
  };

  useEffect(() => {
    const loadAppointments = async () => {
      const fetchedAppointments = await fetchExistingAppointments();
      setAppointments(fetchedAppointments);
    };
    loadAppointments();
  }, [agendas]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

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

  const handleCompleteAppointment = async (appointmentId: string) => {
    try {
      await api.post(`/api/agenda/appointments/${appointmentId}/confirm`);
      // Recargar las citas - simplemente llamamos una vez a fetchExistingAppointments
      const updatedAppointments = await fetchExistingAppointments();
      setAppointments(updatedAppointments);
      toast.success("Cita marcada como completada");
    } catch (error) {
      toast.error("Error al actualizar la cita");
    }
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    setAppointmentToDelete(appointmentId);
    setAppointmentDialogOpen(true);
  };

  const handleDeleteAppointmentConfirmed = async () => {
    if (appointmentToDelete) {
      try {
        await api.post(`/api/agenda/appointments/${appointmentToDelete}/cancel`);
        // Recargar las citas - una sola llamada
        const updatedAppointments = await fetchExistingAppointments();
        setAppointments(updatedAppointments);
        toast.success("Cita eliminada correctamente");
      } catch (error) {
        toast.error("Error al eliminar la cita");
      }
      setAppointmentDialogOpen(false);
    }
  };

  const getAvailableDays = (recurringConfig) => {
    if (!recurringConfig?.daysOfWeek) return "-";
    const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    return recurringConfig.daysOfWeek.map((day) => dayNames[day]).join(", ");
  };

  const getAvailableHours = (recurringConfig) => {
    if (!recurringConfig?.timeSlots) return "-";
    return recurringConfig.timeSlots.map((slot) => `${slot.start} - ${slot.end}`).join(", ");
  };

  const getStatusBadgeVariant = (status: string, isPast: boolean) => {
    if (isPast) return "secondary"; // Gris para completadas
    switch (status) {
      case "confirmed":
        return "success"; // Verde para confirmadas
      case "cancelled":
        return "destructive"; // Rojo para canceladas
      default:
        return "warning"; // Naranja para pendientes
    }
  };

  const getStatusText = (status: string, isPast: boolean) => {
    if (isPast) return "Completada";
    switch (status) {
      case "confirmed":
        return "Confirmada";
      case "cancelled":
        return "Cancelada";
      default:
        return "Pendiente";
    }
  };

  const renderAppointmentsTable = (status: "pending" | "completed") => {
    const currentDate = new Date();
    const filteredAppointments = appointments.filter((app) => {
      const appointmentEndTime = new Date(app.endTime);
      if (status === "completed") {
        return appointmentEndTime < currentDate;
      }
      return appointmentEndTime >= currentDate;
    });

    return (
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Cliente</TableCell>
              <TableCell>Contacto</TableCell>
              <TableCell>Agenda</TableCell>
              <TableCell>Fecha</TableCell>
              <TableCell>Horario</TableCell>
              <TableCell>Personas</TableCell>
              <TableCell>Notas</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((appointment) => {
                const startTime = new Date(appointment.startTime);
                const endTime = new Date(appointment.endTime);
                const isPast = endTime < currentDate;

                return (
                  <TableRow key={appointment._id}>
                    <TableCell>{appointment.clientName}</TableCell>
                    <TableCell>
                      <div className='space-y-1'>
                        <div className='flex items-center gap-1'>
                          <Phone className='h-4 w-4' />
                          <a href={`tel:${appointment.clientPhone}`}>{appointment.clientPhone}</a>
                        </div>
                        <div className='flex items-center gap-1'>
                          <Mail className='h-4 w-4' />
                          <a href={`mailto:${appointment.clientEmail}`}>{appointment.clientEmail}</a>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{appointment.agendaName || "N/A"}</TableCell>
                    <TableCell>
                      {startTime.toLocaleDateString("es-ES", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      {`${startTime.toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })} - ${endTime.toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: false,
                      })}`}
                    </TableCell>
                    <TableCell>{appointment.numberOfPeople} persona(s)</TableCell>
                    <TableCell>
                      <Tooltip title={appointment.notes}>
                        <span className='line-clamp-2'>{appointment.notes}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusBadgeVariant(appointment.status, isPast)}
                        className={`
                          ${appointment.status === "confirmed" ? "bg-green-100 text-green-800 border-green-200" : ""}
                          ${appointment.status === "cancelled" ? "bg-red-100 text-red-800 border-red-200" : ""}
                          ${
                            !isPast && appointment.status !== "confirmed" && appointment.status !== "cancelled"
                              ? "bg-orange-100 text-orange-800 border-orange-200"
                              : ""
                          }
                          ${isPast ? "bg-gray-100 text-gray-800 border-gray-200" : ""}
                        `}
                      >
                        {getStatusText(appointment.status, isPast)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className='flex gap-2'>
                        {!isPast && appointment.status !== "confirmed" && (
                          <Tooltip title='Confirmar cita'>
                            <IconButton size='small' color='success' onClick={() => handleCompleteAppointment(appointment._id)}>
                              <LucideCheckCircle className='h-4 w-4' />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Tooltip title='Eliminar cita'>
                          <IconButton size='small' color='error' onClick={() => handleDeleteAppointment(appointment._id)}>
                            <Trash2 className='h-4 w-4' />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={9} align='center'>
                  No hay citas {status === "pending" ? "pendientes" : "completadas"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <div className='container mx-auto py-6 space-y-8'>
      {/* Stats Cards */}
      <div className='grid gap-4 md:grid-cols-3'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Citas Completadas</CardTitle>
            <CheckCircle className='h-4 w-4 text-green-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.completadas}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Citas Pendientes</CardTitle>
            <Clock className='h-4 w-4 text-orange-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.pendientes}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Clientes</CardTitle>
            <Users className='h-4 w-4 text-blue-500' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.totalClientes}</div>
          </CardContent>
        </Card>
      </div>

      <div className='flex justify-end'>
        <Button
          variant='contained'
          onClick={() => handleNavigate("/dashboard/agenda/create")}
          className='bg-main hover:bg-main-dark'
          startIcon={<Calendar className='h-4 w-4' />}
        >
          Crear Nueva Agenda
        </Button>
      </div>

      <Paper className='p-4'>
        <Tabs value={tabValue} onChange={handleTabChange} className='mb-4'>
          <Tab icon={<Calendar className='h-4 w-4' />} label='Todas' iconPosition='start' />
          <Tab icon={<Clock className='h-4 w-4' />} label='Pendientes' iconPosition='start' />
          <Tab icon={<CheckCircle className='h-4 w-4' />} label='Completadas' iconPosition='start' />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nombre</TableCell>
                  <TableCell>Duración</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell className='hidden md:table-cell'>Días Disponibles</TableCell>
                  <TableCell>Horarios</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align='right'>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {agendas?.map((agenda) => (
                  <TableRow key={agenda._id}>
                    <TableCell className='font-medium cursor-pointer' onClick={() => handleNavigate(`/agendas/${agenda._id}`)}>
                      {agenda.name}
                    </TableCell>
                    <TableCell>{agenda.duration} min</TableCell>
                    <TableCell>{agenda.type === "recurring" ? "Recurrente" : "Especial"}</TableCell>
                    <TableCell className='hidden md:table-cell'>
                      {agenda.type === "recurring" ? getAvailableDays(agenda.recurringConfig) : "Fechas especiales"}
                    </TableCell>
                    <TableCell>{agenda.type === "recurring" ? getAvailableHours(agenda.recurringConfig) : "Horarios especiales"}</TableCell>
                    <TableCell>
                      <Badge variant={agenda.slots > 0 ? "success" : "destructive"}>{agenda.slots > 0 ? "Disponible" : "Completo"}</Badge>
                    </TableCell>
                    <TableCell align='right'>
                      <div className='flex justify-end gap-2'>
                        <Button size='small' onClick={() => handleShare(agenda._id)}>
                          <Share2 className='h-4 w-4' />
                        </Button>
                        <Button size='small' className='text-red-600' onClick={() => handleDelete(agenda._id)}>
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {renderAppointmentsTable("pending")}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {renderAppointmentsTable("completed")}
        </TabPanel>
      </Paper>

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

      {/* Dialog de confirmación para eliminar cita */}
      <Dialog open={appointmentDialogOpen} onClose={() => setAppointmentDialogOpen(false)}>
        <DialogTitle>Eliminar Cita</DialogTitle>
        <DialogContent>
          <DialogContentText>¿Estás seguro de que deseas eliminar esta cita? Esta acción no se puede deshacer.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAppointmentDialogOpen(false)} color='primary'>
            Cancelar
          </Button>
          <Button onClick={handleDeleteAppointmentConfirmed} color='error'>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
