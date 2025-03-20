import { Box, Button, Modal } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigateTo } from "@/hooks/useNavigateTo";
import { useLocation } from "react-router-dom";

export const Hero = ({ refs }) => {
  const [open, setOpen] = useState(false);
  const { handleNavigate } = useNavigateTo();
  const location = useLocation();

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
        height: { xs: "85vh", md: "85vh" },
        maxWidth: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
      ref={refs.homeRef}
    >
      {/* Contenido principal */}
      <Box
        sx={{
          paddingX: { xs: 2, md: 6 },
          textAlign: "left",
          zIndex: 1,
          position: "relative",
        }}
      >
        <h1 className="text-white mb-4 text-left w-full md:w-[60%] text-4xl md:text-5xl font-bold">
          Aumenta tus ventas y fideliza a tus clientes
        </h1>
        <h2 className="text-white text-left w-full md:w-[60%] text-lg md:text-xl">
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
          {/* Botón 1 - Agendar Asesoría (Mismo color original) */}
          <span
            onClick={() => window.open("https://www.fidelidapp.cl/agendas/67d99cf731d4bba56cbbd9c3", "_blank")}
            className="bg-main/90 rounded-lg my-auto text-base p-4 duration-300 text-white cursor-pointer group hover:scale-105 text-center hover:bg-main"
          >
            📅 Agendar una Asesoría
          </span>

          {/* Botón 2 - Ver Demo (Mismo color original) */}
          <span
            onClick={handleOpen}
            className="bg-transparent border border-main rounded-lg my-auto text-base p-4 duration-300 text-white cursor-pointer group hover:scale-105 text-center hover:bg-main"
          >
            🎥 Ver Demo en 2 Minutos
          </span>
        </Box>
      </Box>

      {/* Modal para Video Demo */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "90%",
            maxWidth: "800px",
            bgcolor: "black",
            boxShadow: 24,
            p: 2,
            borderRadius: "10px",
          }}
        >
          <iframe
            width="100%"
            height="400px"
            src="https://www.youtube.com/embed/VgWG3kQIUHM"
            title="Fidelidapp Demo"
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          ></iframe>
        </Box>
      </Modal>

      {/* Imagen de fondo optimizada */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url("https://res.cloudinary.com/di92lsbym/image/upload/f_auto,q_auto/v1733268677/FidelidApp/Assets/Cover3_sybmbq.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(25%)",
          zIndex: 0,
        }}
      ></Box>
    </Box>
  );
};
