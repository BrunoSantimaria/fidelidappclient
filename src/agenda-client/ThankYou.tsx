import React from "react";
import { Container, Typography, Button, Box, Stack, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LoginPage } from "../auth/pages/LoginPage"; // Import the LoginPage component

const ThankYou = () => {
  const navigate = useNavigate();

  const handleReturnHome = () => {
    navigate("/");
  };

  const handleCreateAccount = () => {
    navigate("/signup");
  };

  return (
    <Container maxWidth="xl" sx={{ padding: "1rem", alignItems: "center" }}>
      {/* Full-width title */}
      <Box sx={{ textAlign: "center", marginTop: "2rem", backgroundColor: "primary.main", padding: "1rem",color: "white" }}>
        <Typography variant="h4" gutterBottom>
          ¡Gracias por tu contacto!
        </Typography>
        <Typography variant="body1">
          Nos pondremos en contacto contigo lo antes posible.
        </Typography>
      </Box>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems="center">
        {/* Left Side: Text and Buttons */}
        <Box flex={1}>
          <Paper sx={{ padding: "1rem", backgroundColor: "#f0f4ff" }} elevation={3}>
            <Box my={3}>
              <Typography variant="h5" gutterBottom>
                ¿Te interesaría probar Fidelidapp gratis?
              </Typography>
              <Typography variant="body1" >
              <br />Crea una cuenta gratuita y descubre todos los beneficios de Fidelidapp:<br />
              </Typography>
              <Typography variant="body1" >
              <br />   - Gestiona promociones y recompensas en un solo lugar.<br />
                - Envía emails personalizados a tus clientes.<br />
                - Dispón de una agenda web para las reservas de tu negocio.<br />
                - Disfruta de alertas personalizadas para tus clientes.<br />
                - Haz crecer tu fidelidad y obtén recompensas exclusivas. <br />
              </Typography>
              <Typography variant="body1" >
                <br /> Gratis hasta que 250 de tus clientes se inscriban en una promoción.
                <br /><br /> Inscríbete a continuación.
              </Typography>
            </Box>
          </Paper>
        </Box>

        {/* Right Side: Login Form */}
        <Box flex={1} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <LoginPage /> {/* Embed the LoginPage component */}
        </Box>
      </Stack>
    </Container>
  );
};

export default ThankYou;
