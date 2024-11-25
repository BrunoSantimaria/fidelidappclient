import React, { useState, useEffect } from "react";
import { Wallet, initMercadoPago } from "@mercadopago/sdk-react";
import { motion } from "framer-motion";
import api from "../../../../utils/api";
import { useAuthSlice } from "../../../../hooks/useAuthSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Dialog,
} from "@mui/material";
import { useDashboard } from "../../../../hooks";
import { CreditCard } from "@mui/icons-material";
const MERCADOPAGO_PUBLIC = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY;
initMercadoPago(MERCADOPAGO_PUBLIC, { locale: "es-CL" });

export const Subscription = () => {
  const { user, refreshAccount } = useAuthSlice();
  const [expirationDate, setExpirationDate] = useState(null);
  const [daysRemaining, setDaysRemaining] = useState(null);
  const [preferenceId, setPreferenceId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [subscriptionId, setSubscriptionId] = useState(null);
  const preapprovalId = "2c938084929566050192d988bf5c14e6";
  const nextPaymentDate = new Date(user?.accounts.planExpiration);
  const { getSubscription } = useDashboard();
  const formattedNextPaymentDate = nextPaymentDate.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  useEffect(() => {
    if (user?.accounts) {
      getSubscription();
    }
  }, [user]);

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        const response = await api.get(`/api/mercadopago/check_and_update_subscription/${user.accounts._id}`);
        const { expirationDate } = response.data;
        console.log(response); // Obtener la fecha de expiración
        setExpirationDate(expirationDate ? new Date(expirationDate) : null);
      } catch (error) {
        console.log(error);
        console.error("Error al cargar los datos de suscripción:", error.response?.data || error.message);
      }
    };
    fetchSubscriptionData();
  }, []);

  useEffect(() => {
    if (expirationDate) {
      const remainingTime = expirationDate.getTime() - Date.now();
      setDaysRemaining(Math.ceil(remainingTime / (1000 * 60 * 60 * 24)));
    }
  }, [expirationDate]);

  useEffect(() => {
    refreshAccount();
  }, []);

  const handleCancelSubscription = async () => {
    try {
      const response = await api.post("/api/mercadopago/cancel_subscription", {
        accountId: user.accounts._id,
      });
      if (response.status === 200) {
        setExpirationDate(null);
        setDaysRemaining(null);
      }
      setOpenDialog(!openDialog);
      await refreshAccount();
    } catch (error) {
      console.error("Error al cancelar la suscripción:", error.response ? error.response.data : error.message);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  console.log("active payer", user.accounts.activePayer);
  const createPreference = async () => {
    try {
      const response = await api.post("/api/mercadopago/create_preference", {
        accountId: user.accounts._id,

        items: [
          {
            title: "Nombre del producto o servicio",
            description: "Descripción del producto o servicio",
            price: 100.0, // Precio por unidad
            quantity: 1, // Cantidad como número
            currency_id: "CLP", // Moneda
          },
        ],
      });
      console.log(response);

      setPreferenceId(response.data.id);
      setSubscriptionId(response.data.subscriptionId);

      // Redirigir a la URL de pago de Mercado Pago
      const redirectUrl = `https://www.mercadopago.cl/subscriptions/checkout?preapproval_plan_id=${response.data.subscriptionId}`;
      window.location.href = redirectUrl;
    } catch (error) {
      console.error("Error creando la preferencia:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <motion.div initial='hidden' whileInView='visible' variants={fadeIn} transition={{ duration: 0.5 }}>
      <div className='w-full max-w-[1200px] mx-auto px-4'>
        <div className='bg-white rounded-lg p-6'>
          <div className='flex items-center gap-2 mb-4'>
            <span className='text-main'>
              <CreditCard />
            </span>
            <h2 className='text-lg text-gray-700'>Suscripción</h2>
          </div>
          <p className='text-sm text-gray-600 mb-6'>Gestiona tu plan y suscripción</p>

          {/* Panel de información del plan actual */}
          <div className='bg-gray-50 rounded-lg p-6 mb-6'>
            <div className='mb-4'>
              <p className='text-lg'>
                <strong>Plan activo:</strong>
                <span className={`ml-2 ${user.plan.planStatus === "pro" || user.plan.planStatus === "premium" ? "text-green-500" : "text-gray-600"}`}>
                  {user.plan.planStatus === "pro" ? "PRO ⭐" : user.plan.planStatus === "premium" ? "PREMIUM 💎" : "Free"}
                </span>
              </p>
            </div>

            {/* Información de fechas */}
            {user.plan.planStatus === "pro" && expirationDate && user?.accounts.activePayer && (
              <div className='mb-4'>
                <p className='text-lg text-gray-700'>
                  <strong>Próximo pago:</strong> {formatDate(expirationDate)}
                </p>
              </div>
            )}
            {!user?.accounts.activePayer && user?.accounts.planStatus === "pro" && (
              <div className='mb-4'>
                <p className='text-lg'>
                  <strong>Fin de la suscripción:</strong> {formatDate(expirationDate)}
                </p>
              </div>
            )}
            {/* Mostrar la Wallet con el preapprovalId */}
            {preferenceId && (
              <div className='mt-4'>
                <Wallet
                  initialization={{ preferenceId: preferenceId }}
                  onReady={(status) => {
                    console.log("Wallet está lista", status);
                  }}
                  onError={(error) => {
                    console.error("Error en la Wallet", error);
                  }}
                />
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className={`${!user?.accounts.activePayer && user?.accounts.planStatus === "pro" ? "hidden" : ""} mb-8`}>
            {user?.accounts?.planStatus === "free" ? (
              <Button variant='contained' color='primary' onClick={createPreference} className='bg-main hover:bg-main-dark transition-colors'>
                ¡Suscríbete al Plan Pro ahora!
              </Button>
            ) : (
              user?.accounts?.planStatus === "pro" && (
                <Button variant='contained' color='error' onClick={() => setOpenDialog(true)} className='bg-red-500 hover:bg-red-600 transition-colors'>
                  Cancelar Suscripción
                </Button>
              )
            )}
          </div>

          {/* Tabla comparativa */}
          <div className='bg-white rounded-lg'>
            <h3 className='text-xl font-bold mb-6 text-gray-800'>Comparación de Planes</h3>
            <TableContainer component={Paper} className='shadow-sm'>
              <Table>
                <TableHead>
                  <TableRow className='bg-main'>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }} className='text-white'>
                      Características
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }} className='text-white'>
                      Free
                    </TableCell>
                    <TableCell sx={{ color: "white", fontWeight: "bold" }} className='text-white'>
                      Pro
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Promociones activas</TableCell>
                    <TableCell>1</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} className='font-bold text-green-600'>
                      10
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Clientes Registrados máximos</TableCell>
                    <TableCell>250</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} className='font-bold text-green-600'>
                      Ilimitados
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Email Marketing</TableCell>
                    <TableCell>1,000 correos/mes</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} className='font-bold text-green-600'>
                      10,000 correos/mes
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Carga de Clientes por CSV</TableCell>
                    <TableCell>Sí</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} className='font-bold text-green-600'>
                      Sí
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Reportes</TableCell>
                    <TableCell>Básicos</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} className='font-bold text-green-600'>
                      Avanzados
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Soporte Prioritario</TableCell>
                    <TableCell>No</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} className='font-bold text-green-600'>
                      Sí
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Evaluación inicial</TableCell>
                    <TableCell>No</TableCell>
                    <TableCell sx={{ fontWeight: "bold" }} className='font-bold text-green-600'>
                      Sí
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </div>

      {/* Dialog se mantiene igual */}
    </motion.div>
  );
};
