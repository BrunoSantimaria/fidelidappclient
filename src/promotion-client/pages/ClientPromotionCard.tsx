import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, Container, Dialog, DialogTitle, DialogContent } from "@mui/material";
import { toast } from "react-toastify";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import Lottie from "react-lottie";
import celebrationAnimation from "../../assets/celebration.json"; // Add your celebration animation JSON file here
import keyUrl from "../../assets/fondocandado2.png";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Helmet } from "react-helmet-async";
import api from "../../utils/api";

export const ClientPromotionCard = () => {
  const { cid, pid } = useParams();
  const [promotion, setPromotion] = useState(null);
  const [promotionDetails, setPromotionDetails] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [client, setClient] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const generateIcons = (actualVisits, visitsRequired) => {
    const icons = [];
    for (let i = 0; i < actualVisits; i++) {
      icons.push(<Favorite key={`active-${i}`} className='text-green-500' />);
    }
    for (let i = actualVisits; i < visitsRequired; i++) {
      icons.push(<FavoriteBorder key={`inactive-${i}`} className='text-gray-400' />);
    }
    return icons;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleScan = async (result) => {
    setProcessing(true);
    if (result) {
      try {
        const accountQr = await result[0].rawValue;
        await api.post("/api/promotions/visit", { clientEmail: client.email, promotionId: pid, accountQr });
        toast.success("Visita registrada con éxito. La página se refrescará en 3 segundos.");
        setTimeout(() => window.location.reload(), 3000);
      } catch (error) {
        console.log(error);

        toast.error("Error al validar la visita!");
      }
    } else {
      toast.error("No se pudo leer el código QR");
    }
    setProcessing(false);
    setShowScanner(false);
  };

  const handleScanComplete = async (result) => {
    try {
      await api.post("/api/promotions/complete", { clientEmail: client.email, promotionId: pid });
      toast.success("Promocion completada con exito.");
    } catch (error) {
      console.log(error);

      toast.error("Error al validar la visita!");
    }

    setProcessing(false);
    setShowScanner(false);
  };
  const handleResetPromotion = async () => {
    try {
      await api.post("/api/promotions/restart", { clientEmail: client.email, promotionId: pid });
      toast.success("Promoción reiniciada");
      window.location.reload();
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  useEffect(() => {
    const fetchPromotionDetails = async () => {
      try {
        const response = await api.get(`/api/promotions/${cid}/${pid}`);

        setPromotion(response.data.promotion);
        setPromotionDetails(response.data.promotionDetails);
        setClient(response.data.client);
        setImageUrl(response.data.promotionDetails.imageUrl);
        console.log(imageUrl);
        const userResponse = await api.get("/auth/current");
        setUser(userResponse.data);
        setLoading(false);

        if (response.data.promotion.status === "Pending") {
          setShowPopup(true);

          if (response.data.promotion.promotionRecurrent === "True") {
            setShowPopup(true);
          }
        }
      } catch (error) {
        console.error("Error fetching promotion details:", error);
        setLoading(false);
      }
    };

    fetchPromotionDetails();
  }, [cid, pid]);

  const closePopup = () => setShowPopup(false);

  const restartPromotion = async () => {
    try {
      await api.post("/api/promotions/restart", { clientEmail: client.email, promotionId: pid });
      toast.success("Promoción reiniciada");
      window.location.reload();
    } catch (error) {
      toast.error(error.response.data.error);
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: celebrationAnimation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  if (loading) {
    return (
      <Container className='flex items-center justify-center h-screen bg-white'>
        <div className='text-center'>
          <p>Cargando detalles de la promoción...</p>
        </div>
      </Container>
    );
  }

  if (!promotion) {
    return (
      <Container className='flex items-center justify-center h-screen bg-white'>
        <p>No se encontró la promoción.</p>
      </Container>
    );
  }

  return (
    <>
      <Helmet>
        <title>{promotionDetails.title || "Fidelidapp"}</title>
        <meta name='description' content={promotionDetails.description || "Detalles de la promoción"} />
        <meta property='og:title' content={promotionDetails.title || "Fidelidapp"} />
        <meta property='og:description' content={promotionDetails.description || "Detalles de la promoción"} />
        <meta property='og:url' content={`https://www.fidelidapp.cl/promotions/${pid}`} />
      </Helmet>
      <Container className='flex flex-col items-center p-5 min-h-screen'>
        <div className='relative w-[95%] mb-6 md:w-2/3 p-5 mt-4 bg-white border border-main/60 rounded-lg shadow-lg overflow-hidden'>
          <img src={keyUrl} alt='Background' className='absolute inset-0 w-full h-full object-cover opacity-30' />
          <div className='relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='flex flex-col items-center'>
              <span className='text-lg font-bold'>Visitas:</span>
              <div className='flex'>{generateIcons(promotion.actualVisits, promotionDetails.visitsRequired)}</div>
            </div>
            <div className='flex flex-col items-center'>
              <span className='text-lg font-bold'>Estado:</span>
              {promotion.status === "Pending" ? (
                <p className='text-green-500'>Pendiente</p>
              ) : promotion.status === "Active" ? (
                <p className='text-blue-500'>Activa</p>
              ) : (
                <p className='text-red-500'>Completada</p>
              )}
            </div>
            <div className='flex flex-col items-center'>
              <span className='text-lg font-bold'>Canjes Realizados:</span>
              <p>{promotion.redeemCount}</p>
            </div>
            <div className='flex flex-col items-center'>
              <span className='text-lg font-bold'>Email del Cliente:</span>
              <p>{client.email}</p>
            </div>
            <div className='flex flex-col items-center'>
              <span className='text-lg font-bold'>Fecha de Registro:</span>
              <p>{formatDate(promotion.addedDate)}</p>
            </div>
            <div className='flex flex-col items-center'>
              <span className='text-lg font-bold'>Fin de Vigencia:</span>
              <p>{formatDate(promotion.endDate)}</p>
            </div>
          </div>
        </div>
        {promotion.status === "Redeemed" ? (
          <Button
            variant='contained'
            onClick={() => handleResetPromotion()}
            className='mt-12 md:mb-6 lg:mb-6 w-1/2 md:w-1/4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg transition duration-300'
          >
            Reiniciar promoción.
          </Button>
        ) : (
          <Button
            variant='contained'
            onClick={() => setShowScanner(true)}
            className='mt-12 w-1/2 md:w-1/4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg transition duration-300'
          >
            Abrir Escáner QR
          </Button>
        )}
        {promotion.status === "Pending" && (
          <div className='shadow-neutral-200 bg-gradient-to-br from-gray-50 to-main/40 p-6 rounded-md mt-4 w-[80%] flex'>
            <span className='p-6 font-bold text-2xl'>
              Felicidades lograste la meta 🎊. Escanea el codigo QR para canjear tu promoción y darla por completa.
            </span>
          </div>
        )}
        <section className='flex flex-col md:flex md:flex-row mx-6 md:mx-40 '>
          <div className='mt-4 w-full md:w-1/2 space-y-6'>
            <h1 className='mt-4  font-bold text-left font-poppins text-4xl w-full md:w-2/3 md:text-5xl'>{promotionDetails.title}</h1>
            <h2 className='text-lg font-normal'>Detalles de la Promoción</h2>
            <p className='mt-2 w-full md:w-2/3' dangerouslySetInnerHTML={{ __html: promotionDetails.description.replace(/\r\n|\r|\n/g, "<br />") }} />
            <p className='mt-2'>Tipo: {promotionDetails.promotionType}</p>
          </div>

          <div className='mt-4 w-3/3 md:w-2/6 md:h-[600px] text-center border rounded-xl mb-12'>
            <div className='relative w-full h-full aspect-[16/9]'>
              <img src={imageUrl} alt='Promotion' className='w-full h-full object-cover rounded-xl' />
            </div>
          </div>
        </section>
        <Dialog open={showPopup} onClose={closePopup}>
          <DialogTitle>¡Promoción Completada!</DialogTitle>
          <DialogContent>
            <Lottie options={defaultOptions} height={200} width={200} />
            <p>La promoción ha sido completada exitosamente.</p>
            {promotion.promotionRecurrent === "True" ? (
              <>
                <p>Esta promoción ha sido marcada como recurrente, ¿deseas volver a iniciarla?</p>
                <Button onClick={restartPromotion} variant='contained' className='mt-2 mr-2'>
                  Sí
                </Button>
              </>
            ) : (
              <p>Puedes darle el beneficio al cliente!</p>
            )}
            <Button onClick={closePopup} variant='outlined' className='mt-2'>
              Cerrar
            </Button>
          </DialogContent>
        </Dialog>

        <Dialog open={showScanner} onClose={() => setShowScanner(false)}>
          {processing ? (
            <p>Procesando...</p>
          ) : (
            <>
              <DialogTitle>Escáner de Código QR</DialogTitle>
              <DialogContent>
                <div className='w-full h-[500px] max-w-md mx-auto bg-gray-900 rounded-lg overflow-hidden shadow-lg border border-gray-800'>
                  {promotion.status === "Pending" ? (
                    <Scanner onScan={handleScanComplete} className='w-full h-full' />
                  ) : (
                    <Scanner onScan={handleScan} className='w-full h-full' />
                  )}
                </div>
              </DialogContent>
            </>
          )}
        </Dialog>

        <Dialog open={showPopup} onClose={closePopup}>
          <DialogTitle>¡Promoción Completada!</DialogTitle>
          <DialogContent>
            <Lottie options={defaultOptions} height={200} width={200} />
            <p>La promoción ha sido completada exitosamente.</p>
            <p>Puedes darle el beneficio al cliente!</p>
            {promotion.promotionRecurrent === "True" && (
              <>
                <p>Esta promoción ha sido marcada como recurrente, ¿deseas volver a iniciarla?</p>
                <Button onClick={restartPromotion} variant='contained' className='mt-2 mr-2'>
                  Sí
                </Button>
              </>
            )}
            <Button onClick={closePopup} variant='outlined' className='mt-2'>
              Cerrar
            </Button>
          </DialogContent>
        </Dialog>
      </Container>
    </>
  );
};
