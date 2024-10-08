import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
interface Props {
  open: boolean;
  handleClose: () => void;
}
export const AddAdmin = ({ open, handleClose }: Props) => {
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          component: "form",
          onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries((formData as any).entries());
            const email = formJson.email;
            console.log(email);
            handleClose();
          },
        }}
      >
        <DialogTitle>Agregar administradores.</DialogTitle>
        <DialogContent>
          <TextField autoFocus required margin='dense' id='name' name='email' label='Email del administrador' type='email' fullWidth variant='standard' />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button type='submit'>Agregar</Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
