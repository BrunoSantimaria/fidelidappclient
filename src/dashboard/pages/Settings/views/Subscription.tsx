import React, { useState, useEffect } from "react";
import { Wallet, initMercadoPago } from "@mercadopago/sdk-react";
import { motion } from "framer-motion";
import api from "../../../../utils/api";
import { useAuthSlice } from "../../../../hooks/useAuthSlice";

initMercadoPago("APP_USR-eb5601e7-84ee-47ff-a992-654bb62f952a", { locale: "es-AR" });

export const Subscription = () => {
  const { user } = useAuthSlice();
  const [expirationDate, setExpirationDate] = useState(null);
  const [daysRemaining, setDaysRemaining] = useState(null);
  const [preferenceId, setPreferenceId] = useState(null);
  const preapprovalId = "2c938084929566050192d988bf5c14e6"; // Usar tu preapprovalId fijo

  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        const response = await api.get(`/api/mercadopago/check_and_update_subscription/${user.accounts._id}`);
        const { expirationDate } = response.data; // Obtener la fecha de expiración
        setExpirationDate(expirationDate ? new Date(expirationDate) : null);
      } catch (error) {
        console.error("Error al cargar los datos de suscripción:", error.response?.data || error.message);
      }
    };
    fetchSubscriptionData();
  }, [user.accounts._id]);

  useEffect(() => {
    if (expirationDate) {
      const remainingTime = expirationDate.getTime() - Date.now();
      setDaysRemaining(Math.ceil(remainingTime / (1000 * 60 * 60 * 24)));
    }
  }, [expirationDate]);

  const handleCancelSubscription = async () => {
    try {
      const response = await api.post("/api/mercadopago/cancel_subscription", {
        accountId: user.accounts._id,
      });
      if (response.status === 200) {
        setExpirationDate(null);
        setDaysRemaining(null);
      }
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
  const createPreference = async () => {
    try {
      const response = await api.post("/api/mercadopago/create_preference", {
        accountId: user.accounts._id,
        preapprovalId,
        items: [
          {
            title: "Nombre del producto o servicio",
            description: "Descripción del producto o servicio",
            price: 100.0, // Precio por unidad
            quantity: 1, // Cantidad como número
            currency_id: "ARS", // Moneda
          },
        ],
      });
      console.log(response);

      setPreferenceId(response.data.preferenceId);
      console.log("Preference created:", response.data);

      // Redirigir a la URL de pago de Mercado Pago
      const redirectUrl = `https://www.mercadopago.com.ar/subscriptions/checkout?preapproval_plan_id=${preapprovalId}&collection_id=${response.data.collection_id}`;
      window.location.href = redirectUrl; // Redirige al usuario
    } catch (error) {
      console.error("Error creating preference:", error.response ? error.response.data : error.message);
    }
  };

  return (
    <motion.div initial='hidden' whileInView='visible' variants={fadeIn} transition={{ duration: 0.5 }}>
      <div className='w-[95%] m-auto md:ml-20'>
        <h2 className='text-2xl font-bold mb-4'>Suscripción</h2>

        {/* Mostrar el plan actual */}
        <div className='mb-4'>
          <p className='text-lg'>
            <strong>Plan activo:</strong> {user.plan.planStatus}
          </p>
        </div>

        {/* Mostrar la fecha de vencimiento si el plan es Pro */}
        {user.plan.planStatus === "pro" && expirationDate && (
          <div className='mb-4'>
            <p className='text-lg'>
              <strong>Vence el:</strong> {formatDate(expirationDate)}
            </p>
            {daysRemaining < 7 && <p className='text-red-500'>¡Tu suscripción vence pronto! Renueva para no perder acceso a las funciones Pro.</p>}
          </div>
        )}

        {user.plan.planStatus === "pro" && (
          <div className='mt-4 md:w-1/3 w-full'>
            <button className='bg-red-500 text-white py-2 px-4 rounded-md' onClick={handleCancelSubscription}>
              Cancelar Suscripción
            </button>
            <p className='text-lg mt-2'>
              Días restantes: <strong>{daysRemaining}</strong>
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
        <button onClick={createPreference} className='mt-4 bg-blue-500 text-white py-2 px-4 rounded-md'>
          Suscribirse
        </button>
      </div>
    </motion.div>
  );
};
