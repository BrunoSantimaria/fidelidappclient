import { motion } from "framer-motion";

export const PromotionInfo = () => {
  const pageTransition = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };
  return (
    <motion.div initial='hidden' animate='visible' exit='hidden' variants={pageTransition} className='p-6 bg-white mt-6 h-fit   animate__fadeInLeft'>
      <h2 className='text-2xl font-bold text-main mb-4'>Cómo crear una promoción</h2>
      <p className='mb-4 text-gray-700'>
        Bienvenido al sistema de promociones. Aquí puedes configurar promociones personalizadas para tus clientes y elegir entre dos tipos de sistemas:
      </p>
      <ul className='list-disc list-inside text-gray-700 space-y-2'>
        <li>
          <strong className='text-main'>Promociones Únicas:</strong> Ideal para motivar visitas de tus clientes. Define un beneficio para que tus clientes lo obtengan mediante canjes.
        </li>
        <li>
          <strong className='text-main'>Sistema de Puntos:</strong> Perfecto para un programa de acumulación. El cliente acumula puntos hasta alcanzar el total
          necesario para obtener diversos premios.
        </li>
      </ul>
      <p className='mt-4 text-gray-700'>Selecciona un tipo y configura los detalles en los siguientes pasos.</p>
    </motion.div>
  );
};
