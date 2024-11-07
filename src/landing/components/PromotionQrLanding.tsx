import React from "react";
import qrcode from "../../assets/qr-code.png";
import QRCode from "react-qr-code";
export const PromotionQrLanding = () => {
  return (
    <div className='h-screen w-screen bg-gradient-to-br from-gray-300 to-main/30'>
      <div className='flex flex-col m-0 justify-center text-center pt-28'>
        <span className='text-xl'>
          Escanea el QR desde la <span className='font-bold'>FidelidCard</span> que acaba de llegar a tu correo.
        </span>
        <QRCode value='3a8a8b36-5ad7-447f-8316-aac8cf4ba63a' size={256} />

        <span className='mt-10'>Una vez escaneado exitosamente puedes cerrar esta ventana con el botón debajo.</span>
      </div>
    </div>
  );
};
