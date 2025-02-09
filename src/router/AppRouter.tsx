import { Route, Routes, Navigate } from "react-router-dom";
import { AuthRoutes } from "../auth/routes/AuthRoutes";
import { NavBar, Footer } from "../layaout";
import { Box } from "@mui/material";
import { DashboardRoutes } from "../dashboard/routes/DashboardRoutes";
import { useAuthSlice } from "../hooks/useAuthSlice";
import { useEffect, useRef } from "react";

import { PromotionClient } from "../promotion-client/pages";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.css";
import { ClientPromotionCard } from "../promotion-client/pages/ClientPromotionCard";
import Agenda from "../agenda-client/Agenda";
import CancelAppointment from "../agenda-client/CancelAppointment";
import ConfirmAppointment from "../agenda-client/ConfirmAppointment";
import ThankYou from "../agenda-client/ThankYou";
import { PromotionQrLanding } from "../landing/components/PromotionQrLanding";
import { PromotionPage } from "../dashboard/pages/Promotions/PromotionPage";
import { ToastContainer } from "react-toastify";
import { LandingPage } from "../promotion-client/pages/LandingPage";

import { LandingClientRoutes } from "@/promotion-client/pages/LandingClientRoutes";
import WhatsAppButton from "../layaout/components/FloatingWhatsAppButton";

import { LandingRoutes } from "@/landing/routes/LandingRoutes";

import { CalendarView } from "@/dashboard/pages/Agenda/CalendarView";
import FidelidApp from "@/landing/pages/FidelidApp";
import Services from "@/landing/pages/Services/components/Services";
import AppointmentResult from "@/agenda-client/AppointmentResult";
import AppointmentConfirmation from "@/agenda-client/AppointmentConfirmation";
import AppointmentCancellation from "@/agenda-client/AppointmentCancellation";

export const AppRouter = () => {
  const { status } = useAuthSlice();

  const refs = {
    homeRef: useRef(null),
    promotionRef: useRef(null),
    servicesRef: useRef(null),
    patternRef: useRef(null),
    WhatIsFidelidapp: useRef(null),
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
    <>
      <ToastContainer
        toastClassName={() => "relative  bg-white flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer"}
        bodyClassName={() => "bg-white text-main flex text-sm font-medium block p-3"}
        position='bottom-center'
      />

      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh", width: "100%" }}>
        <div id='whatsapp-button'>
          <WhatsAppButton />
        </div>
        <NavBar refs={refs} />
        <Box sx={{ flexGrow: 1 }}>
          <Routes>
            {/* Ruta de promoción accesible para todos */}
            <Route path='/agendas/:agendaId' element={<Agenda />} />
            <Route path='/agenda/confirm/:appointmentId' element={<ConfirmAppointment />} />
            <Route path='/agenda/cancel/:appointmentId' element={<CancelAppointment />} />
            <Route path='/agenda/appointments/cancel-token/:token' element={<AppointmentCancellation />} />
            <Route path='/promotions/:id' element={<PromotionClient />} />
            <Route path='/promotion/:id' element={<PromotionClient />} />
            <Route path='/promotions/:cid/:pid' element={<ClientPromotionCard />} />
            <Route path='/thankyou' element={<ThankYou />} />

            <Route element={<FidelidApp />} path={"/features"} />
            <Route element={<Services />} path={"/services"} />
            <Route path='/appointments/confirm/:token' element={<AppointmentConfirmation />} />
            <Route path='/appointment-result' element={<AppointmentResult />} />
            <Route path='/landing/:slug' element={<LandingPage />} />
            {status === "non-authenticated" ? (
              <>
                <Route path='/agendas/:agendaId' element={<Agenda />} />
                <Route path='/' element={<LandingRoutes refs={refs} />} />
                <Route path='/thankyou' element={<ThankYou />} />
                <Route path='/promotionqrlanding' element={<PromotionQrLanding />} />
                <Route path='/landing/:slug/*' element={<LandingClientRoutes />} />

                <Route path='/auth/*' element={<AuthRoutes />} />
                <Route path='/dashboard' element={<Navigate to='/' replace />} />
              </>
            ) : (
              <>
                <Route path='/' element={<LandingRoutes refs={refs} />} />

                <Route path='/auth/*' element={<Navigate to='/dashboard' replace />} />
                <Route path='/thankyou' element={<ThankYou />} />

                <Route path='/dashboard/agenda/calendar' element={<CalendarView />} />
                <Route path='/dashboard/promotions' element={<PromotionPage />} />
                <Route path='/dashboard/*' element={<DashboardRoutes />} />
              </>
            )}
            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>
        </Box>
        <Footer refs={refs} />
      </Box>
    </>
  );
};
