import { Button, Input } from "@mui/material";

export const AccountSettings = () => {
  return (
    <div className='w-[95%] m-auto md:ml-20'>
      <h2 className='text-2xl font-bold mb-4'>Ajustes de cuenta</h2>

      <div className='flex flex-col space-y-6 '>
        <div>
          <label className='block'>Nombre de usuario</label>
          <Input type='text' className='w-full border rounded p-2' value='FidelidApp' />
        </div>

        <div>
          <label className='block'>Email</label>
          <Input type='email' className='w-full border rounded p-2' value='contacto@fidelidapp.cl' />
        </div>
        <div>
          <label className='block'>Télefono</label>
          <Input type='text' className='w-full border rounded p-2' value='+380990760179' />
        </div>
      </div>
      <div className='flex gap-4 mt-4'>
        <Button variant='contained' className='bg-blue-500 text-white p-2 rounded'>
          Guardar cambios
        </Button>
        <Button className='text-gray-500 p-2 rounded'>Cancelar</Button>
      </div>
    </div>
  );
};
