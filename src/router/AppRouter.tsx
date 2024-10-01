import { LandingRoutes } from "../landing/routes/LandingRoutes";
import { Route, Routes, Navigate } from "react-router-dom";
import { AuthRoutes } from "../auth/routes/AuthRoutes";
import { NavBar, Footer } from "../layaout";
import FloatingWhatsAppButton from "../layaout/components/FloatingWhatsAppButton";
import { Box } from "@mui/material";
import { DashboardRoutes } from "../dashboard/routes/DashboardRoutes";

export const AppRouter = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", maxWidth: "100vw" }}>
      <NavBar />
      <FloatingWhatsAppButton />
      {/* Aquí utilizamos flex-grow para que el contenido principal empuje el footer hacia abajo */}
      <div style={{ flexGrow: 1 }}>
        <Routes>
          {/* Rutas para usuarios no autenticados */}
          <Route path='/' element={<LandingRoutes />} />
          <Route path='/auth/*' element={<AuthRoutes />} />
          <Route path='/dashboard' element={<DashboardRoutes />} />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </div>

      <Footer />
    </Box>
  );
};
