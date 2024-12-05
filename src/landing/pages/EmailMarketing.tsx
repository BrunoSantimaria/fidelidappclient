import React from "react";
import { motion, useInView } from "framer-motion"; // Importamos Framer Motion y useInView

import { useNavigateTo } from "../../hooks/useNavigateTo";

export const EmailMarketing = () => {
  const containerRef = React.useRef(null);
  const isInView = useInView(containerRef, { once: false });
  const { handleNavigate } = useNavigateTo();
  return (
    <div>
      <div className='w-[70%] md:w-[50%] border-[0.5px] opacity-20 my-16 border-black flex justify-center m-auto bg-black ' />
      <div ref={containerRef} className='flex  flex-col md:flex-row md:mt-10 px-6 md:w-[80%] md:justify-center md:m-auto'>
        {/* Sección de la imagen a la derecha */}

        <motion.div
          className='text-center order-2 md:order-1 md:w-1/2'
          initial={{ x: 200, opacity: 0 }}
          animate={isInView ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8 }}
        >
          <img
            src='https://res.cloudinary.com/di92lsbym/image/upload/f_webp/q_auto/v1733268444/FidelidApp/Assets/emailmarketing_kfwq53.png'
            alt='Email Marketing FidelidApp'
            className='w-[900px] h-auto mx-auto'
          />
          <p className='mt-0 font-semibold text-gray-700'>
            ¡Gestiona tus clientes y envíales campañas de email marketing para mantenerlos al tanto de tus últimas promociones y novedades!
          </p>
        </motion.div>

        {/* Sección de texto a la izquierda */}
        <motion.div
          className='mt-10 md:mt-36 md:w-1/2 order-1 md:order-2'
          initial={{ x: -200, opacity: 0 }}
          animate={isInView ? { x: 0, opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className='text-center text-3xl font-bold mb-6'>¡Mantén a tus clientes informados! 📧</div>
          <div className='w-full justify-center m-auto text-center text-lg text-gray-700'>
            Con nuestras herramientas de email marketing, podrás comunicarte directamente con tus clientes. Informa sobre eventos, ofertas exclusivas, y
            novedades que los harán sentirse valorados y conectados con tu marca.
            <p className='underline underline-offset-4'>¡Haz que cada mensaje cuente y fideliza a tus clientes de manera efectiva!</p>
          </div>
          <motion.div
            className='w-full mt-6 justify-center m-auto text-center text-lg text-gray-700'
            initial={{ x: -200, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <span className='font-bold'>Empieza a crear tus campañas</span> y descubre cómo puedes impactar a tus clientes:
          </motion.div>
          <motion.div
            className='justify-center w-2/3 m-auto text-center p-2 mt-6 mb-6 md:mb-0 bg-main rounded-md text-white cursor-pointer'
            initial={{ x: -200, opacity: 0 }}
            animate={isInView ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 1.2 }}
            onClick={() => handleNavigate("/auth/login", { state: { showRegister: true } })}
          >
            Registrate ahora para empezar
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
