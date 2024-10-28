import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const ThankYou = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => clearTimeout(timeoutId);
  }, [navigate]);

  return (
    <div className='mt-20'>
      <h1>¡Gracias por tu envío!</h1>
      <p>Tu formulario ha sido enviado con éxito.</p>
    </div>
  );
};
