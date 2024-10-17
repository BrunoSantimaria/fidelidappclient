import React, { useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Card, CardContent, Typography } from "@mui/material";
import AppointmentDialog from "./AppoinmentDialog"; // Asegúrate de importar el componente

const AvailableSlotsTable = ({ name, description, availableSlotsByDay, agendaId }) => {
  const [open, setOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleClickOpen = (date, slot) => {
    setSelectedSlot(slot);
    setSelectedDate(date);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSlot(null);

    window.location.reload();
  };

  return (
    <>
      <TableContainer>
        <Typography variant='h4' component='div' sx={{ flexGrow: 1, mb: 2, mt: 2 }}>
          {name}
        </Typography>
        <Typography variant='body2' component='div' sx={{ flexGrow: 1, mb: 2, mt: 2 }}>
          {description}
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              {Object.keys(availableSlotsByDay).map((date) => (
                <TableCell key={date}>{date}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              {Object.keys(availableSlotsByDay).map((date) => (
                <TableCell key={date}>
                  {availableSlotsByDay[date].map((slot, index) => {
                    if (slot.remainingSlots <= 0) return null;

                    const startTime = slot.startTime.split("T")[1].split(":00.")[0];
                    const endTime = slot.endTime.split("T")[1].split(":00.")[0];

                    return (
                      <Card key={index} onClick={() => handleClickOpen(date, slot)} style={{ marginBottom: "10px", cursor: "pointer" }}>
                        <CardContent>
                          <Typography variant='body2'>
                            {startTime} - {endTime}
                          </Typography>
                          <Typography variant='body2' color='textSecondary'>
                            {slot.remainingSlots} cupos disponibles
                          </Typography>
                        </CardContent>
                      </Card>
                    );
                  })}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      {/* Aquí llamamos al nuevo componente AppointmentDialog */}
      <AppointmentDialog open={open} handleClose={handleClose} selectedSlot={selectedSlot} selectedDate={selectedDate} agendaId={agendaId} />
    </>
  );
};

export default AvailableSlotsTable;
