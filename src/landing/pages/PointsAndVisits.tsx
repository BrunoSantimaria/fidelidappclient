import React from "react";
import { motion, useInView } from "framer-motion";
import { Divider } from "@mui/material";
import { useNavigateTo } from "../../hooks/useNavigateTo";

export const PointsAndVisits = () => {
  const containerRef = React.useRef(null);
  const isInView = useInView(containerRef, { once: true });
  const { handleNavigate } = useNavigateTo();

  const imageUrl = "https://res.cloudinary.com/di92lsbym/image/upload/q_auto,f_auto/v1731076385/ozo2cn9nqjypxofkljf4.webp";

  const textContent = {
    title: "Tu negocio, tu sistema: canjea por puntos o visitas 🌟",
    description: `
      Con nuestro sistema flexible, elige la opción que mejor se adapte a tu negocio: 
      canjea promociones según visitas o acumula puntos para recompensas. 
      ¡Haz que cada visita o compra cuente y construye relaciones duraderas!
    `,
    subDescription: "Regístrate y comienza a premiar a tus clientes de manera única:",
    cta: "Regístrate ahora para empezar",
    imageCaption: "Sistema de fidelización de clientes con puntos y recompensas personalizables.",
  };

  return (
    <>
      {/* Metadatos para SEO */}
      <script type='application/ld+json'>
        {`
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Sistema de Fidelización de Clientes",
          "description": "Plataforma flexible para negocios que permite canjear puntos o visitas por recompensas, diseñada para aumentar la lealtad de tus clientes.",
          "image": "${imageUrl}",
          "url": "https://fidelidapp.cl",
          "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": "https://fidelidapp.cl"
          }
        }
        `}
      </script>

      <section ref={containerRef}>
        <Divider className='w-[70%] md:w-[50%] opacity-20 my-16 mx-auto' />
        <div className='flex flex-col md:flex-row md:mt-10 px-6 md:w-[80%] md:justify-center md:m-auto'>
          {/* Imagen con texto alternativo enriquecido */}
          <motion.div
            className='text-center order-2 md:order-1 md:w-1/2'
            initial={{ opacity: 0, x: 200 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <img src={imageUrl} alt={textContent.imageCaption} loading='lazy' className='w-[900px] h-auto mx-auto' />
            <p className='mt-0 font-semibold text-gray-700'>{textContent.imageCaption}</p>
          </motion.div>

          {/* Contenido semántico */}
          <motion.div
            className='mt-10 md:mt-36 md:w-1/2 order-1 md:order-2'
            initial={{ opacity: 0, x: -200 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <h1 className='text-center text-3xl font-bold mb-6'>{textContent.title}</h1>
            <p className='w-full text-center text-lg text-gray-700 mx-auto mb-4'>{textContent.description}</p>
            <p className='underline underline-offset-4 text-lg text-center'>{textContent.subDescription}</p>

            <motion.div
              className='flex justify-center items-center mt-6 mb-6 md:mb-0'
              initial={{ opacity: 0, x: -200 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <button
                className='px-6 py-3 bg-main text-white font-semibold rounded-md shadow-lg hover:bg-main-dark cursor-pointer'
                onClick={() => handleNavigate("/auth/login")}
              >
                {textContent.cta}
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
};
