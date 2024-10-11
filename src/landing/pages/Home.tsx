import { Box, Button, Container, Typography } from "@mui/material";
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
        height: { xs: "100vh", md: "80vh" },
        maxWidth: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        top: 60,
      }}
    >
      <Box sx={{ paddingX: { xs: 2, md: 6 }, textAlign: { xs: "left", sm: "left", md: "left", lg: "left" } }}>
        <Typography
          variant='h3'
          sx={{
            fontWeight: "bold",
            fontSize: { xs: 24, sm: 28, md: 32, lg: 32, xl: "3em" },
            color: "white",
            position: "relative",
            bottom: { xs: 80, sm: 120, md: 150, lg: 0 },
            zIndex: 1,
            width: { xs: "100%", sm: "90%", md: "70%", lg: "60%" },
          }}
        >
          Programas de Lealtad y Fidelidad
        </Typography>
        <Typography
          variant='h5'
          sx={{
            fontSize: { xs: 12, sm: 14, md: "1.5em" }, // Texto responsivo
            color: "white",
            position: "relative",
            bottom: { xs: 70, sm: 120, md: 150, lg: 0 },
            zIndex: 1,
            width: { xs: "100%", sm: "90%", md: "50%", lg: "40%" }, // Ajustando ancho
            marginTop: { xs: 1, sm: 2, md: 4 },
          }}
        >
          <span className=''>
            Descubre cómo Fidelidapp puede ayudarte a generar promociones y tarjetas de fidelidad virtuales ajustadas a las necesidades de tu negocio.
          </span>
        </Typography>
        <Box sx={{ marginTop: { xs: 1, sm: 2, md: 4 }, display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: "center" }}>
          <Button
            variant='contained'
            sx={{
              position: "relative",
              bottom: { xs: 60, sm: 100, md: 100, lg: 0 },

              minHeight: { xs: "50px", md: "60px", lg: "80px" }, // Ajustando altura mínima
              zIndex: 1,
              width: { xs: "100%", sm: "70%", md: "16vw", lg: "14vw" }, // Ajustando ancho
              marginRight: { md: 2 },
              marginBottom: { xs: 2, md: 0 },
              fontSize: { xs: 12, sm: 14, lg: 12, xl: 14 },
            }}
          >
            Agenda tu asesoría gratuita.
          </Button>
          <Button
            variant='contained'
            sx={{
              position: "relative",
              zIndex: 1,
              width: { xs: "100%", sm: "70%", md: "14vw", lg: "14vw" }, // Ajustando ancho
              minHeight: { xs: "50px", md: "60px", lg: "80px" }, // Ajustando altura mínima
              marginBottom: { xs: 2, md: 0 },
              bottom: { xs: 60, sm: 100, md: 100, lg: 0 },
              fontSize: { xs: 12, sm: 14, lg: 12, xl: 14 },
            }}
            onClick={handleOpen}
          >
            Escríbenos para conocer más.
          </Button>
        </Box>
        <Typography
          sx={{
            color: "white",
            position: "relative",
            zIndex: 1,
            bottom: { xs: 60, md: 60, lg: 0 },
            width: { xs: "100%", sm: "90%", md: "50%", lg: "40%" }, // Ajustando ancho
            marginTop: { xs: 1, sm: 2, md: 4 },
            fontStyle: "italic",
            fontSize: { xs: 10, sm: 12, md: "inherit" }, // Ajustando tamaño de fuente
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
          bottom: { xs: "0", sm: "0", md: 300, lg: "0" },
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
