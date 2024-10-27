import { Button, Input } from "@mui/material";
import { useState } from "react";

export const Billing = () => {
  const [receiveInvoice, setReceiveInvoice] = useState(false);
  const [companyName, setCompanyName] = useState("");
  const [rut, setRut] = useState("");

  return (
    <div className='w-[95%] m-auto md:ml-20'>
      <h2 className='text-2xl font-bold mb-4'>Sección de facturación.</h2>

      <div className='flex items-center mb-4'>
        <Input type='checkbox' id='receiveInvoice' checked={!receiveInvoice} onChange={() => setReceiveInvoice(!receiveInvoice)} className='mr-2' />
        <label htmlFor='receiveInvoice'>Quiero recibir factura</label>
      </div>

      {/* Mostrar los inputs solo si el checkbox está activado */}
      {receiveInvoice && (
        <div className='flex flex-col space-y-6'>
          <div>
            <label className='block'>Razón Social</label>
            <Input placeholder='' type='text' className='w-full border rounded p-2' value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          </div>
          <div>
            <label className='block'>RUT</label>
            <Input type='text' className='w-full border rounded p-2' value={rut} onChange={(e) => setRut(e.target.value)} />
          </div>
        </div>
      )}

      {/* Botones de Guardar y Cancelar */}
      <div className='flex gap-4 mt-4'>
        <Button
          variant='contained'
          className='bg-blue-500 text-white p-2 rounded'
          disabled={!companyName.trim() || !rut.trim()}
          onClick={() => {
            // Aquí puedes manejar la lógica para guardar los datos
            console.log("Datos guardados:", { companyName, rut });
          }}
        >
          Guardar Cambios
        </Button>
        <Button
          variant='outlined'
          className='text-gray-500 p-2 rounded'
          onClick={() => {
            // Reiniciar campos si se cancela
            setCompanyName("");
            setRut("");
            setReceiveInvoice(false);
          }}
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
};
