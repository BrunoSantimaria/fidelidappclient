import React from "react";
import Logo from "../assets/LOGO-SIN-FONDO.png";
import { useLocation } from "react-router-dom";
import { Mail, MapPin, Phone, Facebook, Instagram, Linkedin } from "lucide-react";
import { useNavigateTo } from "../hooks/useNavigateTo";
import { handleScrollTo } from "@/utils/handleScrollTo";

export const Footer = ({ refs }) => {
  console.log(refs.WhatIsFidelidapp);
  const location = useLocation();
  const { handleNavigate } = useNavigateTo();
  const allowedRoutes = ["/", "/auth/login", "/features", "/services"];

  const handleSectionClick = (sectionId: string) => {
    if (location.pathname === "/") {
      // Si estamos en home, solo hacemos scroll
      document.querySelector(sectionId)?.scrollIntoView({ behavior: "smooth" });
    } else {
      // Si no estamos en home, navegamos a home con un callback para hacer scroll
      handleNavigate("/", {
        state: { scrollTo: sectionId },
      });
    }
  };

  if (!allowedRoutes.includes(location.pathname)) {
    return null;
  }

  return (
    <footer className='bg-[#5b7898] text-white'>
      <div className='container mx-auto px-4 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          {/* Logo y Descripción */}
          <div className='space-y-4'>
            <img src={Logo} alt='Logo' className='w-40 brightness-0 invert' />
            <p className='text-sm text-slate-200'>Soluciones de fidelización para hacer crecer tu negocio y mantener a tus clientes felices.</p>
          </div>

          {/* Información de Contacto */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Información de Contacto</h3>
            <ul className='space-y-3'>
              <li>
                <a href='mailto:contacto@fidelidapp.cl' className='flex items-center gap-2 text-sm text-slate-200 hover:text-white transition-colors'>
                  <Mail className='h-4 w-4' />
                  contacto@fidelidapp.cl
                </a>
              </li>
              <li>
                <a href='tel:+56996706983' className='flex items-center gap-2 text-sm text-slate-200 hover:text-white transition-colors'>
                  <Phone className='h-4 w-4' />
                  +56996706983
                </a>
              </li>
              <li>
                <div className='flex items-center gap-2 text-sm text-slate-200'>
                  <MapPin className='h-4 w-4' />
                  Santiago, Chile
                </div>
              </li>
            </ul>
          </div>

          {/* Links Importantes */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Links Importantes</h3>
            <ul className='space-y-2'>
              <li>
                <a
                  onClick={() => {
                    location.pathname !== "/" ? handleNavigate("/") : handleScrollTo(refs.homeRef);
                  }}
                  className='text-sm text-slate-200 hover:text-white transition-colors cursor-pointer'
                >
                  Inicio
                </a>
              </li>

              <li>
                <a
                  onClick={() => {
                    if (location.pathname !== "/") {
                      handleNavigate("/");
                      setTimeout(() => handleScrollTo(refs.WhatIsFidelidapp), 500);
                    } else {
                      handleScrollTo(refs.WhatIsFidelidapp);
                    }
                  }}
                  className='text-sm text-slate-200 hover:text-white transition-colors cursor-pointer'
                >
                  Cómo Funciona
                </a>
              </li>
              <li>
                <a
                  onClick={() => {
                    if (location.pathname !== "/") {
                      handleNavigate("/");
                      setTimeout(() => handleScrollTo(refs.WhatIsFidelidapp), 500);
                    } else {
                      handleScrollTo(refs.WhatIsFidelidapp);
                    }
                  }}
                  className='text-sm text-slate-200 hover:text-white transition-colors cursor-pointer'
                >
                  Planes
                </a>
              </li>

              <li>
                <a
                  onClick={() => {
                    if (location.pathname !== "/") {
                      handleNavigate("/");
                      setTimeout(() => handleScrollTo(refs.contactRef), 500);
                    } else {
                      handleScrollTo(refs.contactRef);
                    }
                  }}
                  className='text-sm text-slate-200 hover:text-white transition-colors cursor-pointer'
                >
                  Contacto
                </a>
              </li>

              <li>
                <a
                  onClick={() => handleNavigate("/auth/login#register", { state: { showRegister: true } })}
                  className='text-sm text-slate-200 hover:text-white transition-colors cursor-pointer'
                >
                  Registrarse
                </a>
              </li>
              <li>
                <a onClick={() => handleNavigate("/auth/login#login")} className='text-sm text-slate-200 hover:text-white transition-colors cursor-pointer'>
                  Iniciar Sesión
                </a>
              </li>
            </ul>
          </div>

          {/* Redes Sociales */}
          <div className='space-y-4'>
            <h3 className='text-lg font-semibold'>Síguenos</h3>
            <div className='flex gap-4'>
              <a
                href='https://instagram.com/fidelidapp'
                target='_blank'
                rel='noopener noreferrer'
                className='h-8 w-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors'
              >
                <Instagram className='h-4 w-4 text-white' />
              </a>
              <a
                href='https://www.linkedin.com/company/fidelidappcl/posts/?feedView=all'
                target='_blank'
                rel='noopener noreferrer'
                className='h-8 w-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors'
              >
                <Linkedin className='h-4 w-4 text-white' />
              </a>

              {/* <a
                href='https://facebook.com'
                target='_blank'
                rel='noopener noreferrer'
                className='h-8 w-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors'


            >
              <Facebook className='h-4 w-4 text-white' />
            </a>
             */}
            </div>
          </div>
        </div>

        <div className='border-t border-white/20 mt-8 pt-8'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-200'>
            <p>© {new Date().getFullYear()} FidelidApp. Todos los derechos reservados.</p>
            <div className='flex gap-6'>
              <a href='/privacidad' className='text-white hover:text-white/80 transition-colors'>
                Política de Privacidad
              </a>
              <a href='/terminos' className='text-white hover:text-white/80 transition-colors'>
                Términos y Condiciones
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
