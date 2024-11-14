import React from "react";

import { Stats, TablePromotions, Welcome } from "../components";
import { TableAgenda } from "./Agenda/TableAgenda";
import { motion } from "framer-motion";
const pageTransition = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export const Dashboard = () => {
  return (
    <motion.main initial='hidden' animate='visible' exit='hidden' variants={pageTransition} className='w-full h-full flex flex-row relative'>
      <section className='flex flex-col p-10 ml-0 md:ml-20 lg:ml-20 w-full gap-5'>
        <Welcome />
        <Stats />
        <TablePromotions />
        <TableAgenda />
      </section>
    </motion.main>
  );
};
