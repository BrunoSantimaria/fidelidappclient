import { Box, Button, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { ModalLanding } from "../components/ModalLanding";
import { handleScrollTo } from "../../utils/handleScrollTo";
import { useNavigateTo } from "../../hooks/useNavigateTo";
import { useLocation } from "react-router-dom";

export const Home = ({ refs }) => {
  const [open, setOpen] = useState(false);

  const { handleNavigate } = useNavigateTo();
  const location = useLocation();

  const handleClick = () => {
    handleNavigate("/auth/login", { state: { showRegister: true } });
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const { state } = location;
    if (state?.scrollTo) {
      document.querySelector(state.scrollTo)?.scrollIntoView({ behavior: "smooth" });
    }
  }, [location]);

  return (
    <Box
      sx={{
        position: "relative",
        height: { xs: "100vh", md: "100vh" },
        maxWidth: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* Contenido principal */}
      <Box
        sx={{
          marginTop: { xs: 0, md: 0 },
          paddingX: { xs: 2, md: 6 },
          textAlign: "left",
          zIndex: 1,
          position: "relative",
        }}
      >
        <Typography
          variant='h1'
          sx={{
            fontWeight: "bold",
            fontSize: { xs: 36, md: "3em" },
            color: "white",
            width: { xs: "100%", md: "70%" },
          }}
        >
          ¡Convierte tus visitas en clientes frecuentes desde hoy!
        </Typography>
        <Typography
          variant='h5'
          sx={{
            fontSize: { xs: 16, md: "1.5em" },
            color: "white",
            width: { xs: "100%", md: "70%" },
            marginTop: { xs: 1, md: 4 },
          }}
        >
          Con Fidelidapp crea y gestiona <span className='font-bold'>programas de lealtad</span> con puntos, promociones, tarjetas virtuales y{" "}
          <span className='font-bold'>email marketing</span> masivo. <span className='font-bold'>¡Prueba gratis hoy!</span>
        </Typography>
        <Box sx={{ marginTop: 4, display: "flex", gap: 2, flexDirection: { xs: "column", md: "row" } }}>
          <Button
            onClick={handleClick}
            variant='contained'
            aria-label='Registrate gratis'
            sx={{
              width: { xs: "100%", md: "16vw" },
              minHeight: "60px",
            }}
          >
            Regístrate Gratis Ahora
          </Button>
          <Button
            onClick={handleOpen}
            variant='contained'
            sx={{
              width: { xs: "100%", md: "16vw" },
              minHeight: "60px",
            }}
          >
            Escríbenos para conocer más
          </Button>
        </Box>
      </Box>

      <ModalLanding open={open} handleClose={handleClose} />

      {/* Imagen de fondo optimizada */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${"https://res.cloudinary.com/di92lsbym/image/upload/f_auto,q_auto/v1733268677/FidelidApp/Assets/Cover3_sybmbq.jpg"})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(30%)",
          zIndex: 0,
        }}
      ></Box>

      <span
        onClick={() => handleScrollTo(refs)}
        aria-label='Scroll hacia abajo'
        className='absolute bg-main rounded-md bottom-2 animate-bounce p-4 cursor-pointer group hover:bg-white'
      >
        <svg xmlns='http://www.w3.org/2000/svg' className='text-white group-hover:text-main' viewBox='0 0 24 24' fill='currentColor' width='24' height='24'>
          <path d='M12 2L12 20M18 14L12 20L6 14' />
        </svg>
      </span>
    </Box>
  );
};
