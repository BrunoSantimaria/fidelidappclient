import React, { useState } from "react";
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet";
import api from "../../utils/api";
import { toast } from "react-toastify";
import { useNavigateTo } from "../../hooks/useNavigateTo";

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleNavigate } = useNavigateTo();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      // Enviar datos al backend, incluyendo phone y organization
      await api.post("/auth/contact", {
        name: data.name,
        email: data.email,
        message: data.message,
        phone: data.phone, // Agregado
        organization: data.organization, // Agregado
      });
      toast.success("¡Formulario enviado con éxito!");

      // Disparar evento de GTAG para el envío de formulario
      window.gtag("event", "gtm.formSubmit", {
        event_category: "Contact",
        event_label: "Contact Form Submission",
        value: 1,
      });

      handleNavigate("/thankyou");
    } catch (error) {
      console.log(error);
      toast.error("Hubo un error al enviar el formulario.");
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 2000);
    }
  };

  return (
    <Container sx={{ marginTop: "60px", marginBottom: "60px", maxWidth: "80vw" }}>
      <Helmet>
        <script async src='https://www.googletagmanager.com/gtag/js?id=AW-16750398859'></script>
        <script>
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'AW-16750398859');
          `}
        </script>
      </Helmet>

      <Typography variant='h4' align='center' gutterBottom>
        ¿Interesado en saber más? Contáctanos
      </Typography>
      <Box component='form' onSubmit={handleSubmit(onSubmit)} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label='Nombre'
          variant='outlined'
          {...register("name", { required: "El nombre es requerido" })}
          error={!!errors.name}
          helperText={errors.name ? errors.name.message : ""}
        />
        <TextField
          label='Email'
          variant='outlined'
          type='email'
          {...register("email", { required: "El correo electrónico es requerido" })}
          error={!!errors.email}
          helperText={errors.email ? errors.email.message : ""}
        />
        <TextField
          label='Número de Teléfono' // Nuevo campo
          variant='outlined'
          {...register("phone")}
          error={!!errors.phone}
          helperText={errors.phone ? errors.phone.message : ""}
        />
        <TextField
          label='Organización' // Nuevo campo
          variant='outlined'
          {...register("organization")}
          error={!!errors.organization}
          helperText={errors.organization ? errors.organization.message : ""}
        />
        <TextField
          label='Mensaje'
          variant='outlined'
          multiline
          rows={4}
          {...register("message", { required: "El mensaje es requerido" })}
          error={!!errors.message}
          helperText={errors.message ? errors.message.message : ""}
        />
        <Button id='formulario' variant={isSubmitting ? "disabled" : "contained"} type='submit' sx={{ backgroundColor: "primary.main" }}>
          ENVIAR CONSULTA
        </Button>
      </Box>
    </Container>
  );
};

export default ContactForm;
