import React, { useState } from "react";
import { Button, TextField, Typography, Link, Grid, Box, Container } from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";
import { useAuthSlice } from "../../hooks/useAuthSlice";
import { validateEmail, validatePassword, validateName } from "../../utils/validations";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useNavigateTo } from "../../hooks/useNavigateTo";

export const LoginPage = () => {
  const { handleNavigate } = useNavigateTo();
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "", name: "" });

  const { startLogin, startRegister, startGoogleSignIn } = useAuthSlice();

  // Función para limpiar el formulario
  const resetForm = () => {
    setEmail("");
    setPassword("");
    setName("");
    setErrors({ email: "", password: "", name: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateEmail(email) ? "" : "Email no válido";
    const passwordError = validatePassword(password) ? "" : "La contraseña debe tener al menos 6 caracteres";
    const nameError = validateName(isRegister, name);

    setErrors({ email: emailError, password: passwordError, name: nameError });

    if (!emailError && !passwordError && !nameError) {
      const formData = { email, password, ...(isRegister && { name }) };

      if (isRegister) {
        await startRegister(formData);
        resetForm();
        setTimeout(() => {
          location.reload();
        }, 3000);
      } else {
        await startLogin(formData);
      }
    }
  };

  const handleGoogleSignInSuccess = async (response) => {
    await startGoogleSignIn(response);
  };

  const toggleFormMode = () => {
    resetForm();
    setIsRegister((prev) => !prev);
  };

  return (
    <motion.div initial='hidden' whileInView='visible' variants={fadeIn} transition={{ duration: 0.5 }}>
      <Container component='main' maxWidth='xs' sx={{ margintop: "120px" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mt: { xs: 10, md: 35, lg: 20 },
            mb: { xs: 10 },
          }}
        >
          <Typography component='h1' variant='h5'>
            {isRegister ? "Registrarse" : "Iniciar Sesión"}
          </Typography>
          <Box component='form' onSubmit={handleSubmit} sx={{ mt: 1 }}>
            {isRegister && (
              <TextField
                margin='normal'
                fullWidth
                id='name'
                label='Nombre'
                name='name'
                autoComplete='name'
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
              />
            )}
            <TextField
              margin='normal'
              fullWidth
              id='email'
              label='Correo Electrónico'
              name='email'
              autoComplete='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              margin='normal'
              fullWidth
              name='password'
              label='Contraseña'
              type='password'
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password}
              helperText={errors.password}
            />
            <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2 }}>
              {isRegister ? "Registrarse" : "Iniciar Sesión"}
            </Button>

            <GoogleLogin
              size='large'
              width={140}
              useOneTap={true}
              onSuccess={handleGoogleSignInSuccess}
              onError={() => toast.error("No se ha podido iniciar sesión")}
            />

            <Grid container sx={{ mt: 3, justifyContent: "center" }}>
              <Grid item>
                <Link href='#' variant='body2' onClick={toggleFormMode}>
                  {isRegister ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </motion.div>
  );
};
