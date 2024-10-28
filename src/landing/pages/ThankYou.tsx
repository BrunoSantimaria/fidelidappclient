import React, { useEffect } from "react";

export const ThankYou = () => {
  useEffect(() => {
    // Aquí puedes agregar el código para enviar la conversión
    // Ejemplo: enviar un evento a Google Analytics o cualquier herramienta que uses
    console.log("Conversión registrada");
    // Si estás usando Google Analytics:
    // window.gtag('event', 'conversion', {
    //   'send_to': 'AW-XXXXXXXXX/YYYYYYYYY',
    //   'value': 1.0,
    //   'currency': 'USD'
    // });
    setTimeout(() => {
      window.location.href = "/"; // Redirige al usuario a la página principal
    }, 3000); // Redirige después de 3 segundos
  }, []);

  return (
    <div>
      <h1>¡Gracias por tu envío!</h1>
      <p>Tu formulario ha sido enviado con éxito.</p>
    </div>
  );
};
