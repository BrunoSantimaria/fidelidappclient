import React from "react";
import qrcode from "../../assets/qr-code.png";
export const PromotionQrLanding = () => {
  return (
    <div className='h-screen w-screen bg-gradient-to-br from-gray-300 to-main/30'>
      <div className='flex flex-col m-0 justify-center text-center pt-28'>
        <span className='text-xl'>
          Escanea el QR desde la <span className='font-bold'>FidelidCard</span> que acaba de llegar a tu correo.
        </span>
        <img src={qrcode} alt='QR Code' className='w-80 m-auto mt-8' />
        <span className='mt-10'>Una vez escaneado exitosamente puedes cerrar esta ventana con el botón debajo.</span>
      </div>
    </div>
  );
};
