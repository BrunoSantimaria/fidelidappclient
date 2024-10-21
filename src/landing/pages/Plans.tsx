import { useState } from "react";
import { planList } from "../../data/plans";
import { ModalLanding } from "../components/ModalLanding";
import LockOpenIcon from "@mui/icons-material/LockOpen";
export const Plans = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div className='mt-16    md:px-0 md:mb-16'>
      <h3 className='text-3xl md:text-5xl font-bold text-center mb-16'>Planes</h3>
      <div className='flex flex-col sm:flex-row justify-center space-y-6 md:space-y-0 md:mx-16 md:space-x-28'>
        {planList.map((plan, index) => (
          <div
            key={index}
            className='bg-white rounded-lg  border border-gray-600/40 shadow-lg p-6 flex flex-col m-auto md:m-0 justify-center md:justify-between w-5/6 md:w-full max-w-lg transition-transform transform hover:scale-105'
          >
            <div>
              {/* Tipo de Plan */}
              <h5 className='text-xl font-bold text-center mb-2'>{plan.type}</h5>
              <h6 className={`${plan.price ? "" : "hidden"} text-lg text-gray-500 text-center mb-4`}>${plan.price} CLP/MES</h6>

              <ul className='space-y-5 mb-4'>
                {plan.description.map((item, idx) => (
                  <li key={idx} className='flex items-center'>
                    <div className='text-main mr-2'>
                      {" "}
                      <LockOpenIcon />
                    </div>

                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {plan.button && (
              <button
                className='mt-4 w-full py-2 bg-main text-white font-semibold rounded-lg hover:bg-[#4a6377] transition-colors duration-300'
                onClick={handleOpen}
              >
                {plan.button}
              </button>
            )}
          </div>
        ))}
      </div>
      <ModalLanding open={open} handleClose={handleClose} />
    </div>
  );
};

export default Plans;
