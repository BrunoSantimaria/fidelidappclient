import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const ThankYou = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.gtag) {
      window.gtag("event", "conversion", {
        send_to: "AW-16750398859/c0iYCPTA7-IZEIubm7M-",
      });
    }

    const timeoutId = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [navigate]);

  return (
    <div>
      <h1>¡Gracias por tu envío!</h1>
      <p>Tu formulario ha sido enviado con éxito.</p>
    </div>
  );
};
