"use client";

import { useState, useEffect } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import "animate.css"; // Importa Animate.css

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentRoute, setCurrentRoute] = useState(location.pathname);
  const [animationClass, setAnimationClass] = useState("");
  const [isCardVisible, setIsCardVisible] = useState(true);

  // Detecta cuando se navega a una nueva ruta
  useEffect(() => {
    setCurrentRoute(location.pathname);
  }, [location]);

  // Cuando navegamos hacia una nueva ruta, cambiamos la animación
  useEffect(() => {
    if (currentRoute === "/landingpage") {
      setAnimationClass("animate__animated animate__fadeInLeft");
      setIsCardVisible(false); // Cuando la landing page se muestra, ocultamos la fidelicard
    } else {
      setAnimationClass("animate__animated animate__fadeInLeft");
      setIsCardVisible(true); // Cuando se vuelve a la fidelicard, la mostramos
    }
  }, [currentRoute]);

  // Manejar el cambio de ruta
  const handleRouteChange = (newRoute: string) => {
    setAnimationClass("animate__animated animate__fadeOutLeft"); // Animación de salida
    navigate(newRoute);
  };

  return (
    <div className='relative w-full h-screen '>
      {/* La tarjeta (Fidelicard) que se muestra encima */}
      {isCardVisible && (
        <div
          key='fidelicard'
          className={`absolute w-full h-full ${animationClass} z-20`} // Usamos z-index para asegurarnos de que esté encima
        >
          <Outlet context={{ onNavigate: handleRouteChange }} />
        </div>
      )}

      {/* La landing page queda en el fondo (si está oculta) */}
      {!isCardVisible && (
        <div
          key='landingpage'
          className='absolute w-full h-full animate__animated animate__fadeInLeft z-10' // Aseguramos que la landing está detrás de la fidelicard
        >
          <Outlet context={{ onNavigate: handleRouteChange }} />
        </div>
      )}
    </div>
  );
}
