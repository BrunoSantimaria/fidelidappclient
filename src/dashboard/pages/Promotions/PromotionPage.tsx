import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, Typography, Button, Grid, Table, Box, Chip, Tooltip, IconButton } from "@mui/material";
import {
  Add as PlusIcon,
  Inventory as PackageIcon,
  People as UsersIcon,
  CalendarMonth as VisitsIcon,
  Redeem as RewardsIcon,
  HelpOutline as HelpIcon,
} from "@mui/icons-material";

import { TablePromotions } from "../../components";
import { useDashboard } from "../../../hooks";
import { useAuthSlice } from "../../../hooks/useAuthSlice";
import { Navigation } from "../../components/sidebar/Navigation";

const pageTransition = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export const PromotionPage = () => {
  const { user } = useAuthSlice();
  const { metrics, plan } = useDashboard();

  const [updatedMetrics, setUpdatedMetrics] = useState(metrics); // Estado local para las métricas

  useEffect(() => {
    setUpdatedMetrics(metrics);
  }, [metrics]);

  const handlePromotionDelete = () => {
    // Aquí, actualiza las métricas cuando se elimina una promoción
    const updatedStats = {
      ...updatedMetrics,
      activePromotions: updatedMetrics.activePromotions - 1, // Restar una promoción
    };
    setUpdatedMetrics(updatedStats);
  };

  const statsCards = [
    {
      title: "Programas activos",
      value: `${updatedMetrics?.activePromotions || 0}/ ${plan?.promotionLimit || 50}`,
      icon: <PackageIcon sx={{ fontSize: 24, color: "#5b7898" }} />,
      tooltip: "Número de programas de fidelización activos",
    },
  ];

  return (
    <div className='flex flex-col md:flex-row'>
      <Navigation />
      <div className='flex-1 overflow-x-hidden'>
        <motion.div
          initial='hidden'
          animate='visible'
          exit='hidden'
          variants={pageTransition}
          className='p-4 md:p-8 w-full lg:w-[90%] mx-auto space-y-4 md:space-y-8'
        >
          {/* Tarjeta de Bienvenida */}

          {/* Grid de Estadísticas */}

          {/* Tabla de Programas */}
          <TablePromotions onDelete={handlePromotionDelete} statsCards={statsCards} />
        </motion.div>
      </div>
    </div>
  );
};
