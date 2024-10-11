import React from "react";
import { Button, Container, Typography } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import api from "../utils/api";

const CancelAppointment = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();

  const handleCancel = async () => {
    if (window.confirm("¿Estás seguro de que deseas cancelar esta cita?")) {
      try {
        const response = await api.post("/api/agenda/cancelAppointment/" + appointmentId);
        if (response.status === 200) {
          toast.success("Cita cancelada con éxito.");
          navigate("/thank-you"); // Redirect to a thank-you page or homepage
        } else {
          alert("Error al cancelar la cita.");
        }
      } catch (error) {
        console.error("Error al enviar la solicitud:", error);
        alert("Error al enviar la solicitud.");
      }
    } else {
      alert("Cancelación cancelada.");
    }
  };

  return (
    <Container sx={{ margin: "auto", textAlign: "center" }}>
      <Typography variant='h4' gutterBottom>
        Cancelar Cita
      </Typography>
      <Typography variant='body1' paragraph>
        Para cancelar tu cita haz click a continuación.
      </Typography>
      <Button variant='contained' color='primary' onClick={handleCancel}>
        Cancelar Cita
      </Button>
    </Container>
  );
};

export default CancelAppointment;
