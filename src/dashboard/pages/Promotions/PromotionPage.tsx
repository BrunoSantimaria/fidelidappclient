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
import { Calendar, Edit, MoreHorizontal, Share2, Trash2 } from "lucide-react";
import { useState } from "react";
import { Badge } from "@mui/material";

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
  console.log(metrics);
  const statsCards = [
    {
      title: "Programas activos",
      value: `${metrics?.activePromotions || 0}/ ${plan?.promotionLimit || 50}`,
      icon: <PackageIcon sx={{ fontSize: 24, color: "#5b7898" }} />,
      tooltip: "Número de programas de fidelización activos",
    },
    {
      title: "Clientes Registrados",
      value: `${metrics?.registeredClients || 0} / ${plan?.clientLimit || "Ilimitado"}`,
      icon: <UsersIcon sx={{ fontSize: 24, color: "#5b7898" }} />,
      tooltip: "Total de clientes registrados en tus programas",
    },
    {
      title: "Visitas Totales",
      value: metrics?.totalVisits || 0,
      icon: <VisitsIcon sx={{ fontSize: 24, color: "#5b7898" }} />,
      tooltip: "Número total de visitas registradas",
    },
    {
      title: "Promociones Canjeadas",
      value: metrics?.redeemedPromotions || 0,
      icon: <RewardsIcon sx={{ fontSize: 24, color: "#5b7898" }} />,
      tooltip: "Total de promociones canjeadas por tus clientes",
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
          <Card sx={{ borderTop: 4, borderColor: "#5b7898" }}>
            <CardContent>
              <Typography
                variant='h5'
                sx={{
                  color: "#5b7898",
                  mb: 1,
                  fontSize: { xs: "1.2rem", sm: "1.5rem" },
                }}
              >
                ¡Bienvenido a FidelidApp {user.accounts?.name || ""}!
              </Typography>
              <Typography variant='body1' color='text.secondary'>
                Aquí encontrarás herramientas diseñadas para mejorar la fidelidad de tus clientes y maximizar el rendimiento de tus programas de fidelización.
              </Typography>
            </CardContent>
          </Card>

          {/* Grid de Estadísticas */}
          <Grid container spacing={{ xs: 2, md: 3 }}>
            {statsCards.map((stat, index) => (
              <Grid item xs={12} sm={6} lg={3} key={index}>
                <Card
                  sx={{
                    bgcolor: "background.paper",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 2,
                        flexWrap: { xs: "wrap", sm: "nowrap" },
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant='subtitle2' color='text.secondary'>
                          {stat.title}
                        </Typography>
                        <Tooltip title={stat.tooltip}>
                          <IconButton size='small'>
                            <HelpIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      {stat.icon}
                    </Box>
                    <Typography
                      variant='h4'
                      sx={{
                        color: "#5b7898",
                        fontWeight: 500,
                        fontSize: { xs: "1.5rem", sm: "2rem" },
                      }}
                    >
                      {stat.value}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Tabla de Programas */}
          <TablePromotions />
        </motion.div>
      </div>
    </div>
  );
};
