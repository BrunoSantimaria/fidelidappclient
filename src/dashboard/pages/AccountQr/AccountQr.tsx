import React, { useState, useEffect } from "react";
import { useAuthSlice } from "../../../hooks/useAuthSlice";
import QRCode from "react-qr-code";

export const AccountQr = () => {
  const { user } = useAuthSlice();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user || !user.accounts || !user.accounts.accountQr) {
    return <div>No hay código QR disponible en esta cuenta.</div>;
  }

  return (
    <div className='mt-40 space-y-12'>
      <div className='flex justify-center'>
        <p className='text-center text-xl'>Usa este código QR para que tus clientes lo escaneen en cada visita</p>
      </div>
      <div className='flex justify-center'>
        {/* Renderizar el código QR solo si está disponible */}
        <QRCode value={user.accounts.accountQr} />
      </div>
      <span className='bg-main text-white p-2 flex justify-center w-fit m-auto rounded-md cursor-pointer'>Regenerar código QR</span>
    </div>
  );
};
