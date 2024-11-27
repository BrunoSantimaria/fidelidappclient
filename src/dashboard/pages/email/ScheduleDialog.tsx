import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import { useState } from "react";

export const ScheduleDialog = ({ open, onClose, onConfirm }) => {
  const [selectedDate, setSelectedDate] = useState(null);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Programar envío de correo</DialogTitle>
      <DialogContent>
        <Typography variant='body2' sx={{ mb: 2 }}>
          Selecciona la fecha y hora para enviar el correo
        </Typography>
        <TextField
          type='datetime-local'
          fullWidth
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={() => onConfirm(selectedDate)} variant='contained' disabled={!selectedDate}>
          Programar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
