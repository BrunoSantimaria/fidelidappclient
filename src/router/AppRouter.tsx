import { LandingRoutes } from "../landing/routes/LandingRoutes";
import { Route, Routes, Navigate } from "react-router-dom";
import { AuthRoutes } from "../auth/routes/AuthRoutes";
import { NavBar, Footer } from "../layaout";
import FloatingWhatsAppButton from "../layaout/components/FloatingWhatsAppButton";
import { Box } from "@mui/material";
import { DashboardRoutes } from "../dashboard/routes/DashboardRoutes";
import { useAuthSlice } from "../hooks/useAuthSlice";
import { useRef } from "react";
import { Landing } from "../landing/pages";

export const AppRouter = () => {
  const { status } = useAuthSlice();

  const refs = {
    homeRef: useRef(null),
    servicesRef: useRef(null),
    patternRef: useRef(null),
    howItWorksRef: useRef(null),
    testimonialsRef: useRef(null),
    stepsRef: useRef(null),
    plansRef: useRef(null),
    faqsRef: useRef(null),
    contactRef: useRef(null),
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", width: "100%" }}>
      <FloatingWhatsAppButton />
      <NavBar refs={refs} />
      <Box sx={{ flexGrow: 1 }}>
        <Routes>
          {status === "non-authenticated" ? (
            <>
              <Route path='/' element={<Landing refs={refs} />} />
              <Route path='/auth/*' element={<AuthRoutes />} />
              <Route path='/dashboard' element={<Navigate to='/' replace />} />
            </>
          ) : (
            <>
              <Route path='/' element={<Landing refs={refs} />} />
              <Route path='/auth/*' element={<Navigate to='/dashboard' replace />} />
              <Route path='/dashboard' element={<DashboardRoutes />} />
            </>
          )}
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </Box>
      <Footer refs={refs} />
    </Box>
  );
};
