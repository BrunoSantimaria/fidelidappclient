import { useState, useEffect } from "react";
import { useAuthSlice } from "../../../hooks/useAuthSlice";
import QRCode from "react-qr-code";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { QrCode, QrCodeScanner, EmojiEvents, Person } from "@mui/icons-material";
import { toPng } from "html-to-image";

export const AccountQr = () => {
  const { user } = useAuthSlice();
  const [loading, setLoading] = useState(true);

  const steps = [
    "Le muestras el código QR a tu cliente",
    "El cliente escanea el código QR con su smartphone",
    "El sistema registra automáticamente la visita o los puntos",
  ];

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  const handleDownloadQR = () => {
    const qrElement = document.getElementById("qr-code");
    if (qrElement) {
      toPng(qrElement)
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.download = "mi-codigo-qr-fidelidapp.png";
          link.href = dataUrl;
          link.click();
        })
        .catch((error) => {
          console.error("Error al generar la imagen:", error);
        });
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user || !user.accounts || !user.accounts.accountQr) {
    return <div>No hay código QR disponible en esta cuenta.</div>;
  }

  return (
    <div className='container mx-auto p-8 max-w-4xl'>
      <Card className='border-t-4' sx={{ borderColor: "#5b7898" }}>
        <CardContent>
          {/* Header */}
          <div className='mb-6'>
            <Typography variant='h5' className='flex items-center gap-2 text-[#5b7898]'>
              <QrCode /> Código QR de FidelidApp
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Usa este código QR para que tus clientes registren visitas y acumulen puntos, y canjeen promociones
            </Typography>
          </div>

          <div className='grid md:grid-cols-2 gap-8'>
            {/* QR Code Section */}
            <div className='flex flex-col items-center justify-center space-y-4'>
              <div className='bg-white p-4 rounded-xl shadow-lg' id='qr-code'>
                <QRCode value={user.accounts.accountQr} size={250} />
              </div>
              <Button
                variant='contained'
                startIcon={<QrCodeScanner />}
                onClick={handleDownloadQR}
                sx={{ backgroundColor: "#5b7898", "&:hover": { backgroundColor: "#4a6277" } }}
              >
                Descargar Código QR
              </Button>
            </div>

            {/* Instructions Section */}
            <div className='space-y-6'>
              <div>
                <Typography variant='h6' className='text-[#5b7898] mb-2'>
                  Cómo usar este código QR
                </Typography>
                <Typography variant='body2' color='text.secondary'>
                  Este código QR permite a tus clientes registrar sus visitas y acumular puntos de fidelidad de forma rápida y sencilla.
                </Typography>
              </div>

              {/* Steps */}
              <div className='space-y-4'>
                <Typography variant='subtitle1'>Pasos a seguir:</Typography>
                <div className='space-y-3'>
                  {steps.map((step, index) => (
                    <div key={index} className='flex items-start gap-3'>
                      <div className='flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#5b7898] text-xs text-white'>{index + 1}</div>
                      <Typography variant='body2' className='pt-0.5'>
                        {step}
                      </Typography>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips Card */}
              <Card className='bg-slate-50'>
                <CardContent className='p-4'>
                  <div className='flex items-start gap-3'>
                    <EmojiEvents className='text-[#5b7898]' />
                    <div className='space-y-1'>
                      <Typography variant='subtitle2'>Consejos para el uso</Typography>
                      <ul className='text-xs text-gray-600 list-disc list-inside space-y-1'>
                        <li>Coloca el código QR en un lugar visible y bien iluminado</li>
                        <li>Asegúrate de que el código esté limpio y sin daños</li>
                        <li>Instruye a tu personal sobre cómo ayudar a los clientes a escanear el código</li>
                        <li>Considera ofrecer una breve explicación junto al código QR</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
