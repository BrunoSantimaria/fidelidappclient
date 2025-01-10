import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';




export const LandingNotFound = () => {
  return (
    <motion.div
    initial={{ opacity: 0, y: -50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className='min-h-screen bg-gradient-to-tr from-slate-400 to-slate-700 py-12 px-4 sm:px-6 lg:px-8 text-white flex flex-col justify-center items-center'
  >
    <div className='max-w-md w-full space-y-8 text-center'>
      <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
        <h1 className='text-5xl font-bold text-white mb-2'>Oops!</h1>
        <p className='mt-2 text-xl text-gray-300'>Cuenta no encontrada</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
        <p className='mt-4 text-lg text-gray-300'>Lo sentimos, pero no pudimos encontrar la cuenta que estás buscando.</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.6 }}>
        <Button
          onClick={() => (window.location.href = "/")}
          className='mt-8 bg-[#3a3b40] p-6 hover:bg-[#4a4b50] text-white font-bold transition-colors duration-300 w-full'
        >
          Volver a la página principal
        </Button>
      </motion.div>
    </div>
  </motion.div>

  )
};

