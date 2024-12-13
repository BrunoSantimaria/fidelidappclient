import { Navigate, Route, Routes } from "react-router";
import { motion } from "framer-motion";
import { Dashboard } from "../pages";
import { Report } from "../pages/report/Report";
import { CreatePromotion } from "../pages/Promotions/CreatePromotion";
import { Navigation } from "../components/sidebar/Navigation";
import { useDashboard } from "../../hooks";
import React, { useEffect, useState } from "react";
import { Promotion } from "../pages/Promotions/Promotion";
import { EmailSender } from "../pages/email/EmailSender";
import { CreateAgenda } from "../pages/Agenda/CreateAgenda";
import { Clients } from "../pages/Clients/Clients";
import { AccountQr } from "../pages/AccountQr/AccountQr";
import { Settings } from "../pages/Settings/Settings";
import { useAuthSlice } from "../../hooks/useAuthSlice";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress"; // Importa el indicador de carga
import { StepperPromotion } from "../pages/Promotions/StepperPromotion";
import { Stepper } from "../pages/Promotions/Stepper";

import "react-toastify/dist/ReactToastify.css";

import { PromotionPage } from "../pages/Promotions/PromotionPage";
import { toast } from "react-toastify";

import { AutomationRulesPage } from "../pages/AutomationRules/AutomationRules";
import EmailCampaigns, { EmailCampaign } from "../pages/email/EmailCampaign";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

const pageTransition = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export const DashboardRoutes = () => {
  const { getPromotionsAndMetrics, plan, metrics, getSubscription } = useDashboard();
  const { user } = useAuthSlice();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const LimitReachedComponent = () => {
    useEffect(() => {
      toast.info("Límite de promociones activas alcanzado", {});
    }, []);

    return <Navigate to='/dashboard' replace />;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user?.id) {
          await Promise.all([getPromotionsAndMetrics(true), getSubscription().catch((err) => console.warn("Error al obtener suscripción:", err))]);
        }
      } catch (error) {
        console.error("Error al obtener datos:", error);
        toast.error("Error al cargar los datos");
      }
    };

    if (user?.id) {
      fetchData();
      const interval = setInterval(() => getPromotionsAndMetrics(), 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [user?.id]);
  console.log(metrics?.activePromotions >= plan?.promotionLimit);
  return (
    <>
      <Navigation />
      <Routes>
        <Route
          path='/'
          element={
            <motion.div initial='hidden' animate='visible' exit='hidden' variants={pageTransition}>
              <Dashboard />
            </motion.div>
          }
        />
        <Route
          path='/report'
          element={
            <motion.div initial='hidden' animate='visible' exit='hidden' variants={pageTransition}>
              <Report />
            </motion.div>
          }
        />
        <Route
          path='/email-sender'
          element={
            <motion.div initial='hidden' animate='visible' exit='hidden' variants={pageTransition}>
              <EmailSender />
            </motion.div>
          }
        />
        <Route
          path='/email-campaign'
          element={
            <motion.div initial='hidden' animate='visible' exit='hidden' variants={pageTransition}>
              <EmailCampaign />
            </motion.div>
          }
        />
        <Route
          path='/promotions/create'
          element={
            metrics?.activePromotions <= plan?.promotionLimit ? (
              <motion.div initial='hidden' animate='visible' exit='hidden' variants={pageTransition}>
                <Stepper />
              </motion.div>
            ) : (
              <LimitReachedComponent />
            )
          }
        />
        <Route path='/promotion/:id' element={<Promotion />} />
        <Route path='/promotions' element={<PromotionPage />} />
        <Route path='/agenda/create' element={<CreateAgenda />} />
        <Route path='/clients/list' element={<Clients />} />
        <Route path='/qr' element={<AccountQr />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/automation-rules' element={<AutomationRulesPage />} />
        <Route path='/*' element={<Navigate to='/' replace />} />
      </Routes>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};
