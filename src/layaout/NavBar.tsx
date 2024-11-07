import React, { useState, useEffect } from "react";
import { MdOutlineMenu } from "react-icons/md";
import { useLocation } from "react-router";
import { useAuthSlice } from "../hooks/useAuthSlice";
import { useNavigateTo } from "../hooks/useNavigateTo";
import { handleScrollTo } from "../utils/handleScrollTo";
import { motion } from "framer-motion"; // Importamos Framer Motion

import logo from "../assets/LOGO-SIN-FONDO.png";

export const NavBar = ({ refs }) => {
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const { user, startLoggingOut } = useAuthSlice();
  const { handleNavigate } = useNavigateTo();
  const [sticky, setSticky] = useState(false); // Estado para manejar el sticky

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const allowedRoutes = ["/", "/auth/login"];
  const isAgendasRoute = location.pathname.startsWith("/agendas/");

  if (!allowedRoutes.includes(location.pathname) && !isAgendasRoute) {
    return null;
  }

  const isHome = location.pathname === "/";

  // Cambiar el estado sticky cuando se haga scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setSticky(true);
      } else {
        setSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={`w-full max-w-full z-50`}>
      {/* Navbar Principal */}
      <motion.header
        className={`transition-all duration-500 ${sticky || !isHome ? "bg-[#5b7898]" : "bg-transparent"} ${!isHome ? "top-0" : "top-0"} w-full px-5 md:px-10 lg:px-16 h-16 md:h-20 lg:h-24 flex items-center fixed left-0 right-0 ${sticky ? "shadow-lg" : ""}`}
      >
        <div className='flex items-center flex-grow'>
          <img src={logo} alt='Logo' className='h-12 md:h-20 lg:h-20 xl:h-20' />
        </div>

        {/* Icono de menú móvil */}
        <div className='flex  md:hidden bg-transparent'>
          <MdOutlineMenu onClick={handleMenuToggle} size={42} className='text-white bg-transparent' />
        </div>

        {/* Menú Desktop */}
        <nav className='hidden md:flex items-center space-x-8 text-lg'>
          <span
            onClick={() => {
              location.pathname !== "/" ? handleNavigate("/") : handleScrollTo(refs.homeRef);
            }}
            className='cursor-pointer text-white hover:text-gray-400 transition duration-500'
          >
            Home
          </span>
          <span onClick={() => handleScrollTo(refs.servicesRef)} className='cursor-pointer text-white hover:text-gray-400 transition duration-200'>
            Cómo Funciona
          </span>
          <span onClick={() => handleScrollTo(refs.plansRef)} className='cursor-pointer text-white hover:text-gray-400 transition duration-200'>
            Planes
          </span>
          <span onClick={() => handleScrollTo(refs.contactRef)} className='cursor-pointer text-white hover:text-gray-400 transition duration-200'>
            Contacto
          </span>
          <div>
            {user ? (
              <div className='space-x-6'>
                <span onClick={() => handleNavigate("/dashboard")} className='cursor-pointer text-white hover:text-gray-400 transition duration-200'>
                  Dashboard
                </span>
                <span onClick={startLoggingOut} className='cursor-pointer text-white hover:text-gray-400 transition duration-200'>
                  Salir
                </span>
              </div>
            ) : (
              <span
                onClick={() => handleNavigate("/auth/login")}
                className={`${!isHome && "hidden"} bg-main p-4 rounded-md cursor-pointer text-white transition duration-700  hover:bg-white hover:text-main transform hover:scale-110`}
              >
                Registrate
              </span>
            )}
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu Drawer */}
      {showMenu && (
        <motion.div
          className='fixed inset-0 bg-black bg-opacity-50 z-40'
          onClick={handleMenuToggle}
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ duration: 0.3 }}
        >
          <div className='bg-white w-64 h-full shadow-lg z-50' onClick={(e) => e.stopPropagation()}>
            <div className='p-4'>
              <div className='flex flex-col space-y-4 mt-4'>
                <span
                  onClick={() => {
                    location.pathname !== "/" ? handleNavigate("/") : handleScrollTo(refs.homeRef);
                  }}
                  className='text-black hover:text-gray-500 cursor-pointer hover:bg-main/50 p-2 rounded-md'
                >
                  Home
                </span>
                <span
                  onClick={() => {
                    handleMenuToggle();
                    handleScrollTo(refs.servicesRef);
                  }}
                  className='text-black hover:text-gray-500 cursor-pointer hover:bg-main/50 p-2 rounded-md'
                >
                  Cómo Funciona
                </span>
                <span
                  onClick={() => {
                    handleMenuToggle();
                    handleScrollTo(refs.plansRef);
                  }}
                  className='text-black hover:text-gray-500 cursor-pointer hover:bg-main/50 p-2 rounded-md'
                >
                  Planes
                </span>
                <span
                  onClick={() => {
                    handleMenuToggle();
                    handleScrollTo(refs.contactRef);
                  }}
                  className='text-black hover:text-gray-500 cursor-pointer hover:bg-main/50 p-2 rounded-md'
                >
                  Contacto
                </span>
                {user ? (
                  <>
                    <span
                      onClick={() => {
                        handleMenuToggle();
                        handleNavigate("/dashboard");
                      }}
                      className='text-black hover:text-gray-500 cursor-pointer hover:bg-main/50 p-2 rounded-md'
                    >
                      Dashboard
                    </span>
                    <span onClick={startLoggingOut} className='text-red-700 hover:text-gray-500 cursor-pointer hover:bg-main/50 p-2 rounded-md'>
                      Salir
                    </span>
                  </>
                ) : (
                  <span
                    onClick={() => {
                      handleMenuToggle();
                      handleNavigate("/auth/login");
                    }}
                    className='text-black hover:text-gray-500 cursor-pointer hover:bg-main/50 p-2 rounded-md'
                  >
                    Iniciar Sesión
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
