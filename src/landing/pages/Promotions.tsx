import React, { useState } from "react";
import { motion, useInView } from "framer-motion";
import promotion1 from "../../assets/promotions.png";
import { Divider } from "@mui/material";

export const Promotions = () => {
  // Referencia y configuración para detectar si el contenedor está en vista
  const containerRef = React.useRef(null);
  const isInView = useInView(containerRef, { once: false });

  // Estado para manejar la visibilidad de la promoción
  const [isPromotionOpen, setIsPromotionOpen] = useState(false);

  // Función para alternar la promoción abierta/cerrada
  const togglePromotion = () => {
    setIsPromotionOpen((prev) => !prev);
  };

  // Animación común para los elementos cuando entran en vista
  const animationProps = {
    initial: { opacity: 0, x: 200 },
    animate: isInView ? { opacity: 1, x: 0 } : {},
    transition: { duration: 0.8 },
  };

  return (
    <div>
      <div ref={containerRef} className='flex flex-col md:flex-row-reverse md:mt-20 px-6 md:w-[80%] md:justify-center md:m-auto'>
        {/* Si la promoción no está abierta, mostramos la imagen y el texto */}
        {!isPromotionOpen && (
          <>
            <motion.div className='text-center order-2 md:order-1 md:w-1/2' {...animationProps}>
              <img src={promotion1} alt='Promociones activas' className='w-[800px] h-auto mx-auto' />
              <p className='mt-4 font-semibold text-gray-700'>¡Diseña, comparte y fideliza a tus clientes con nuestras herramientas de promociones activas!</p>
            </motion.div>

            {/* Sección de texto a la izquierda */}
            <motion.div
              className='mt-10 md:mt-36 md:w-1/2 order-1 md:order-2'
              {...{
                ...animationProps,
                transition: { ...animationProps.transition, delay: 0.4 },
              }}
            >
              <div className='text-center text-3xl font-bold mb-6'>¡Convierte a tus clientes en clientes fieles! 🔓</div>
              <div className='w-full justify-center m-auto text-center text-lg text-gray-700'>
                Con nuestras promociones activas, conecta con tus clientes de una manera única. Ofrece recompensas, descuentos exclusivos y beneficios
                especiales que aumenten su compromiso y los hagan volver una y otra vez.
                <p className='underline underline-offset-4'>¡Haz que cada visita cuente y construye relaciones duraderas!</p>
              </div>

              <motion.div
                className='w-full  mt-6 justify-center m-auto text-center text-lg text-gray-700'
                {...{
                  ...animationProps,
                  transition: { ...animationProps.transition, delay: 0.8 },
                }}
              >
                <span className='font-bold'>Regístrate</span> en nuestra promoción, te llevarás un descuento:
              </motion.div>

              <motion.div
                onClick={togglePromotion} // Alternar la promoción al hacer clic
                className=' justify-center w-2/3 m-auto text-center transform transition duration-300 hover:scale-105 p-2 mt-6 bg-main rounded-md text-white cursor-pointer'
                {...{
                  ...animationProps,
                  transition: { ...animationProps.transition, delay: 1.2 },
                }}
              >
                Mira como funciona{" "}
              </motion.div>
            </motion.div>
          </>
        )}

        {/* Si la promoción está abierta, mostramos el iframe con la promoción */}
        {isPromotionOpen && (
          <div className='w-full flex flex-col justify-center  mt-8'>
            <iframe
              src='https://www.fidelidapp.cl/promotion/672b9d62dc9c051bc3c313ef'
              title='Promoción FidelidApp'
              width='100%'
              height='800'
              style={{ border: "none" }}
            />
            <span
              onClick={togglePromotion}
              className='p-2 mt-2 flex justify-center m-auto w-full rounded-md hover:bg-main/70 bg-main duration-700 text-white cursor-pointer mx-0 text-center'
            >
              Cerrar ventana.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
