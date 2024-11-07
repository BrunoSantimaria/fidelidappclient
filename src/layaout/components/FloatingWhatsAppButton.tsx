import React, { useEffect, useState } from "react";
import { FloatingWhatsApp } from "react-floating-whatsapp";
import { useLocation } from "react-router";

const FloatingWhatsAppButton = () => {
  const whatsappNumber = "56 9 9670 6983";
  const message = "¡Hola! ¿En qué puedo ayudarte?";

  const location = useLocation();
  const allowedRoutes = ["/", "/auth"];

  // Estado para manejar la apertura automática
  const [isOpen, setIsOpen] = useState(false);

  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsOpen(true), 3000); // Abre el chat automáticamente a los 3 segundos
    const notificationTimer = setTimeout(() => setShowNotification(true), 3000); // Muestra la notificación a los 6 segundos

    return () => {
      clearTimeout(timer);
      clearTimeout(notificationTimer);
    };
  }, []);

  if (!allowedRoutes.includes(location.pathname)) {
    return null;
  }

  const handleClick = () => {
    if (window.gtag) {
      window.gtag("event", "gtm.click", {
        event_category: "engagement",
        event_label: "Floating WhatsApp Button",
        value: 1,
      });
    }
  };

  return (
    <FloatingWhatsApp
      phoneNumber={whatsappNumber}
      accountName='Álvaro'
      chatMessage={message}
      notificationDelay={5}
      onClick={handleClick}
      avatar='https://lh3.googleusercontent.com/a-/ALV-UjVHZSdcoLdxtMrMu30bQ2Mofs8hAgn1MU5BV1YP7x-ivg0O0CSimw=s64-p-k-rw-no'
      allowClickAway
      notification={true}
      notificationSound
      messageDelay={2}
      allowEsc
      placeholder='Escribe tu mensaje...'
      chatboxHeight={400}
      statusMessage='Responde típicamente en media hora'
      isOpen={isOpen} // Controla la apertura del chat
      styles={{
        bottom: 40,
        right: 50,
        zIndex: 10,
      }}
    />
  );
};

export default FloatingWhatsAppButton;
