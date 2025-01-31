import { useRef, useState } from "react";
import { planList } from "../../../../data/plans";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";
import { ModalLanding } from "@/landing/components/ModalLanding";

export const Plans = ({ refs }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleNavigate = (path: string, options?: any) => navigate(path, options);

  return (
    <div className='container mx-auto py-16 px-4 ' ref={refs.plansRef}>
      <div className='text-center mb-12'>
        <h2 className='text-3xl font-bold text-[#5b7898] mb-4'>Planes y Precios</h2>
        <p className='text-gray-600'>Elige el plan que mejor se adapte a las necesidades de tu negocio</p>
      </div>

      <div className='grid md:grid-cols-3 gap-8'>
        {planList.map((plan, index) => (
          <div
            key={index}
            className={`relative bg-white rounded-lg border ${
              plan.type === "Premium" ? "border-[#5b7898] shadow-lg scale-105" : "border-gray-200"
            } transition-all duration-300 hover:shadow-xl`}
          >
            {plan.type === "Premium" && (
              <div className='absolute -top-4 left-1/2 -translate-x-1/2'>
                <span className='bg-[#5b7898] text-white px-3 py-1 rounded-full text-sm'>Más Popular</span>
              </div>
            )}

            <div className='p-6'>
              <div className='mb-8'>
                <h3 className='text-2xl font-bold text-[#5b7898] mb-2'>{plan.type}</h3>
                {plan.price !== undefined && (
                  <div className='flex items-baseline mb-2'>
                    <span className='text-3xl font-bold'>CLP ${plan.price}</span>
                    <span className='ml-1 text-gray-600'>/MES</span>
                  </div>
                )}
                <p className='text-sm text-gray-600'>{plan.subtitle}</p>
              </div>

              <ul className='space-y-4 mb-8'>
                {plan.description.map((feature, i) => (
                  <li key={i} className='flex items-start gap-2'>
                    <div className='flex-shrink-0 text-[#5b7898] mt-1'>
                      <LockOpenIcon className='h-5 w-5' />
                    </div>
                    <span className='text-sm'>{feature}</span>
                    {feature.includes("Email marketing") && (
                      <Tooltip title='Envía campañas de email marketing personalizadas a tu base de clientes'>
                        <HelpOutlineIcon className='h-4 w-4 text-gray-400 cursor-help' />
                      </Tooltip>
                    )}
                  </li>
                ))}
              </ul>

              {plan.button && (
                <button
                  className='w-full py-2 px-4 bg-[#5b7898] text-white rounded-lg font-semibold hover:bg-[#4a6277] transition-colors duration-300'
                  onClick={plan.type === "Gratis" ? () => handleNavigate("/auth/login", { state: { showRegister: true } }) : handleOpen}
                >
                  {plan.button}
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <ModalLanding open={open} handleClose={handleClose} />
    </div>
  );
};

export default Plans;
