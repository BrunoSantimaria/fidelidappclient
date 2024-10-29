import React, { useState, useEffect } from "react";
import { CardPayment, initMercadoPago, Wallet } from "@mercadopago/sdk-react";
import { motion } from "framer-motion";
import api from "../../../../utils/api";
import { useAuthSlice } from "../../../../hooks/useAuthSlice";

initMercadoPago("APP_USR-9d40b454-ffba-40df-b223-745404bea593", { locale: "es-AR" });

export const Subscription = () => {
  const { user } = useAuthSlice();
  const [preferenceId, setPreferenceId] = useState(null);
  const [plan, setPlan] = useState("Free"); // Plan actual del usuario ("Free" o "Pro")
  const [expirationDate, setExpirationDate] = useState(null); // Fecha de vencimiento si es Pro

  const onError = (error) => {
    console.log(error);
  };

  const onReady = async (data) => {
    // Aquí puedes manejar la respuesta de Mercado Pago
    if (data?.status === "approved") {
      // Actualiza la base de datos con el nuevo plan y accountId
      await updatePlanInDatabase();

      // Establecer la fecha de vencimiento al activar el plan Pro
      const newExpirationDate = new Date();
      newExpirationDate.setDate(newExpirationDate.getDate() + 30); // 30 días más
      setExpirationDate(newExpirationDate); // Actualiza el estado de expirationDate
    }
  };

  const handleUpgradeToPro = async () => {
    try {
      const response = await api.post("/api/mercadopago/create_preference", {
        items: [
          {
            title: "Plan Pro FidelidApp",
            unit_price: 49990,
            quantity: 1,
          },
        ],
        accountId: user.accounts._id, // Reemplaza con el accountId real del usuario
      });

      if (response.data.preferenceId) {
        setPreferenceId(response.data.preferenceId);
      } else {
        console.error("No se recibió un ID de preferencia válido", response.data);
      }
    } catch (error) {
      console.error("Error al crear la preferencia:", error.response ? error.response.data : error.message);
    }
  };

  const updatePlanInDatabase = async () => {
    try {
      const response = await api.put("/api/user/updatePlan", {
        accountId: "accountId_aqui", // Reemplaza con el accountId real del usuario
        plan: "Pro",
        expirationDate: expirationDate, // Agrega la expirationDate si es necesario
      });
      if (response.status === 200) {
        console.log("Plan actualizado correctamente");
        setPlan("Pro"); // Actualiza el estado del plan a Pro
      } else {
        console.error("Error al actualizar el plan:", response.data);
      }
    } catch (error) {
      console.error("Error en la actualización de la base de datos:", error.response ? error.response.data : error.message);
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

  return (
    <motion.div initial='hidden' whileInView='visible' variants={fadeIn} transition={{ duration: 0.5 }}>
      <div className='w-[95%] m-auto md:ml-20'>
        <h2 className='text-2xl font-bold mb-4'>Suscripción</h2>

        {/* Mostrar el plan actual */}
        <div className='mb-4'>
          <p className='text-lg'>
            <strong>Plan activo:</strong> {plan}
          </p>
        </div>

        {/* Mostrar la fecha de vencimiento si el plan es Pro */}
        {plan === "Pro" && expirationDate && (
          <div className='mb-4'>
            <p className='text-lg'>
              <strong>Vence el:</strong> {formatDate(expirationDate)}
            </p>
            {expirationDate.getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000 && (
              <p className='text-red-500'>¡Tu suscripción vence pronto! Renueva para no perder acceso a las funciones Pro.</p>
            )}
          </div>
        )}

        {/* Botón para gestionar la suscripción con Mercado Pago */}
        {plan === "Free" && (
          <div className='mt-4 md:w-1/3 w-full'>
            <Wallet
              initialization={{ preferenceId }} // Pasa el preferenceId aquí
              onSubmit={handleUpgradeToPro}
              onReady={onReady} // Maneja la respuesta en onReady
              onError={onError}
            />{" "}
          </div>
        )}
      </div>
    </motion.div>
  );
};
