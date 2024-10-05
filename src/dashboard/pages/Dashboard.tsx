import { DashboardLayout } from "@toolpad/core";
import { Box, Typography } from "@mui/material";
import logo from "../../assets/LOGO-SIN-FONDO.png";
import "animate.css";
export const Dashboard = () => {
  return (
    <Box sx={{ padding: 2 }} className='animate__animated animate__bounce animate__delay-2s'>
      <Typography variant='h4'>Bienvenido al Dashboard</Typography>
      <Typography variant='body1'>Aquí puedes administrar tu aplicación.</Typography>
    </Box>
  );
};
