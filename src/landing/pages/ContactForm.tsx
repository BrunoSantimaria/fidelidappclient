import React, { useState } from "react";
import { TextField, Button, Typography, Container, Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { Helmet } from "react-helmet";
import api from "../../utils/api";
import { toast } from "react-toastify";
import { useNavigateTo } from "../../hooks/useNavigateTo";
import { Mail, Message, Phone, Send, Person, Business } from "@mui/icons-material";

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleNavigate } = useNavigateTo();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const inputStyles = {
    "& .MuiInputBase-root": {
      backgroundColor: "white",
      borderRadius: "8px",
      "&:hover": {
        "& fieldset": {
          borderColor: "#5b7898",
        },
      },
      "&.Mui-focused": {
        "& fieldset": {
          borderColor: "#5b7898",
        },
      },
    },
    "& .MuiInputBase-input": {
      pl: 5,
      py: 2,
      "&::placeholder": {
        color: "rgba(0, 0, 0, 0.4)",
        opacity: 1,
      },
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "rgba(0, 0, 0, 0.1)",
      },
    },
  };

  const iconStyles = {
    position: "absolute",
    left: 10,
    top: "50%",
    transform: "translateY(-50%)",
    color: "#5b7898",
    zIndex: 1,
  };

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
      toast.error("Hubo un error al enviar el formulario.");
    } finally {
      setTimeout(() => {
        setIsSubmitting(false);
      }, 2000);
    }
  };

  return (
    <Container
      sx={{
        my: 8,
        width: {
          xs: "95%",
          sm: "80%",
          md: "60%",
        },
      }}
    >
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

      <Box
        sx={{
          backgroundColor: "white",
          borderRadius: 2,
          boxShadow: 3,
          borderTop: "4px solid #5b7898",
          p: 4,
        }}
      >
        <Typography
          variant='h4'
          align='center'
          sx={{
            color: "#5b7898",
            fontWeight: "bold",
            mb: 1,
          }}
        >
          ¿Interesado en saber más?
        </Typography>
        <Typography variant='h5' align='center' sx={{ mb: 4 }}>
          Contáctanos
        </Typography>

        <Box
          component='form'
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Box sx={{ position: "relative" }}>
            <Person sx={iconStyles} />
            <TextField
              fullWidth
              placeholder='Tu nombre'
              variant='outlined'
              InputLabelProps={{ shrink: false }}
              label=''
              {...register("name", { required: "El nombre es requerido" })}
              error={!!errors.name}
              helperText={errors.name ? errors.name.message : ""}
              sx={inputStyles}
            />
          </Box>

          <Box sx={{ position: "relative" }}>
            <Mail sx={iconStyles} />
            <TextField
              fullWidth
              placeholder='tu@email.com'
              variant='outlined'
              InputLabelProps={{ shrink: false }}
              label=''
              type='email'
              {...register("email", { required: "El correo electrónico es requerido" })}
              error={!!errors.email}
              helperText={errors.email ? errors.email.message : ""}
              sx={inputStyles}
            />
          </Box>

          <Box sx={{ position: "relative" }}>
            <Phone sx={iconStyles} />
            <TextField
              fullWidth
              placeholder='+56 9 1234 5678'
              variant='outlined'
              InputLabelProps={{ shrink: false }}
              label=''
              {...register("phone")}
              error={!!errors.phone}
              helperText={errors.phone ? errors.phone.message : ""}
              sx={inputStyles}
            />
          </Box>

          <Box sx={{ position: "relative" }}>
            <Business sx={iconStyles} />
            <TextField
              fullWidth
              placeholder='Nombre de tu empresa'
              variant='outlined'
              InputLabelProps={{ shrink: false }}
              label=''
              {...register("organization")}
              error={!!errors.organization}
              helperText={errors.organization ? errors.organization.message : ""}
              sx={inputStyles}
            />
          </Box>

          <Box sx={{ position: "relative" }}>
            <Message
              sx={{
                ...iconStyles,
                top: "24px",
                transform: "none",
              }}
            />
            <TextField
              fullWidth
              placeholder='¿En qué podemos ayudarte?'
              variant='outlined'
              InputLabelProps={{ shrink: false }}
              label=''
              multiline
              rows={4}
              {...register("message", { required: "El mensaje es requerido" })}
              error={!!errors.message}
              helperText={errors.message ? errors.message.message : ""}
              sx={inputStyles}
            />
          </Box>

          <Button
            id='formulario'
            variant='contained'
            type='submit'
            disabled={isSubmitting}
            startIcon={<Send />}
            sx={{
              backgroundColor: "#5b7898",
              "&:hover": {
                backgroundColor: "#4a6277",
              },
              py: 1.5,
            }}
          >
            {isSubmitting ? "Enviando..." : "Enviar Consulta"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ContactForm;
