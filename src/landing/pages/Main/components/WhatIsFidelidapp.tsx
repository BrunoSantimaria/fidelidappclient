import { motion } from "framer-motion";
import { Box } from "@mui/material";
import { useRef } from "react";

export const WhatIsFidelidapp = ({ refs }) => {
  return (
    <Box
    component='section'
    ref={refs}
    sx={{
      
      background: "white",
      overflow: "hidden",
      position: "relative", // Añade position relative
      zIndex: 1, // Asegúrate de que el contenido esté por encima del fondo
    }}
  >
   {/* Fondo */}
   <div
        className='absolute top-0 left-0 w-full h-full -z-10'
        style={{
          backgroundImage: `linear-gradient(to bottom, 
            rgba(255,255,255,0) 0%,
            rgba(255,255,255,0) 80%,
            rgba(255,255,255,1) 100%
          ), url('https://res.cloudinary.com/di92lsbym/image/upload/v1738005770/fondo_candado_2_kvvnkr.png')`,
          backgroundRepeat: "repeat",
          backgroundSize: "700px",
          opacity: 0.16,
          zIndex: -1, // Asegúrate de que el fondo esté detrás del contenido
        }}
      />

      {/* Contenido */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col lg:flex-row lg:items-center lg:justify-between lg:gap-12"
      >
        {/* Bloque de Texto */}
        <div className="lg:w-1/2">
          <motion.h2
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-main font-semibold tracking-wide uppercase"
          >
            ¿Qué es Fidelidapp?
          </motion.h2>

          <motion.h3
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className='mt-2 text-4xl md:text-5xl leading-[1.2] font-bold tracking-tight text-main'
          >
            Convierte clientes en fans de tu negocio
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-4 text-lg text-gray-600 max-w-xl"
          >
            Fidelidapp es una plataforma todo-en-uno diseñada para ayudar a pequeñas y medianas empresas a crear, gestionar y analizar programas de
            fidelización de clientes de manera eficiente y efectiva.
            <br /><br />
            Te permite implementar sistemas de puntos, promociones y automatización para fortalecer la lealtad de tus clientes y mejorar
            tus ventas.
          </motion.p>
        </div>

        {/* Imagen animada */}
        <motion.div
          className="lg:w-1/2 mt-10 lg:mt-0"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.8,
            delay: 0.8,
            type: "spring",
            bounce: 0.3,
          }}
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            y: {
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            },
            default: {
              duration: 0.8,
              delay: 0.8,
              type: "spring",
              bounce: 0.3,
            },
          }}
        >
          <img
            className='w-full h-auto '
            src="https://res.cloudinary.com/di92lsbym/image/upload/f_auto,q_auto/fidelizacion-clientes-fidelidapp"
            alt="Fidelización de clientes Fidelidapp"
          />
        </motion.div>
      </motion.div>
    </ Box>
  );
};
