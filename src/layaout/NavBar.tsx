import React, { useState, useEffect } from "react";
import { MdOutlineMenu } from "react-icons/md";
import { useLocation } from "react-router";
import { useAuthSlice } from "../hooks/useAuthSlice";
import { useNavigateTo } from "../hooks/useNavigateTo";
import { handleScrollTo } from "../utils/handleScrollTo";
import { motion } from "framer-motion"; // Importamos Framer Motion

import logo from "../assets/LOGO-SIN-FONDO.png";

export const NavBar = ({ refs }) => {
  console.log(refs);
  const location = useLocation();
  const [showMenu, setShowMenu] = useState(false);
  const { user, startLoggingOut } = useAuthSlice();
  const { handleNavigate } = useNavigateTo();
  const [sticky, setSticky] = useState(false); // Estado para manejar el sticky
  const [showFeatures, setShowFeatures] = useState(false);

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const allowedRoutes = ["/", "/auth/login", "/features", "/services"];

  const isHome = location.pathname === "/";

  const isAuth = {
    login: location.pathname === "/auth/login",
    register: location.pathname === "/auth/login#register",
  };

  const featuresItems = [
    "Base de datos",
    "Email Marketing",
    "Sms Marketing",
    "Informes y Métricas",
    "Sistema de Puntos/Promociones",
    "Landing Page Personalizable",
    "Agenda y Citas",
  ];

  const formatFeatureUrl = (feature) => {
    return feature
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-");
  };

  // Cambiar el estado sticky cuando se haga scroll
  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname === "/services" && !isHome && window.scrollY === 0) {
        setSticky(true);
      }
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

  // Renderizar el NavBar siempre, pero realizar condiciones solo sobre el contenido.
  if (!allowedRoutes.includes(location.pathname)) {
    return null; // No renderizar nada si no está permitido
  }

  return (
    <div className={`w-full max-w-full z-50`}>
      {/* Navbar Principal */}
      <motion.header
        className={`transition-all duration-500 ${sticky || !isHome ? "bg-[#5b7898]" : "bg-transparent"} ${
          !isHome ? "top-0" : "top-0"
        } w-full px-5 md:px-10 lg:px-16 h-16 md:h-20 lg:h-24 flex items-center fixed left-0 right-0 ${sticky ? "shadow-lg" : ""}`}
      >
        {/* Logo */}
        <div className='w-1/4'>
          <img src={logo} alt='Logo' className='h-12 md:h-20 lg:h-20 xl:h-20' />
        </div>

        {/* Menú Desktop */}
        <nav className='hidden md:flex items-center justify-center w-2/4'>
          <div className='flex items-center space-x-8 text-base'>
            <span
              onClick={() => {
                location.pathname !== "/" ? handleNavigate("/") : handleScrollTo(refs.homeRef);
              }}
              className='cursor-pointer text-white hover:text-gray-400 transition duration-500'
            >
              Inicio
            </span>
            <span
              onClick={() => {
                if (location.pathname !== "/") {
                  handleNavigate("/");
                  setTimeout(() => handleScrollTo(refs.WhatIsFidelidapp), 500);
                } else {
                  handleScrollTo(refs.WhatIsFidelidapp);
                }
              }}
              className='cursor-pointer text-white hover:text-gray-400 transition duration-200'
            >
              Cómo funciona
            </span>

            <span
              onClick={() => {
                if (location.pathname !== "/") {
                  handleNavigate("/");
                  setTimeout(() => handleScrollTo(refs.plansRef), 500);
                } else {
                  handleScrollTo(refs.plansRef);
                }
              }}
              className='cursor-pointer text-white hover:text-gray-400 transition duration-200'
            >
              Planes
            </span>
            <span
              onClick={() => {
                handleNavigate("/services");
              }}
              className='cursor-pointer text-white hover:text-gray-400 transition duration-200'
            >
              Servicios
            </span>
            <div className='relative'>
              <span
                onClick={() => setShowFeatures(!showFeatures)}
                className='cursor-pointer text-white hover:text-gray-400 transition duration-200 flex items-center gap-1'
              >
                Características
                <svg className={`w-4 h-4 transition-transform ${showFeatures ? "rotate-180" : ""}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                </svg>
              </span>
              {showFeatures && (
                <div className='absolute left-0 mt-2 w-72 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5' onClick={(e) => e.stopPropagation()}>
                  <div className='py-1'>
                    {featuresItems.map((feature) => (
                      <a
                        key={feature}
                        href={`/features#${formatFeatureUrl(feature)}`}
                        className='block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100'
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavigate(`/features#${formatFeatureUrl(feature)}`);
                          setShowFeatures(false);
                        }}
                      >
                        {feature}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <span
              onClick={() => {
                if (location.pathname !== "/") {
                  handleNavigate("/");
                  setTimeout(() => handleScrollTo(refs.contactRef), 500);
                } else {
                  handleScrollTo(refs.contactRef);
                }
              }}
              className='cursor-pointer text-white hover:text-gray-400 transition duration-200'
            >
              Contacto
            </span>
          </div>
        </nav>

        {/* Botones de autenticación */}
        <div className='hidden md:flex justify-end w-1/4'>
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
            <div className='space-x-4'>
              <span
                onClick={() => handleNavigate("/auth/login#login", { state: { showRegister: false } })}
                className={`${
                  isAuth.login || isAuth.register ? "hidden" : ""
                } cursor-pointer text-white hover:text-gray-400 transition duration-200 cursor-pointer`}
              >
                Iniciar Sesión
              </span>
              <span
                onClick={() => handleNavigate("/auth/login", { state: { showRegister: true } })}
                className={`${
                  isAuth.login || isAuth.register ? "hidden" : ""
                } bg-main p-4 rounded-md cursor-pointer text-white transition duration-700 hover:bg-white hover:text-main transform hover:scale-110`}
              >
                Registrate
              </span>
            </div>
          )}
        </div>

        {/* Icono de menú móvil */}
        <div className='flex md:hidden bg-transparent ml-auto'>
          <MdOutlineMenu onClick={handleMenuToggle} size={42} className='text-white bg-transparent' />
        </div>
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
          <div className='bg-white w-64 h-full shadow-lg z-50 flex flex-col justify-between' onClick={(e) => e.stopPropagation()}>
            <div className='p-4'>
              <div className='flex flex-col space-y-4 mt-4'>
                <span
                  onClick={() => {
                    location.pathname !== "/" ? handleNavigate("/") : handleScrollTo(refs.homeRef);
                  }}
                  className='text-black hover:text-gray-500 cursor-pointer hover:bg-main/50 p-2 rounded-md'
                >
                  Inicio
                </span>
                <span
                  onClick={() => {
                    handleMenuToggle();
                    handleScrollTo(refs.WhatIsFidelidapp);
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
                    handleNavigate("/services");
                  }}
                  className='text-black hover:text-gray-500 cursor-pointer hover:bg-main/50 p-2 rounded-md'
                >
                  Servicios
                </span>
                <div className='flex flex-col'>
                  <span
                    onClick={() => setShowFeatures(!showFeatures)}
                    className='text-black hover:text-gray-500 cursor-pointer hover:bg-main/50 p-2 rounded-md flex items-center justify-between'
                  >
                    Características
                    <svg className={`w-4 h-4 transition-transform ${showFeatures ? "rotate-180" : ""}`} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                    </svg>
                  </span>
                  {showFeatures && (
                    <div className='ml-4'>
                      {featuresItems.map((feature) => (
                        <span
                          key={feature}
                          onClick={() => {
                            handleMenuToggle();
                            handleNavigate(`/features#${formatFeatureUrl(feature)}`);
                          }}
                          className='block text-black hover:text-gray-500 cursor-pointer hover:bg-main/50 p-2 rounded-md'
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <span
                  onClick={() => {
                    if (location.pathname === "/") {
                      handleMenuToggle();
                      handleScrollTo(refs.contactRef);
                    } else {
                      handleMenuToggle();
                      handleNavigate("/");
                      setTimeout(() => handleScrollTo(refs.contactRef), 500);
                    }
                  }}
                  className='text-black hover:text-gray-500 cursor-pointer hover:bg-main/50 p-2 rounded-md'
                >
                  Contacto
                </span>
              </div>
            </div>

            {/* Barra divisoria y botones de autenticación */}
            <div className='mt-auto'>
              <hr className='border-gray-200 my-4' />
              <div className='p-4 space-y-4'>
                {user ? (
                  <>
                    <span
                      onClick={() => {
                        handleMenuToggle();
                        handleNavigate("/dashboard");
                      }}
                      className='text-black hover:text-gray-500 cursor-pointer hover:bg-main/50 p-2 rounded-md block'
                    >
                      Dashboard
                    </span>
                    <span onClick={startLoggingOut} className='text-red-700 hover:text-gray-500 cursor-pointer hover:bg-main/50 p-2 rounded-md block'>
                      Salir
                    </span>
                  </>
                ) : (
                  <>
                    <span
                      onClick={() => {
                        handleMenuToggle();
                        handleNavigate("/auth/login", { state: { showRegister: false } });
                      }}
                      className='text-black hover:text-gray-500 cursor-pointer hover:bg-main/50 p-2 rounded-md block'
                    >
                      Iniciar Sesión
                    </span>
                    <span
                      onClick={() => {
                        handleMenuToggle();
                        handleNavigate("/auth/login#login", { state: { showRegister: true } });
                      }}
                      className='text-black hover:text-gray-500 cursor-pointer hover:bg-main/50 p-2 rounded-md block'
                    >
                      Registrate
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
