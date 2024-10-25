import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import api from "../../utils/api";
import { toast } from "react-toastify";

export const ModalLanding = ({ open, handleClose }: { open: boolean; handleClose: () => void }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    phone: "", // Nuevo campo para el número de teléfono
    organization: "", // Nuevo campo para la organización
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: "",
    phone: "", // Nuevo campo para errores de teléfono
    organization: "", // Nuevo campo para errores de organización
  });

  useEffect(() => {
    return () => {
      setErrors({ name: "", email: "", message: "", phone: "", organization: "" });
      setFormData({
        name: "",
        email: "",
        message: "",
        phone: "", // Reinicia el campo de teléfono
        organization: "", // Reinicia el campo de organización
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
    const newErrors = { name: "", email: "", message: "", phone: "", organization: "" };
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

    // Validación para el teléfono
    if (!formData.phone.trim()) {
      newErrors.phone = "El número de teléfono es requerido";
      isValid = false;
    }

    // Validación para la organización
    if (!formData.organization.trim()) {
      newErrors.organization = "La organización es requerida";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Evita el comportamiento predeterminado del formulario

    if (!checkErrors()) {
      return;
    }

    try {
      await api.post("/auth/contact", {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        phone: formData.phone, // Envía el número de teléfono
        organization: formData.organization, // Envía la organización
      });
      toast.success("¡Formulario enviado con éxito!");

      window.gtag("event", "gtm.formSubmit", {
        event_category: "Contact",
        event_label: "Contact Form Submission",
        value: 1,
      });

      handleClose(); // Cierra el modal después del envío
    } catch (error) {
      console.log(error);
      toast.error("Hubo un error al enviar el formulario.");
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Déjanos tus datos para que nos contactemos contigo.</DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit}>
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
            label='Número de Teléfono' // Nuevo campo
            name='phone'
            fullWidth
            value={formData.phone}
            onChange={handleInputChange}
            error={Boolean(errors.phone)}
            helperText={errors.phone}
          />
          <TextField
            margin='dense'
            label='Organización' // Nuevo campo
            name='organization'
            fullWidth
            value={formData.organization}
            onChange={handleInputChange}
            error={Boolean(errors.organization)}
            helperText={errors.organization}
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
          <DialogActions>
            <Button onClick={handleClose} color='secondary'>
              Cancelar
            </Button>
            <Button type='submit' color='primary'>
              Enviar
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};
