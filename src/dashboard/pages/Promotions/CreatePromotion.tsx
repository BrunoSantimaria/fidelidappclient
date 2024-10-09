import React from "react";
import { motion } from "framer-motion";
import { Divider } from "@mui/material";
import { PromotionForm } from "../../components/PromotionForm";

const pageTransition = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export const CreatePromotion = () => {
  return (
    <motion.main initial='hidden' animate='visible' exit='hidden' variants={pageTransition} className='w-full h-full flex flex-row relative'>
      <section className='flex flex-col p-10 ml-0 md:ml-20 lg:ml-20 w-full gap-5   space-y-4    rounded-md m-0 text-left  '>
        <section className='flex flex-col   shadow-md shadow-neutral-200 bg-gradient-to-br from-gray-100 to-main/30 space-y-4 p-6 rounded-md m-0 text-left  w-full '>
          <div className='text-2xl font-bold'>Define los datos del programa</div>

          <div>
            En esta sección, podrás:
            <ul className='list-disc ml-5'>
              <li>
                Definir el título de la promoción. <strong>¡Recuerda poner un título llamativo!</strong>
              </li>
              <li>
                Descripción de lo que obtendría el cliente. <strong>¡Sé claro y convincente!</strong>
              </li>
              <li>
                Tipo de beneficio y automatizar la promoción. <strong>Asegúrate de que sea atractivo para los clientes.</strong>
              </li>
              <li>
                Condiciones de la promoción. <strong>Especifica claramente los requisitos y limitaciones.</strong>
              </li>
            </ul>
          </div>
        </section>
        <Divider />
        <PromotionForm />
      </section>
    </motion.main>
  );
};
