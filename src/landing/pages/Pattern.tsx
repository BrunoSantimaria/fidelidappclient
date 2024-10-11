import { useState } from "react";
import { ModalLanding } from "../components/ModalLanding";
import pattern from "../../assets/fondocandado2.png";
import { Button } from "@mui/material";

export const Pattern = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className='relative min-h-[50vh] mt-20 w-full text-center items-center flex'>
      <div className='absolute inset-0 bg-cover bg-center opacity-10 z-0' style={{ backgroundImage: `url(${pattern})` }}></div>
      <div className='relative z-10 text-left'>
        <div className='my-6 mx-6 md:my-28 lg:my-28 md:ml-16 lg:ml-36'>
          <h3 className='text-2xl md:text-5xl font-bold text-black w-full md:w-2/3 lg:w-4/5'>
            Crea programas de fidelización para tus clientes de manera rápida y sencilla.
          </h3>
          <p className='mt-1 text-sm md:text-2xl text-black w-full md:w-4/5'>Con Fidelidapp te ayudamos a entender y mejorar la experiencia del cliente.</p>
          <Button
            variant='contained'
            onClick={handleOpen}
            className='relative z-10 w-[80vw] md:w-[20vw] min-h-[60px] mt-2 mb-4 md:mb-0 md:mt-2 bg-blue-500 text-white font-semibold py-3 rounded-lg'
          >
            SOLICITA TU DEMO Y CONOCE LOS BENEFICIOS
          </Button>
        </div>
        <ModalLanding open={open} handleClose={handleClose} />
      </div>
    </div>
  );
};
