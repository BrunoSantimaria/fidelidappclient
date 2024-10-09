import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/api";
import { Backdrop, Button, CircularProgress, TextField, Snackbar } from "@mui/material";
import { useAuthSlice } from "../../hooks/useAuthSlice";
import { useNavigateTo } from "../../hooks/useNavigateTo";
import background from "../../assets/fondocandado2.png";

export const PromotionClient = () => {
  const { id } = useParams();
  const { status } = useAuthSlice();
  const { handleNavigate } = useNavigateTo();
  const [loading, setLoading] = useState(true);
  const [promotion, setPromotion] = useState(null);
  const [clientEmail, setClientEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  console.log(promotion);

  if (status && status === "authenticated") handleNavigate(`/dashboard/promotion/${id}`);

  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        const response = await api.get(`/api/promotions/${id}`);
        setPromotion(response.data);
      } catch (error) {
        console.error("Error fetching promotion:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotion();
  }, [id]);

  const handleEmailChange = (event) => {
    setClientEmail(event.target.value);
  };

  const handleSubmit = async () => {
    if (!clientEmail) {
      setSnackbarMessage("Por favor, ingresa un email válido.");
      setSnackbarOpen(true);
      return;
    }

    // Regex para validar el formato del email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientEmail)) {
      setSnackbarMessage("Por favor, ingresa un email válido.");
      setSnackbarOpen(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post("/api/promotions/client", {
        promotionId: id,
        clientEmail: clientEmail,
      });
      setSnackbarMessage("Te has sumado exitosamente a la promoción.");
      setClientEmail(""); // Limpiar el input de email
    } catch (error) {
      setSnackbarMessage("Error al sumarte a la promoción. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
      setSnackbarOpen(true);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Backdrop open>
        <CircularProgress color='inherit' />
      </Backdrop>
    );
  }

  if (!promotion) {
    return (
      <div className='relative flex flex-col m-0 text-center justify-center w-screen h-screen'>
        {/* Fondo con opacidad */}
        <div
          className='absolute inset-0 bg-cover bg-center'
          style={{
            backgroundImage: `url(${background})`,
            opacity: 0.5,
          }}
        ></div>
        <div className='relative z-10'>
          <div>Esta promoción no existe.</div>
          <div
            onClick={() => handleNavigate("/")}
            className='p-2 bg-main w-[30%] justify-center mx-auto my-10 rounded-md text-white cursor-pointer hover:bg-main/60 duration-300'
          >
            Volver a home.
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className='relative flex flex-col justify-center place-items-center space-y-6 w-full h-screen'>
      {/* Fondo con opacidad */}
      <div className='space-y-2 flex flex-col mb-6'>
        <p className='flex flex-col'>Para ser agregado a la promoción, inscribe tu email a continuación:</p>
        <TextField label='Email' variant='filled' sx={{ width: "100%" }} value={clientEmail} onChange={handleEmailChange} />
        <Button
          variant='contained'
          onClick={handleSubmit}
          disabled={isSubmitting} // Deshabilitar el botón mientras se envía
        >
          {isSubmitting ? "Sumándose a la promoción..." : "Sumarme a la promoción."}
        </Button>
      </div>

      {/* Contenido de la promoción */}
      <div className='flex flex-row justify-between w-full max-w-6xl mx-auto'>
        {/* Contenedor de la promoción */}
        <div className='relative z-10 w-[60%] space-y-6 shadow-neutral-200 bg-gradient-to-br from-gray-50 to-main/50 m-0 text-left p-6 rounded-md shadow-md'>
          <h1 className='font-poppins font-bold'>{promotion.title}</h1>
          <p className='font-medium'>{promotion.description}</p>
          <div>
            <p className='italic'>
              La promoción se activa con: {promotion.visitsRequired} visitas en {promotion.promotionDuration} días.
            </p>
            <p className='italic'>Términos y condiciones aplican, serán enviados a tu correo una vez inscrito a la promoción</p>
          </div>
        </div>

        {/* Imagen de la promoción */}
        <div className='relative z-10 w-[35%] flex justify-center'>
          <div className='w-full h-80 rounded-md overflow-hidden bg-gray-200 shadow-md'>
            <img src={promotion.imageUrl} alt='Promotion' className='object-cover w-full h-full' />
          </div>
        </div>
      </div>

      {/* Snackbar para mostrar mensajes */}
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
      />

      {/* Backdrop con CircularProgress */}
      <Backdrop open={isSubmitting} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color='inherit' />
        <div className='mt-2 text-white'>Sumándose a la promoción...</div>
      </Backdrop>
    </section>
  );
};
