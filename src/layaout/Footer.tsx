import React from "react";
import Logo from "../assets/LOGO-SIN-FONDO.png";
import { ContactInfo } from "./components/ContactInfo";
import { ImportantLinks } from "./components/ImportantLinks";
import { useLocation } from "react-router-dom";

export const Footer = ({ refs }) => {
  const location = useLocation();

  const allowedRoutes = ["/", "/auth/login"];

  // Verifica si la ruta actual empieza con "/agendas/"
  const isAgendasRoute = location.pathname.startsWith("/agendas/");

  // Si la ruta actual no está en allowedRoutes o no empieza con "/agendas/", retorna null
  if (!allowedRoutes.includes(location.pathname) && !isAgendasRoute) {
    return null;
  }

  return (
    <footer className='bg-main mt-0 pb-4 w-full'>
      <div className='max-w-6xl mx-auto px-4 md:px-6 lg:px-8'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-4'>
          {/* Logo */}
          <div className='flex items-center justify-center md:justify-start'>
            <img src={Logo} alt='Logo' className='w-40' />
          </div>
          {/* Información de contacto */}
          <div className='text-white'>
            <ContactInfo />
          </div>
          {/* Enlaces importantes */}
          <div className='text-white'>
            <ImportantLinks refs={refs} />
          </div>
        </div>
        <div className='border-t border-gray-700 mt-4 pt-4 text-center mb-6'>
          <p className='text-sm text-gray-300'>&copy; {new Date().getFullYear()} FidelidApp. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
