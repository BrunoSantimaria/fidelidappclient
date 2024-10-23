import React from "react";
import { Box } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useLocation } from "react-router";

const FloatingWhatsAppButton = () => {
  const whatsappNumber = "56996706983";
  const message = "¡Hola! Me gustaría obtener más información sobre Fidelizarte y sus servicios de programas de fidelización. ¡Gracias!";

  const handleClick = () => {
    // Registro del evento en Google Analytics
    if (window.gtag) {
      window.gtag("event", "gtm.linkClick", {
        send_to: "AW-16750398859/mIpMCPK-5OAZEIubm7M-",
        event_category: "engagement",
        event_label: "Floating WhatsApp Button",
        value: 1,
      });
    }

    // Abrir el chat de WhatsApp
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
