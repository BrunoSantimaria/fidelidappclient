"use client";

import { Visibility, VisibilityOff, Email, Lock, Person, Phone } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Typography from "@mui/material/Typography";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useAuthSlice } from "../../hooks/useAuthSlice";
import { validateEmail, validatePassword, validateName } from "../../utils/validations";
import { toast } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";

export const LoginPage = ({ defaultTab = "register" }) => {
  const [tabValue, setTabValue] = useState(() => {
    const hash = window.location.hash.slice(1);
    if (hash === "login") return 0;
    if (hash === "register") return 1;
    return defaultTab === "login" ? 0 : 1;
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "", name: "", phone: "" });
  const [recaptchaToken, setRecaptchaToken] = useState("");

  const { startLogin, startRegister, startGoogleSignIn } = useAuthSlice();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1);
      if (hash === "login") setTabValue(0);
      if (hash === "register") setTabValue(1);
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    const newHash = tabValue === 0 ? "login" : "register";
    if (window.location.hash.slice(1) !== newHash) {
      window.location.hash = newHash;
    }
  }, [tabValue]);

  const validatePhone = (phone: string) => {
    const phoneRegex = /^\+?[1-9]\d{7,14}$/;
    return phoneRegex.test(phone);
  };

  const handleRecaptchaChange = (token: string | null) => {
    if (token) {
      setRecaptchaToken(token);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!recaptchaToken) {
      toast.error("Por favor, completa el reCAPTCHA");
      setIsLoading(false);
      return;
    }

    const emailError = validateEmail(email) ? "" : "Email no válido";
    const passwordError = validatePassword(password) ? "" : "La contraseña debe tener al menos 6 caracteres";
    const nameError = tabValue === 1 ? validateName(true, name) : "";
    const phoneError = tabValue === 1 && !validatePhone(phone) ? "Número de teléfono inválido" : "";

    setErrors({ email: emailError, password: passwordError, name: nameError, phone: phoneError });

    if (!emailError && !passwordError && !nameError && !phoneError) {
      try {
        if (tabValue === 1) {
          const formData = { email, password, name, phone, recaptchaToken };
          const response = await startRegister(formData);

          if (response && response.success) {
            setEmail("");
            setPassword("");
            setName("");
            setPhone("");
            setRecaptchaToken("");

            setTabValue(0);
          }
        } else {
          await startLogin({ email, password });
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
    setIsLoading(false);
  };

  const handleGoogleSignIn = async (response) => {
    setIsLoading(true);
    try {
      await startGoogleSignIn(response);
    } catch (error) {
      toast.error("Error al iniciar sesión con Google");
    }
    setIsLoading(false);
  };

  const pageTransition = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <Box className='h-full mt-44 mb-24 w-full flex items-center justify-center'>
      <Card className='w-full max-w-md lg:max-w-[40%] overflow-visible mx-4'>
        <Box className='border-t-4 border-[#5b7898]'>
          {/* Solo mostramos los tabs si defaultTab no está definido */}
          <Box className='flex justify-between px-6 pt-6 border-b border-gray-200'>
            <Typography
              component='span'
              className={`cursor-pointer px-4 py-2 border-b-2 transition-colors ${
                tabValue === 0 ? "text-[#5b7898] border-[#5b7898] font-medium" : "text-gray-500 border-transparent"
              }`}
              onClick={() => setTabValue(0)}
            >
              Iniciar Sesión
            </Typography>
            <Typography
              component='span'
              className={`cursor-pointer px-4 py-2 border-b-2 transition-colors ${
                tabValue === 1 ? "text-[#5b7898] border-[#5b7898] font-medium" : "text-gray-500 border-transparent"
              }`}
              onClick={() => setTabValue(1)}
            >
              Registrarse
            </Typography>
          </Box>

          <Box className='p-8'>
            <AnimatePresence mode='wait'>
              {tabValue === 0 ? (
                <motion.div key='login' initial='hidden' animate='visible' exit='hidden' variants={pageTransition}>
                  {/* Contenido de Login */}
                  <Typography variant='h5' className='text-[#5b7898] mb-3'>
                    Bienvenido de nuevo
                  </Typography>
                  <span className='pb-2 text-sm text-gray-500'>Ingresa tus credenciales para acceder a tu cuenta</span>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className='space-y-6 mt-6'>
                    <TextField
                      fullWidth
                      label='Correo Electrónico'
                      placeholder='ejemplo@correo.com'
                      variant='outlined'
                      type='email'
                      autoComplete='email'
                      name='email'
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <Email className='text-[#5b7898]' />
                          </InputAdornment>
                        ),
                      }}
                      className='bg-white'
                      sx={{
                        backgroundColor: "white",
                        "& .MuiInputBase-root": {
                          backgroundColor: "white",
                        },
                        "& .MuiInputBase-root.Mui-focused": {
                          backgroundColor: "white",
                        },
                        "& .MuiInputBase-root.Mui-filled": {
                          backgroundColor: "white",
                        },
                      }}
                    />

                    <TextField
                      fullWidth
                      label='Contraseña'
                      placeholder='Ingresa tu contraseña'
                      variant='outlined'
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete='new-password'
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <Lock className='text-[#5b7898]' />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge='end' className='text-[#5b7898]'>
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      className='bg-white'
                      sx={{
                        backgroundColor: "white",
                        "& .MuiInputBase-root": {
                          backgroundColor: "white",
                        },
                        "& .MuiInputBase-root.Mui-focused": {
                          backgroundColor: "white",
                        },
                        "& .MuiInputBase-root.Mui-filled": {
                          backgroundColor: "white",
                        },
                        "& .MuiInputBase-root:-webkit-autofill": {
                          WebkitBoxShadow: "0 0 0 1000px white inset",
                          WebkitTextFillColor: "inherit",
                        },
                        "& input:-webkit-autofill": {
                          WebkitBoxShadow: "0 0 0 1000px white inset",
                          WebkitTextFillColor: "inherit",
                        },
                      }}
                    />

                    <div className='flex justify-center mb-4'>
                      <ReCAPTCHA sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} onChange={handleRecaptchaChange} />
                    </div>

                    <Button fullWidth variant='contained' type='submit' disabled={isLoading} className='bg-[#5b7898] hover:bg-[#4a6277] normal-case py-3'>
                      {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                    </Button>
                  </form>
                </motion.div>
              ) : (
                <motion.div key='register' initial='hidden' animate='visible' exit='hidden' variants={pageTransition}>
                  {/* Contenido de Registro */}
                  <Typography variant='h5' className='text-[#5b7898] mb-3'>
                    Crear una cuenta
                  </Typography>
                  <span className='pb-2 text-sm text-gray-500'>Completa tus datos para registrarte</span>
                  {/* Aquí irían los campos de registro */}
                  <form onSubmit={handleSubmit} className='space-y-4 mt-6'>
                    <TextField
                      fullWidth
                      label='Nombre'
                      placeholder='Ingresa tu nombre completo'
                      variant='outlined'
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      error={!!errors.name}
                      helperText={errors.name}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <Person className='text-[#5b7898]' />
                          </InputAdornment>
                        ),
                      }}
                      className='bg-white'
                      sx={{
                        backgroundColor: "white",
                        "& .MuiInputBase-root": {
                          backgroundColor: "white",
                        },
                        "& .MuiInputBase-root.Mui-focused": {
                          backgroundColor: "white",
                        },
                        "& .MuiInputBase-root.Mui-filled": {
                          backgroundColor: "white",
                        },
                      }}
                    />

                    <TextField
                      fullWidth
                      label='Correo Electrónico'
                      placeholder='ejemplo@correo.com'
                      variant='outlined'
                      type='email'
                      autoComplete='email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      error={!!errors.email}
                      helperText={errors.email}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <Email className='text-[#5b7898]' />
                          </InputAdornment>
                        ),
                      }}
                      className='bg-white'
                      sx={{
                        backgroundColor: "white",
                        "& .MuiInputBase-root": {
                          backgroundColor: "white",
                        },
                        "& .MuiInputBase-root.Mui-focused": {
                          backgroundColor: "white",
                        },
                        "& .MuiInputBase-root.Mui-filled": {
                          backgroundColor: "white",
                        },
                      }}
                    />

                    <TextField
                      fullWidth
                      label='Contraseña'
                      placeholder='Mínimo 6 caracteres'
                      variant='outlined'
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete='new-password'
                      error={!!errors.password}
                      helperText={errors.password}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <Lock className='text-[#5b7898]' />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position='end'>
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge='end' className='text-[#5b7898]'>
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      className='bg-white'
                      sx={{
                        backgroundColor: "white",
                        "& .MuiInputBase-root": {
                          backgroundColor: "white",
                        },
                        "& .MuiInputBase-root.Mui-focused": {
                          backgroundColor: "white",
                        },
                        "& .MuiInputBase-root.Mui-filled": {
                          backgroundColor: "white",
                        },
                        "& .MuiInputBase-root:-webkit-autofill": {
                          WebkitBoxShadow: "0 0 0 1000px white inset",
                          WebkitTextFillColor: "inherit",
                        },
                        "& input:-webkit-autofill": {
                          WebkitBoxShadow: "0 0 0 1000px white inset",
                          WebkitTextFillColor: "inherit",
                        },
                      }}
                    />

                    <TextField
                      fullWidth
                      label='Número de Teléfono'
                      placeholder='+56912345678'
                      variant='outlined'
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      error={!!errors.phone}
                      helperText={errors.phone}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position='start'>
                            <Phone className='text-[#5b7898]' />
                          </InputAdornment>
                        ),
                      }}
                      className='bg-white'
                      sx={{
                        backgroundColor: "white",
                        "& .MuiInputBase-root": {
                          backgroundColor: "white",
                        },
                      }}
                    />

                    <div className='flex justify-center mb-4'>
                      <ReCAPTCHA sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} onChange={handleRecaptchaChange} />
                    </div>

                    <Button fullWidth variant='contained' type='submit' disabled={isLoading} className='bg-[#5b7898] hover:bg-[#4a6277] normal-case py-3 mt-6'>
                      {isLoading ? "Registrando..." : "Registrarse"}
                    </Button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Google Sign In con más espaciado */}
            <Box className='mt-8 space-y-4'>
              <div className='relative flex items-center justify-center'>
                <div className='absolute border-b border-gray-300 w-full'></div>
                <span className='relative px-4 bg-white text-sm text-gray-500'>o continúa con</span>
              </div>

              <GoogleLogin
                size='large'
                width='100%'
                useOneTap={true}
                onSuccess={handleGoogleSignIn}
                onError={() => toast.error("Error al iniciar sesión con Google")}
              />
            </Box>
          </Box>
        </Box>
      </Card>
    </Box>
  );
};
