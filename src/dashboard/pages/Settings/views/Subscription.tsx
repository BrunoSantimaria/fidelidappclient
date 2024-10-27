import React, { useState, useEffect } from "react";
import { CardPayment, initMercadoPago, Wallet } from "@mercadopago/sdk-react";

initMercadoPago("TEST-c4ac0466-9823-4fc7-9838-169c5f67539c");

export const Subscription = () => {
  const [plan, setPlan] = useState("Free"); // Plan actual del usuario ("Free" o "Pro")
  const [expirationDate, setExpirationDate] = useState(null); // Fecha de vencimiento si es Pro
  const initialization = {
    amount: 100,
  };

  const onSubmit = async (formData) => {
    // callback llamado al hacer clic en el botón enviar datos
    return new Promise((resolve, reject) => {
      fetch("/process_payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((response) => {
          // recibir el resultado del pago
          resolve();
        })
        .catch((error) => {
          // manejar la respuesta de error al intentar crear el pago
          reject();
        });
    });
  };

  const onError = async (error) => {
    // callback llamado para todos los casos de error de Brick
    console.log(error);
  };

  const onReady = async () => {
    /*
      Callback llamado cuando Brick está listo.
      Aquí puedes ocultar cargamentos de su sitio, por ejemplo.
    */
  };
  // Simulación de fecha de vencimiento para un plan Pro
  useEffect(() => {
    if (plan === "Pro") {
      const exampleExpirationDate = new Date();
      exampleExpirationDate.setDate(exampleExpirationDate.getDate() + 10); // 10 días más
      setExpirationDate(exampleExpirationDate);
    }
  }, [plan]);

  // Función para gestionar el pago (Mercado Pago)
  const handleMercadoPago = async () => {
    try {
      // Realizar una llamada a tu backend para crear la preferencia de pago
      const response = await fetch("/api/create_preference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Aquí envías los datos necesarios para la preferencia
          items: [
            {
              title: "Plan Pro",
              unit_price: 1000, // Precio del plan Pro
              quantity: 1,
            },
          ],
        }),
      });

      const preference = await response.json();

      // Inicia el flujo de pago con la preferencia de Mercado Pago
      window.MercadoPago.openCheckout({
        url: preference.init_point,
      });
    } catch (error) {
      console.error("Error al crear la preferencia:", error);
    }
  };

  // Función para actualizar al plan Pro
  const handleUpgradeToPro = () => {
    setPlan("Pro");
  };

  // Función para mostrar formato de fecha
  const formatDate = (date) => {
    if (!date) return "";
    return date.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
  };

  return (
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
          <Wallet initialization={initialization} onSubmit={onSubmit} onReady={onReady} onError={onError} />
        </div>
      )}
    </div>
  );
};
