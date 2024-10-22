import React, { useEffect } from "react";
import { useAuthSlice } from "../../../hooks/useAuthSlice";
import QRCode from "react-qr-code";
import { useDashboard } from "../../../hooks";

export const AccountQr = () => {
  const { user, refreshAccount } = useAuthSlice();

  const qrValue = user.accounts.accountQr;

  if (!user) return <div>No hay codigo qr en esta cuenta.</div>;
  return (
    <div className='mt-40 space-y-12'>
      <div className='flex justify-center'>
        <p className='text-center text-xl'>Usa este codigo QR para que tus clientes lo escaneen en cada visita</p>
      </div>
      <div className='flex justify-center'>
        <QRCode value={qrValue} />
      </div>
      <span className='bg-main text-white p-2 flex justify-center w-fit m-auto rounded-md cursor-pointer '>Regenerar codigo QR</span>
    </div>
  );
};
