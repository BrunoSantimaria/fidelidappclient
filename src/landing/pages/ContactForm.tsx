import React, { useState } from "react";
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import { useForm } from "react-hook-form";
import api from "../../utils/api";
import { toast } from "react-toastify";

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await api.post("/auth/contact", data);
      toast.success("¡Formulario enviado con éxito!");
      reset();
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
    </Container>
  );
};

export default ContactForm;