import "animate.css";
import { motion } from "framer-motion";

export const PromotionSystem = ({ setSelectedSystem, selectedSystem }) => {
  const pageTransition = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };
  return (
    <motion.div initial='hidden' animate='visible' exit='hidden' variants={pageTransition} className='p-6  animate__fadeInLeft'>
      <h2 className='text-2xl font-bold text-main mb-4'>Sistema de Promoción</h2>
      <p className='mb-4 text-gray-700'>Selecciona el tipo de sistema para tu promoción:</p>
      <div className='space-y-4'>
        <button
          className={`w-full p-4 border rounded-lg ${selectedSystem === "visits" ? "bg-main text-white" : "bg-white text-main border-main"}`}
          onClick={() => setSelectedSystem("visits")}
        >
          Promoción Única
        </button>
        <button
          className={`w-full p-4 border rounded-lg ${selectedSystem === "points" ? "bg-main text-white" : "bg-white text-main border-main"}`}
          onClick={() => setSelectedSystem("points")}
        >
          Sistema de Puntos
        </button>
      </div>
    </motion.div>
  );
};
