import React from "react";
import { Box } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useLocation } from "react-router";

const FloatingWhatsAppButton = () => {
  const whatsappNumber = "56996706983";
  const message = "¡Hola! Me gustaría obtener más información sobre Fidelizarte y sus servicios de programas de fidelización. ¡Gracias!";

  const handleClick = (e) => {
    // Obtén el elemento que disparó el evento
    const buttonElement = e.currentTarget;

    // Accede al id y clases del botón
    const buttonId = buttonElement.id;
    const buttonClasses = buttonElement.className;

    console.log("Button ID:", buttonId);
    console.log("Button Classes:", buttonClasses);

    // Solo se envía el evento a Google Analytics si está definido
    if (window.gtag) {
      window.gtag("event", "gtm.click", {
        event_category: "engagement",
        event_label: "Floating WhatsApp Button",
        value: 1,
        button_id: buttonId, // Puedes agregarlo al evento
        button_classes: buttonClasses, // También aquí
      });
    }

    // Abre WhatsApp con el número y mensaje especificados
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`);
  };

  const location = useLocation();
  const allowedRoutes = ["/", "/auth"];

  if (!allowedRoutes.includes(location.pathname)) {
    return null;
  }

  return (
    <Box
      onClick={handleClick}
      id='whatsapp-button'
      aria-label='whatsapp'
      sx={{
        zIndex: 10,
        position: "fixed",
        bottom: 20,
        right: 50,
        backgroundColor: "green",
        borderRadius: "50%",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
        cursor: "pointer",
        p: 2,
        "&:hover": {
          backgroundColor: "darkgreen",
        },
      }}
    >
      <WhatsAppIcon sx={{ color: "white", fontSize: 55 }} />
    </Box>
  );
};

export default FloatingWhatsAppButton;
