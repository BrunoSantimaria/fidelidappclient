import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress } from "@mui/material";
import { toast } from "react-toastify";
import api from "../../utils/api";

export const VerifyEmailPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await api.get(`/auth/verify-email/${token}`);
        toast.success("Email verificado exitosamente");
        setTimeout(() => {
          navigate("/auth/login#login");
        }, 3000);
      } catch (error) {
        toast.error("Error al verificar el email");
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <Box className='h-screen flex items-center justify-center'>
      {isVerifying ? <CircularProgress /> : <Typography variant='h5'>Verificación completada. Redirigiendo al login...</Typography>}
    </Box>
  );
};
