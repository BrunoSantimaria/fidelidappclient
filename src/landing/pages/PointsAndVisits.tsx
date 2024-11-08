import React from "react";
import { motion, useInView } from "framer-motion";
import { Divider } from "@mui/material";
import { useNavigateTo } from "../../hooks/useNavigateTo";

export const PointsAndVisits = () => {
  const containerRef = React.useRef(null);
  const isInView = useInView(containerRef, { once: false });
  const { handleNavigate } = useNavigateTo();
  const imageUrl = "https://res.cloudinary.com/di92lsbym/image/upload/v1731076385/ozo2cn9nqjypxofkljf4.png";

  return (
    <div>
      <Divider className='w-[70%] md:w-[50%] opacity-20 my-16 m-auto' />
      <div ref={containerRef} className='flex flex-col md:flex-row md:mt-10 px-6 md:w-[80%] md:justify-center md:m-auto'>
        {/* Sección de la imagen a la derecha */}
        <motion.div
          className='text-center order-2 md:order-1 md:w-1/2'
          initial={{ x: 200, opacity: 0 }}
          animate={isInView ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <img src={imageUrl} alt='Sistema de Fidelización' className='w-[900px] h-auto mx-auto' />
          <p className='mt-0 font-semibold text-gray-700'>
            ¡Adapta tus promociones y recompensas según las necesidades de tu negocio para motivar a tus clientes a regresar!
          </p>
        </motion.div>

        {/* Sección de texto a la izquierda */}
        <motion.div
          className='mt-10 md:mt-36 md:w-1/2 order-1 md:order-2'
          initial={{ x: -200, opacity: 0 }}
          animate={isInView ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className='text-center text-3xl font-bold mb-6'>Tu negocio, tu sistema: canjea por puntos o visitas 🌟</div>
          <div className='w-full justify-center m-auto text-center text-lg text-gray-700'>
            Con nuestro sistema flexible, elige la opción que mejor se adapte a tu negocio: canjea promociones según visitas o acumula puntos para recompensas.
            <p className='underline underline-offset-4'>¡Haz que cada visita o cada compra cuente y construye relaciones duraderas!</p>
          </div>
          <motion.div
            className='w-full mt-6 justify-center m-auto text-center text-lg text-gray-700'
            initial={{ x: -200, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <span className='font-bold'>Regístrate</span> y comienza a premiar a tus clientes de manera única:
          </motion.div>
          <motion.div
            className='justify-center w-2/3 m-auto text-center p-2 mt-6 mb-6 md:mb-0 bg-main rounded-md text-white cursor-pointer'
            initial={{ x: -200, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 1.2 }}
            onClick={() => handleNavigate("/auth/login")}
          >
            Regístrate ahora para empezar
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
