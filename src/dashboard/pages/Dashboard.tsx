import { DashboardLayout } from "@toolpad/core";
import { Box, Typography } from "@mui/material";
import logo from "../../assets/LOGO-SIN-FONDO.png";

export const Dashboard = () => {
  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant='h4'>Bienvenido al Dashboard</Typography>
      <Typography variant='body1'>Aquí puedes administrar tu aplicación.</Typography>
    </Box>
  );
};
