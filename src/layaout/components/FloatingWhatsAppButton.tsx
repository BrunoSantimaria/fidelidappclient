import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const WhatsAppButton = () => {
  const location = useLocation(); // Hook para obtener la ruta actual
  const whatsappNumber = "56996706983";
  const message = "Hola, quiero consultar.";

  const handleClick = () => {
    if (window.gtag) {
      window.gtag("event", "click", {
        event_category: "engagement",
        event_label: "WhatsApp Button",
        value: 1,
      });
    }
  };

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  // Mostrar solo si estamos en la ruta raíz
  if (location.pathname !== "/") {
    return null;
  }

  return (
    <a
      id='whatsapp-button'
      href={whatsappUrl}
      target='_blank'
      rel='noopener noreferrer'
      onClick={handleClick}
      className='animate-pulse'
      style={{
        position: "fixed",
        bottom: "40px",
        right: "30px",
        backgroundColor: "#25D366",
        color: "white",
        padding: "20px 20px",
        borderRadius: "50px",
        textDecoration: "none",
        fontWeight: "bold",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        zIndex: 10,
      }}
    >
      <FaWhatsapp className='w-8 h-8' id='whatsapp-button' />
    </a>
  );
};

export default WhatsAppButton;
