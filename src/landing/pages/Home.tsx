import { Box, Button, Typography } from "@mui/material";
import background from "../../assets/Cover.jpeg";
import { useState } from "react";
import { ModalLanding } from "../components/ModalLanding";

export const Home = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      sx={{
        position: "relative",
        height: "80vh",
        minWidth: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <Box>
        <Typography variant='h3' sx={{ fontSize: { xs: 32, md: "3em" }, color: "white", position: "relative", zIndex: 1, width: { xs: "100%", md: "60%" } }}>
          Programas de Lealtad y Fidelidad
        </Typography>
        <Typography
          variant='h5'
          sx={{ fontSize: { xs: 16, md: "1.5em" }, color: "white", position: "relative", zIndex: 1, width: { xs: "100%", md: "40%" }, marginTop: 4 }}
        >
          Descubre cómo Fidelidapp puede ayudarte a generar promociones y tarjetas de fidelidad virtuales ajustadas a las necesidades de tu negocio.
        </Typography>
        <Box sx={{ marginTop: 4 }}>
          <Button
            variant='contained'
            sx={{
              position: "relative",
              minHeight: "80px",
              zIndex: 1,
              width: { xs: "80vw", md: "12vw" },
              marginRight: { md: 2 },
              marginBottom: { xs: 2, md: 0 },
            }}
          >
            Agenda tu asesoría gratuita.
          </Button>
          <Button
            variant='contained'
            sx={{
              position: "relative",
              zIndex: 1,
              width: { xs: "80vw", md: "12vw" },
              minHeight: "80px",
              marginBottom: { xs: 2, md: 0 },
            }}
            onClick={handleOpen} // Abre el modal cuando el botón es clickeado
          >
            Escríbenos para conocer más.
          </Button>
        </Box>
        <Typography
          sx={{
            color: "white",
            position: "relative",
            zIndex: 1,
            width: { xs: "100%", md: "40%" },
            marginTop: 4,
            fontStyle: "italic",
          }}
        >
          Sin compromiso. Conoce cómo podemos ayudarte a fidelizar a tus clientes.
        </Typography>
      </Box>

      <ModalLanding open={open} handleClose={handleClose} />

      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: { xs: -400, md: 0 },
          right: 0,
          bottom: 0,
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(4px) brightness(50%)",
          zIndex: 0,
        }}
      />
    </Box>
  );
};
