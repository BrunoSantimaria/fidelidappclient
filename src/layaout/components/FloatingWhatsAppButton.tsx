import { useEffect, useState, useMemo } from "react";
import { FloatingWhatsApp } from "react-floating-whatsapp";
import { useLocation } from "react-router";

const FloatingWhatsAppButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const location = useLocation();
  const allowedRoutes = ["/", "/auth"];
  const whatsappNumber = useMemo(() => "56996706983", []);
  const message = useMemo(() => "¡Hola! ¿En qué puedo ayudarte?", []);

  useEffect(() => {
    if (!localStorage.getItem("whatsappButtonShown")) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        localStorage.setItem("whatsappButtonShown", "true");
      }, 3000);

      const notificationTimer = setTimeout(() => {
        setShowNotification(true);
      }, 3000);

      return () => {
        clearTimeout(timer);
        clearTimeout(notificationTimer);
      };
    }
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
      avatar='https://res.cloudinary.com/di92lsbym/image/upload/q_auto,f_webp/v1731025035/WhatsApp_Image_2024-11-07_at_9.02.33_PM_upob6c.jpg'
      allowClickAway
      notification={showNotification}
      notificationSound
      messageDelay={2}
      allowEsc
      placeholder='Escribe tu mensaje...'
      chatboxHeight={400}
      statusMessage='Responde típicamente en media hora'
      isOpen={isOpen}
      styles={{
        bottom: 40,
        right: 50,
        zIndex: 10,
      }}
    />
  );
};

export default FloatingWhatsAppButton;
