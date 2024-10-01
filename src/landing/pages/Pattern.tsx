import { Box, Button, Container, Typography } from "@mui/material";
import pattern from "../../assets/fondocandado2.png";
import { useState } from "react";
import { ModalLanding } from "../components/ModalLanding";

export const Pattern = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <Box sx={{ position: "relative", minHeight: "50vh", marginTop: "80px" }}>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: `url(${pattern})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "opacity(10%)",
          zIndex: 0,
        }}
      />
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <Container sx={{ marginY: "80px", marginLeft: "60px" }}>
          <Typography variant='h3' sx={{ fontSize: { xs: 32, md: "3em" }, color: "black", fontWeight: "bold", width: { xs: "100%", md: "80%" } }}>
            Crea programas de fidelización para tus clientes de manera rápida y sencilla.
          </Typography>
          <Typography
            variant='h5'
            sx={{
              marginTop: "4px",
              fontSize: { xs: 16, md: "1.5em" },
              color: "black",
              position: "relative",
              zIndex: 1,
              width: { xs: "100%", md: "80%" },
            }}
          >
            Con Fidelidapp te ayudamos a entender y mejorar la experiencia del cliente.
          </Typography>
          <Button
            variant='contained'
            onClick={handleOpen}
            sx={{
              position: "relative",
              zIndex: 1,
              width: { xs: "80vw", md: "20vw" },
              minHeight: "60px",
              marginBottom: { xs: 2, md: 0 },
              marginTop: { xs: 2, md: 2 },
            }}
          >
            SOLICITA TU DEMO Y CONOCE LOS BENEFICIOS
          </Button>
        </Container>
        <ModalLanding open={open} handleClose={handleClose} />
      </Box>
    </Box>
  );
};
