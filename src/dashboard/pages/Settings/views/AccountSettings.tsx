import { Button, Input } from "@mui/material";
import { motion } from "framer-motion";
import { useAuthSlice } from "../../../../hooks/useAuthSlice";

export const AccountSettings = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  const { user } = useAuthSlice();
  console.log(user);

  return (
    <motion.div initial='hidden' whileInView='visible' variants={fadeIn} transition={{ duration: 0.5 }}>
      <div className='w-[95%] m-auto md:ml-20'>
        <h2 className='text-2xl font-bold mb-4'>Ajustes de cuenta</h2>

        <div className='flex flex-col space-y-6 '>
          <div>
            <label className='block'>Nombre de usuario</label>
            <Input type='text' className='w-full border rounded p-2' value={user?.name || ""} />
          </div>

          <div>
            <label className='block'>Email</label>
            <Input type='email' disabled className='w-full border rounded p-2' value={user?.email || ""} />
          </div>
          <div>
            <label className='block'>Télefono</label>
            <Input type='text' placeholder='Numero de télefono' className='w-full border rounded p-2' value={user?.phone || null} />
          </div>
        </div>
        <div className='flex gap-4 mt-4'>
          <Button variant='contained' className='bg-blue-500 text-white p-2 rounded'>
            Guardar cambios
          </Button>
          <Button className='text-gray-500 p-2 rounded'>Cancelar</Button>
        </div>
      </div>
    </motion.div>
  );
};
