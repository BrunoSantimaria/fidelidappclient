import { Navigate, Route, Routes } from "react-router";
import { motion } from "framer-motion";
import { Dashboard } from "../pages";
import { CreatePromotion } from "../pages/Promotions/CreatePromotion";
import { Navigation } from "../components/sidebar/Navigation";
import { useDashboard } from "../../hooks";
import { useEffect } from "react";

const pageTransition = {
  hidden: { opacity: 0, y: 50 }, // Estado inicial: invisible y desplazado hacia abajo
  visible: {
    opacity: 1,
    y: 0, // Posición final: completamente visible y en su lugar original
    transition: { duration: 0.5, ease: "easeOut" }, // Duración y tipo de transición
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
        <Route
          path='/'
          element={
            <motion.div initial='hidden' animate='visible' exit='hidden' variants={pageTransition}>
              <Dashboard />
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
              <Navigate to='/' replace />
            )
          }
        />

        {/* Redirigir cualquier otra ruta al Dashboard */}
        <Route path='/*' element={<Navigate to='/' replace />} />
      </Routes>
    </>
  );
};
