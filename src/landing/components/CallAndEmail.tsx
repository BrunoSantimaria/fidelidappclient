import { FaPhone, FaEnvelope } from "react-icons/fa";

export const CallAndEmail = () => {
  const contactInfo = {
    phone: "56996706983",
    email: "contacto@fidelidapp.cl",
  };

  return (
    <div className='w-screen flex flex-col items-center bg-main p-12 mt-20'>
      <div className='uppercase font-bold text-white text-lg md:text-xl mb-4'>Conozcámonos de cerca</div>
      <div className='flex  space-x-4'>
        <a
          href={`tel:+${contactInfo.phone}`}
          className='flex items-center space-x-2 bg-white appearance-none text-main font-main uppercase md:px-6 md:py-4 px-4 py-2 rounded shadow-md hover:bg-gray-100 transition no-underline'
          id='call-us'
        >
          <span>Llámanos</span>
          <FaPhone />
        </a>
        <a
          href={`mailto:${contactInfo.email}`}
          className='flex items-center space-x-2 appearance-none bg-white text-main font-main uppercase px-4 py-2 rounded shadow-md hover:bg-gray-100 transition no-underline'
        >
          <span>Mándanos un correo</span>
          <FaEnvelope className='w-20 md:w-auto' />
        </a>
      </div>
    </div>
  );
};
