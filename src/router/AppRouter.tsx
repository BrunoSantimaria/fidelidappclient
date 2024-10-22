import { Route, Routes, Navigate } from "react-router-dom";
import { AuthRoutes } from "../auth/routes/AuthRoutes";
import { NavBar, Footer } from "../layaout";
import FloatingWhatsAppButton from "../layaout/components/FloatingWhatsAppButton";
import { Box } from "@mui/material";
import { DashboardRoutes } from "../dashboard/routes/DashboardRoutes";
import { useAuthSlice } from "../hooks/useAuthSlice";
import { useEffect, useRef } from "react";
import { Landing } from "../landing/pages";
import { PromotionClient } from "../promotion-client/pages";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClientPromotionCard } from "../promotion-client/pages/ClientPromotionCard";
import Agenda from "../agenda-client/Agenda";
import CancelAppointment from "../agenda-client/CancelAppointment";
import ConfirmAppointment from "../agenda-client/ConfirmAppointment";

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

  useEffect(() => {
    const currentTitle = document.title;
    // Verificar si la variable de entorno contiene 'localhost'
    if (import.meta.env.VITE_API_URL.includes("localhost")) {
      document.title = `DEV - ${currentTitle}`;
    }
  }, []); // El useEffect se ejecuta solo una vez al cargar

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", width: "100%" }}>
      <FloatingWhatsAppButton />
      <ToastContainer position='bottom-center' autoClose={5000} />
      <NavBar refs={refs} />
      <Box sx={{ flexGrow: 1 }}>
        <Routes>
          {/* Ruta de promoción accesible para todos */}
          <Route path='/agendas/:agendaId' element={<Agenda />} />
          <Route path='/agenda/confirm/:appointmentId' element={<ConfirmAppointment />} />
          <Route path='/agenda/cancel/:appointmentId' element={<CancelAppointment />} />
          <Route path='/promotion/:id' element={<PromotionClient />} />
          <Route path='/promotions/:cid/:pid' element={<ClientPromotionCard />} />
          {status === "non-authenticated" ? (
            <>
              <Route path='/agendas/:agendaId' element={<Agenda />} />
              <Route path='/' element={<Landing refs={refs} />} />
              <Route path='/auth/*' element={<AuthRoutes />} />
              <Route path='/dashboard' element={<Navigate to='/' replace />} />
            </>
          ) : (
            <>
              <Route path='/' element={<Landing refs={refs} />} />
              <Route path='/auth/*' element={<Navigate to='/dashboard' replace />} />
              <Route path='/dashboard/*' element={<DashboardRoutes />} />
            </>
          )}
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </Box>
      <Footer refs={refs} />
    </Box>
  );
};
