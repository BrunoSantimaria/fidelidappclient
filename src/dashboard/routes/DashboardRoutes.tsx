import { Navigate, Route, Routes } from "react-router";
import { motion } from "framer-motion";
import { Dashboard } from "../pages";
import { CreatePromotion } from "../pages/Promotions/CreatePromotion";
import { Navigation } from "../components/sidebar/Navigation";
import { useDashboard } from "../../hooks";
import { useEffect } from "react";
import { Promotion } from "../pages/Promotions/Promotion";
import { EmailSender } from "../pages/email/EmailSender";
import { CreateAgenda } from "../pages/Agenda/CreateAgenda";
import { Clients } from "../pages/Clients/Clients";
import { AccountQr } from "../pages/AccountQr/AccountQr";

const pageTransition = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export const DashboardRoutes = () => {
  const { getPromotionsAndMetrics, plan, metrics } = useDashboard();

  useEffect(() => {
    getPromotionsAndMetrics();
  }, []);

  return (
    <>
      <Navigation />
      <Routes>
        {/* Permitir acceso a la promoción sin autenticación */}

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
        {/* Proteger ruta de creación de promociones */}
        <Route
          path='/promotions/create'
          element={
            metrics?.activePromotions < plan?.promotionLimit ? (
              <motion.div initial='hidden' animate='visible' exit='hidden' variants={pageTransition}>
                <CreatePromotion />
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
        {/* Redirigir cualquier otra ruta al Dashboard */}
        <Route path='/*' element={<Navigate to='/' replace />} />
      </Routes>
    </>
  );
};
