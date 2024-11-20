import { PlusOne } from "@mui/icons-material";
import { FaPlus } from "react-icons/fa6";

export const QuickActions = ({ handleNavigate }) => {
  return (
    <div className='bg-white rounded-lg border border-t-4 border-black/20 border-t-[#5b7898] p-6'>
      <h2 className='text-xl font-bold text-[#5b7898]'>Acciones Rápidas</h2>
      <p className='text-gray-600 text-sm mt-1'>Gestiona tus programas de fidelización</p>

      <div className='space-y-4 mt-4'>
        <button
          onClick={() => handleNavigate("/dashboard/promotions/create")}
          className='w-full flex items-center gap-2 bg-[#5b7898] hover:bg-[#4a6277] text-white px-4 py-2 rounded-lg transition-colors'
        >
          <FaPlus className='w-4 h-4' />
          Crear nuevo programa de fidelización
        </button>
        <button
          onClick={() => handleNavigate("/dashboard/clients/list")}
          className='w-full flex items-center gap-2 bg-[#5b7898] hover:bg-[#4a6277] text-white px-4 py-2 rounded-lg transition-colors'
        >
          <FaPlus className='w-4 h-4' />
          Agregar nuevo cliente
        </button>
        <button
          onClick={() => handleNavigate("/dashboard/email-sender")}
          className='w-full flex items-center gap-2 bg-[#5b7898] hover:bg-[#4a6277] text-white px-4 py-2 rounded-lg transition-colors'
        >
          <FaPlus className='w-4 h-4' />
          Email Marketing
        </button>
        {/* Agregar más botones según necesites */}
      </div>
    </div>
  );
};
