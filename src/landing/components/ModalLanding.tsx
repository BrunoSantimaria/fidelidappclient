import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import { toast } from "react-toastify";

export const ModalLanding = ({ open, handleClose }: { open: boolean; handleClose: () => void }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    return () => {
      setErrors({ name: "", email: "", message: "" });
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    };
  }, [handleClose]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const checkErrors = () => {
    const newErrors = { name: "", email: "", message: "" };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "El correo electrónico no es válido";
      isValid = false;
    }

    if (!formData.message.trim()) {
      newErrors.message = "El mensaje es requerido";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!checkErrors()) {
      return;
    }

    try {
      await api.post("/auth/contact", formData);
      toast.success("¡Formulario enviado con éxito!");

      window.gtag("event", "gtm.formSubmit", {
        event_category: "Contact",
        event_label: "Contact Form Submission",
        value: 1,
      });

      return handleClose();
    } catch (error) {
      console.log(error);
      return toast.error("Hubo un error al enviar el formulario.");
    }
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Déjanos tus datos para que nos contactemos contigo.</DialogTitle>
        <DialogContent>
          <TextField
            margin='dense'
            label='Nombre'
            name='name'
            fullWidth
            value={formData.name}
            onChange={handleInputChange}
            error={Boolean(errors.name)}
            helperText={errors.name}
          />
          <TextField
            margin='dense'
            label='Correo Electrónico'
            name='email'
            type='email'
            fullWidth
            value={formData.email}
            onChange={handleInputChange}
            error={Boolean(errors.email)}
            helperText={errors.email}
          />
          <TextField
            margin='dense'
            label='Mensaje'
            name='message'
            type='text'
            fullWidth
            value={formData.message}
            onChange={handleInputChange}
            error={Boolean(errors.message)}
            helperText={errors.message}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color='secondary'>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} color='primary' data-tag='asistant'>
            Enviar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
