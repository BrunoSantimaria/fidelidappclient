import { Navigate, Route, Routes } from "react-router";
import { motion } from "framer-motion";
import { Dashboard } from "../pages";
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
  const { getPromotionsAndMetrics, plan, metrics, loading, getSubscription } = useDashboard();
  const { user } = useAuthSlice();
  const [notifications, setNotifications] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const url = import.meta.env.VITE_API_URL;
  useEffect(() => {
    getPromotionsAndMetrics();
  }, []);
  useEffect(() => {
    getSubscription();
  }, []);
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
          path='/email-sender'
          element={
            <motion.div initial='hidden' animate='visible' exit='hidden' variants={pageTransition}>
              <EmailSender />
            </motion.div>
          }
        />
        <Route
          path='/promotions/create'
          element={
            metrics?.activePromotions < plan?.promotionLimit ? (
              <motion.div initial='hidden' animate='visible' exit='hidden' variants={pageTransition}>
                <Stepper />
              </motion.div>
            ) : (
              <Navigate to='/dashboard' replace />
            )
          }
        />
        <Route path='/promotion/:id' element={<Promotion />} />
        <Route path='/agenda/create' element={<CreateAgenda />} />
        <Route path='/clients/list' element={<Clients />} />
        <Route path='/qr' element={<AccountQr />} />
        <Route path='/settings' element={<Settings />} />
        <Route path='/stepper-promotion' element={<Stepper />} />
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
