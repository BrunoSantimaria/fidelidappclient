import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, Container, Dialog, DialogTitle, DialogContent, FormControlLabel, Switch, Divider } from "@mui/material";
import { toast } from "react-toastify";
import { Favorite, FavoriteBorder } from "@mui/icons-material";
import Lottie from "react-lottie";
import celebrationAnimation from "../../assets/celebration.json"; // Add your celebration animation JSON file here
import keyUrl from "../../assets/fondocandado2.png";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Helmet } from "react-helmet-async";
import api from "../../utils/api";
const marioCoinSound = "https://themushroomkingdom.net/sounds/wav/smb/smb_coin.wav";
const marioStarSound = "https://themushroomkingdom.net/sounds/wav/smb2/smb2_grow.wav";
const marioNewLifeSound = "https://themushroomkingdom.net/sounds/wav/smb/smb_1-up.wav";
import { motion, AnimatePresence } from "framer-motion";
export const ClientPromotionCard = () => {
  const { cid, pid } = useParams();
  const [promotion, setPromotion] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [promotionDetails, setPromotionDetails] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [client, setClient] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isRewardView, setIsRewardView] = useState(true);
  const [showRewards, setShowRewards] = useState(true);

  const [showScanner, setShowScanner] = useState(false);
  const handleSwitchChange = (event) => {
    setShowRewards(event.target.checked);
  };
  // Updated generateIcons function for 5-icon rows
  const generateIcons = (actualVisits, visitsRequired) => {
    if (visitsRequired > 15) {
      // Render a single icon with a counter when visitsRequired is greater than 15
      return (
        <div className='flex items-center space-x-2'>
          <Favorite className='text-green-500' />
          <span className='text-gray-700 font-bold'>x {actualVisits}</span>
        </div>
      );
    }

    const icons = [];
    for (let i = 0; i < actualVisits; i++) {
      icons.push(<Favorite key={`active-${i}`} className='text-green-500' />);
    }
    for (let i = actualVisits; i < visitsRequired; i++) {
      icons.push(<FavoriteBorder key={`inactive-${i}`} className='text-gray-400' />);
    }

    // Arrange icons in rows of 5
    const rows = [];
    for (let i = 0; i < icons.length; i += 5) {
      rows.push(
        <div key={`row-${i}`} className='flex justify-center space-x-1'>
          {icons.slice(i, i + 5)}
        </div>
      );
    }
    return rows;
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
      const accountQr = await result[0].rawValue;
      console.log(client.email, pid, accountQr);

      try {
        console.log(result);

        const accountQr = await result[0].rawValue;
        await api.post("/api/promotions/visit", { clientEmail: client.email, promotionId: pid, accountQr });

        toast.success("Visita registrada con éxito. La página se refrescará en 3 segundos.");
        const audio = new Audio(marioCoinSound);
        audio.play().catch((error) => console.error("Error al reproducir el audio:", error));
        setTimeout(() => {
          window.location.reload();
        }, 3000);
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
      toast.success("Promoción completada con exito, la página se refrescará en 3 segundos.");

      const audio = new Audio(marioStarSound);
      await audio.play().catch((error) => console.error("Error al reproducir el audio:", error));

      // Refresh after 3 seconds
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.log(error);

      toast.error("Error al validar la visita!");
    }

    setProcessing(false);
    setShowScanner(false);
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

        if (response.data.promotion.status === "Expired") {
          toast.error("Esta promoción ha expirado! Presiona el botón para reiniciarla.");
        }

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
      // Confirmation alert
      if (window.confirm("¿Estás seguro de que deseas reiniciar la promoción ? Esto volverá a comenzar la cuenta a 0")) {
        await api.post("/api/promotions/restart", {
          clientEmail: client.email,
          promotionId: pid,
        });
        toast.success("Promoción reiniciada con exito, la página se refrescará en 3 segundos.");
        const audio = new Audio(marioNewLifeSound);
        await audio.play().catch((error) => console.error("Error al reproducir el audio:", error));

        // Refresh after 3 seconds
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        toast.error("Cancelando reinicio de promoción...");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Error al reiniciar la promoción.");
    }
  };

  const redeemPromotion = async (pointsToRedeem) => {
    try {
      // Get actual visits or points from the client or promotion data (assuming `actualVisits` is available)
      const availablePoints = promotion.actualVisits; // Replace `actualVisits` with the actual variable holding current points

      // Check if `pointsToRedeem` is provided; if not, prompt for input
      if (pointsToRedeem == null) {
        const input = prompt("¿Cuántos puntos deseas canjear?");
        pointsToRedeem = parseInt(input, 10);
        if (isNaN(pointsToRedeem) || pointsToRedeem <= 0) {
          toast.error("Número de puntos no válido. Operación cancelada.");
          return;
        }
      }

      // Validate if pointsToRedeem is within available points
      if (pointsToRedeem > availablePoints) {
        toast.error(`No puedes canjear más puntos de los disponibles. Tienes ${availablePoints} puntos.`);
        return;
      }

      // Confirmation alert
      if (
        window.confirm(
          "¿Estás seguro de que deseas canjear " + pointsToRedeem + " visitas ? Esta operación no se puede deshacer y debe ser validada por el negocio!"
        )
      ) {
        await api.post("/api/promotions/redeem", {
          clientEmail: client.email,
          promotionId: pid,
          pointsToRedeem,
        });
        toast.success("Promoción canjeada con exito, la página se refrescará en 3 segundos.");
        const audio = new Audio(marioNewLifeSound);
        await audio.play().catch((error) => console.error("Error al reproducir el audio:", error));

        // Refresh after 3 seconds
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        toast.error("Cancelando canjeo de promoción...");
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Error al reiniciar la promoción.");
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
  console.log("esto es promotion", promotion);
  console.log("esto es promotion detail", promotionDetails);
  return (
    <>
      <Helmet>
        <title>FidelidCard: {promotionDetails.title || "Fidelidapp"}</title>
        <meta name='description' content={promotionDetails.description || "Detalles de la promoción"} />
        <meta property='og:title' content={promotionDetails.title || "Fidelidapp"} />
        <meta property='og:description' content={promotionDetails.description || "Detalles de la promoción"} />
        <meta property='og:url' content={`https://www.fidelidapp.cl/promotions/${pid}`} />
      </Helmet>
      <Container className='flex flex-col items-center  min-h-screen'>
        <div className='w-screen md:w-screen mb-6 p-10 bg-gradient-to-r from-gray-600 to-gray-900 rounded-b-lg shadow-lg shadow-black/40 overflow-hidden'>
          <div className='relative z-10 grid grid-cols-1 md:grid-cols-3 gap-4'>
            <div className='flex flex-col items-center'>
              <div className='space-y-2'>
                {promotionDetails.systemType === "points" ? (
                  <div className='flex flex-col text-center'>
                    <span className='text-lg font-bold text-white'>Puntos:</span>
                    <span className='font-bold text-white'>{promotion.pointsEarned}</span>
                  </div>
                ) : (
                  <>
                    <span className='text-lg font-bold text-white'>Visitas:</span>
                    {generateIcons(promotion.actualVisits, promotionDetails.visitsRequired)}
                  </>
                )}
              </div>
            </div>

            <div className='flex flex-col items-center text-white'>
              <span className='text-lg font-bold'>Estado:</span>
              {promotion.status === "Pending" ? (
                <p className='text-green-500'>Pendiente</p>
              ) : promotion.status === "Active" ? (
                <p className='text-green-500'>Activa</p>
              ) : promotion.status === "Expired" ? (
                <p className='text-red-500'>Expirada</p>
              ) : (
                <p className='text-green-500'>Completada</p>
              )}
            </div>

            <div className='flex flex-col items-center text-white'>
              <span className='text-lg font-bold'>Email del Cliente:</span>
              <p>{client.email}</p>
            </div>
          </div>

          {/* Flecha para mostrar/ocultar detalles, visible en todos los dispositivos */}
          <div className='flex justify-center mt-4'>
            <motion.div
              className='cursor-pointer text-white'
              onClick={() => setShowDetails(!showDetails)}
              animate={{ rotate: showDetails ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Flecha hacia abajo */}
              <svg xmlns='http://www.w3.org/2000/svg' className='h-8 w-8' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7' />
              </svg>
            </motion.div>
          </div>

          {/* Detalles adicionales que se muestran u ocultan */}
          <AnimatePresence>
            {showDetails && (
              <motion.div
                className='flex flex-col justify-center space-y-6 md:flex md:flex-row md:space-x-16 md:space-y-0  mt-4'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className='flex flex-col items-center text-white'>
                  <span className='text-lg font-bold'>Canjes Realizados:</span>
                  <p>{promotion.redeemCount}</p>
                </div>

                <div className='flex flex-col items-center text-white'>
                  <span className='text-lg font-bold'>Fecha de Registro:</span>
                  <p>{formatDate(promotion.addedDate)}</p>
                </div>

                <div className='flex flex-col items-center text-white'>
                  <span className='text-lg font-bold'>Fin de Vigencia:</span>
                  <p>{formatDate(promotion.endDate)}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        {promotion.status === "Pending" && (
          <div className='shadow-neutral-200 bg-gradient-to-br from-gray-50 to-main/40 p-6 rounded-md mb-4 w-[80%] flex'>
            <span className='p-6 font-bold text-2xl'>
              Felicidades lograste la meta 🎊. Muestra este mensaje al encargado de la tienda para canjear tu beneficio!
            </span>
          </div>
        )}
        {promotion.status === "Redeemed" || promotion.status === "Expired" ? (
          <Button
            variant='contained'
            onClick={() => restartPromotion()}
            className='mt-12 md:mb-6 lg:mb-6 w-1/2 md:w-1/4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg transition duration-300'
          >
            Reiniciar Promoción
          </Button>
        ) : promotion.status === "Pending" ? (
          <Button
            variant='contained'
            onClick={() => redeemPromotion(promotion.actualVisits)}
            className='mt-12 md:mb-6 lg:mb-6 w-1/2 md:w-1/4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg transition duration-300'
          >
            Canjear Regalo
          </Button>
        ) : promotionDetails.pointSystem ? (
          <div className='flex flex-col space-y-4 w-full items-center justify-center'>
            <Button
              variant='contained'
              onClick={() => setShowScanner(true)}
              className='mt-12 w-[95%] md:w-1/4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg transition duration-300'
            >
              {promotionDetails.systemType === "points" ? "Abrir Escáner QR para sumar puntos" : " Abrir Escáner QR para sumar visitas"}
            </Button>
            {/* <Button
              variant='contained'
              onClick={() => redeemPromotion()}
              className='mt-12 md:mb-6 lg:mb-6 w-1/2 md:w-1/4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg transition duration-300'
            >
              Canjear Visitas por Beneficios
            </Button> */}
          </div>
        ) : (
          <Button
            variant='contained'
            onClick={() => setShowScanner(true)}
            className='mt-12  md:w-1/4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg transition duration-300'
          >
            Abrir Escáner QR para sumar visitas
          </Button>
        )}
        <section className='flex flex-col w-[95%] mx-6 md:mx-60  m-auto min-h-[500px]'>
          {promotionDetails.systemType === "points" ? (
            <>
              {/* Botones para cambiar entre Recompensas y Detalles */}
              <div className='flex flex-col md:flex-row md:space-y-0  md:space-x-6 md:m-auto justify-between items-center mb-4 space-y-4'>
                <Button variant={showRewards ? "contained" : "outlined"} color='primary' onClick={() => setShowRewards(true)} className='w-full'>
                  Recompensas
                </Button>
                <Button variant={!showRewards ? "contained" : "outlined"} color='primary' onClick={() => setShowRewards(false)} className='w-full'>
                  Detalles de la Promoción
                </Button>
              </div>

              {/* Si el botón está en Recompensas, mostrar solo las recompensas */}
              {showRewards ? (
                <section className='flex flex-col w-full gap-6 h-full'>
                  <div className='flex flex-col w-full space-y-6'>
                    {/* Mostrar las recompensas sin imagen */}
                    <div className='w-full mt-4'>
                      {promotionDetails.rewards.map((reward) => {
                        const progress = (promotion.pointsEarned / reward.points) * 100;
                        const canRedeem = promotion.pointsEarned >= reward.points;

                        return (
                          <div key={reward._id} className='flex flex-col w-full px-4 py-4 bg-white rounded-lg shadow-lg mb-6'>
                            {/* Título y descripción de la recompensa */}
                            <div className='flex justify-between items-center'>
                              <span className='font-bold text-lg text-gray-800'>
                                {reward.points} puntos - {reward.description}
                              </span>
                            </div>

                            {/* Barra de progreso con porcentaje */}
                            <div className='relative w-full bg-gray-300 rounded-full h-4 mt-2'>
                              <div
                                className={`absolute top-0 left-0 h-4 rounded-full ${progress >= 100 ? "bg-green-500" : "bg-main"}`}
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              ></div>

                              {/* Mostrar el porcentaje en el centro de la barra */}
                              <span className='absolute inset-0 flex items-center justify-center text-white font-semibold'>
                                {Math.min(progress, 100).toFixed(0)}%
                              </span>
                            </div>

                            {/* Botón de canjear */}
                            <div className='mt-4'>
                              {canRedeem ? (
                                <Button
                                  variant='contained'
                                  onClick={() => console.log("Redeem")}
                                  className='w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition ease-in-out duration-300'
                                >
                                  Canjear
                                </Button>
                              ) : (
                                <span className='text-sm text-gray-500 block text-center mt-2'>Faltan {reward.points - promotion.pointsEarned} puntos</span>
                              )}
                            </div>

                            {/* Divisor */}
                            <div className='w-full border-t border-gray-600 mt-6'></div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>
              ) : (
                // Si el botón está en Detalles, mostrar los detalles completos
                <div className='mt-4 w-full md:w-1/2 space-y-6'>
                  <h1 className='mt-4 font-bold text-left font-poppins text-4xl'>{promotionDetails.title}</h1>
                  <h2 className='text-lg font-normal'>Detalles de la Promoción</h2>
                  <p
                    className='mt-2 w-full'
                    dangerouslySetInnerHTML={{
                      __html: promotionDetails.description.replace(/\r\n|\r|\n/g, "<br />"),
                    }}
                  />
                  <p className='mt-2'>Tipo: {promotionDetails.systemType === "points" ? "Puntos" : "Visitas"}</p>
                  <div className='w-full text-center border rounded-xl'>
                    <div className='relative w-full h-full aspect-[16/9]'>
                      <img src={promotionDetails.imageUrl} alt='Promotion' className='w-full h-full object-cover rounded-xl' />
                    </div>
                  </div>
                </div>
              )}
            </>
          ) : (
            // Si no es "points", mostrar solo los detalles de la promoción
            <div className='mt-4 w-full md:w-1/2 space-y-6'>
              <h1 className='mt-4 font-bold text-left font-poppins text-4xl'>{promotionDetails.title}</h1>
              <h2 className='text-lg font-normal'>Detalles de la Promoción</h2>
              <p
                className='mt-2 w-full'
                dangerouslySetInnerHTML={{
                  __html: promotionDetails.description.replace(/\r\n|\r|\n/g, "<br />"),
                }}
              />
              <p className='mt-2'>Tipo: {promotionDetails.systemType === "points" ? "Puntos" : "Visitas"}</p>
              <div className='w-full text-center border rounded-xl'>
                <div className='relative w-full h-full aspect-[16/9]'>
                  <img src={promotionDetails.imageUrl} alt='Promotion' className='w-full h-full object-cover rounded-xl' />
                </div>
              </div>
            </div>
          )}
        </section>
        <Dialog open={showPopup} onClose={closePopup}>
          <DialogTitle>¡Promoción Completada!</DialogTitle>
          <DialogContent>
            <Lottie options={defaultOptions} height={200} width={200} />
            <p>La promoción ha sido completada exitosamente.</p>
            {promotion.promotionRecurrent === "True" ? (
              <>
                <p>Esta promoción ha sido marcada como recurrente, ¿deseas volver a iniciarla?</p>
                <Button onClick={restartPromotion()} variant='contained' className='mt-2 mr-2'>
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
                    <Scanner onScan={handleScanComplete} components={{ audio: false }} className='w-full h-full' />
                  ) : (
                    <Scanner onScan={handleScan} components={{ audio: false }} className='w-full h-full' />
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
                <Button onClick={restartPromotion()} variant='contained' className='mt-2 mr-2'>
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
