import React, { useState } from "react";
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import { useForm } from "react-hook-form";
import api from "../../utils/api";
import { useSnackbar } from "../../hooks";

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { openSnackbar, SnackbarComponent } = useSnackbar();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);
    setIsSubmitting(true);
    try {
      await api.post("/auth/contact", data);
      openSnackbar("¡Formulario enviado con éxito!", "success");
      reset();
    } catch (error) {
      console.log(error);
      openSnackbar("Hubo un error al enviar el formulario.", "error");
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 2000);
    }
  };

  return (
    <Container sx={{ marginTop: "60px", marginBottom: "60px", maxWidth: "80vw" }}>
      <Typography variant='h4' align='center' gutterBottom>
        ¿Interesado en saber más? Contáctanos
      </Typography>
      <Box component='form' onSubmit={handleSubmit(onSubmit)} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          label='Nombre'
          variant='outlined'
          {...register("name", { required: "Name is required" })}
          error={!!errors.name}
          helperText={errors.name ? errors.name.message : ""}
        />
        <TextField
          label='Email'
          variant='outlined'
          type='email'
          {...register("email", { required: "Valid email is required" })}
          error={!!errors.email}
          helperText={errors.email ? errors.email.message : ""}
        />
        <TextField
          label='Mensaje'
          variant='outlined'
          multiline
          rows={4}
          {...register("message", { required: "Message is required" })}
          error={!!errors.message}
          helperText={errors.message ? errors.message.message : ""}
        />
        <Button variant={isSubmitting ? "disabled" : "contained"} type='submit' sx={{ backgroundColor: "primary.main" }}>
          ENVIAR CONSULTA
        </Button>
      </Box>
      <SnackbarComponent />
    </Container>
  );
};

export default ContactForm;
