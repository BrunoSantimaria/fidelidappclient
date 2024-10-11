import React from "react";
import { Container, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ThankYou = () => {
  const navigate = useNavigate();

  const handleReturnHome = () => {
    navigate("/");
  };

  return (
    <Container sx={{ margin: "auto", textAlign: "center" }}>
      <Typography variant='h4' gutterBottom>
        ¡Gracias!
      </Typography>
      <Typography variant='body1' paragraph>
        Tu acción ha sido procesada con éxito. Gracias por usar nuestros servicios.
      </Typography>
      <Button variant='contained' color='primary' onClick={handleReturnHome}>
        Regresar a la Página Principal
      </Button>
    </Container>
  );
};

export default ThankYou;
