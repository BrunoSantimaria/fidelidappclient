import { Box, Button, Typography } from "@mui/material";
import { useState, useEffect } from "react";

import { handleScrollTo } from "@/utils/handleScrollTo";
import { useNavigateTo } from "@/hooks/useNavigateTo";
import { useLocation } from "react-router-dom";
import { ModalLanding } from "@/landing/components/ModalLanding";

export const Hero = ({ refs }) => {
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
      ref={refs}
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
        <h1 className='text-white mb-4 text-left w-full md:w-[60%] text-4xl md:text-5xl font-bold'>Aumenta tus ventas y fideliza a tus clientes</h1>
        <h2 className='text-white text-left w-full md:w-[60%] text-lg md:text-xl'>
          Con Fidelidapp, impulsa la lealtad de tus clientes con promociones, tarjetas virtuales y campañas efectivas. ¡Todo en un solo lugar!
        </h2>
        <Box
          sx={{
            marginTop: 4,
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          <span
            onClick={handleClick}
            className='bg-main/90 rounded-lg my-auto text-base p-4 duration-300 text-white cursor-pointer group hover:scale-105 text-center hover:bg-main'
          >
            {" "}
            Prueba Gratis Hoy
          </span>

          <span
            onClick={handleOpen}
            className='bg-transparent border border-main rounded-lg my-auto text-base p-4 duration-300 text-white cursor-pointer group hover:scale-105 text-center hover:bg-main'
          >
            Solicita una Demo
          </span>
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
          filter: "brightness(25%)",

          zIndex: 0,
        }}
      ></Box>

      <span
        onClick={() => handleScrollTo(refs.WhatIsFidelidapp)}
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
