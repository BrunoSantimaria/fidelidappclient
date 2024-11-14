import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, Container, Dialog, DialogTitle, DialogContent, FormControlLabel, Switch, Divider, DialogActions } from "@mui/material";
import { toast } from "react-toastify";
import { Facebook, Favorite, FavoriteBorder, Instagram, WhatsApp, LanguageRounded } from "@mui/icons-material";

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
  const [socialMedia, setSocialMedia] = useState(null);
  const [showScanner, setShowScanner] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [openSuccessDialog, setOpenSuccessDialog] = useState(false);

  // Estado para controlar la confirmación de canje

  // Manejo de la apertura y cierre de diálogos
  const handleOpenConfirmDialog = () => setOpenConfirmDialog(true);
  const handleCloseConfirmDialog = () => setOpenConfirmDialog(false);

  const handleOpenSuccessDialog = () => setOpenSuccessDialog(true);
  const handleCloseSuccessDialog = () => {
    setOpenSuccessDialog(false);
    window.location.reload(); // Recargar la página después de cerrar el diálogo
  };

  const handleRedeem = async (reward) => {
    console.log(reward);
    try {
      // Realizar la petición POST para canjear la promoción
      const response = await api.post("/api/promotions/redeemPromotion", {
        promotionId: pid,
        clientEmail: client.email,
        rewardId: reward._id,
      });

      // Mostrar el diálogo de éxito
      handleCloseConfirmDialog();
      handleOpenSuccessDialog();

      toast.success("Promoción canjeada con éxito!");
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Hubo un error al canjear la promoción. Inténtalo de nuevo.");
    }
  };
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

    if (!result) {
      toast.error("No se pudo leer el código QR");
      setProcessing(false);
      setShowScanner(false);
      return;
    }

    const accountQr = result[0].rawValue;
    console.log(client.email, pid, accountQr);

    try {
      if (promotion.systemType === "points") {
        await api.post("/api/promotions/redeem-points", {
          clientEmail: client.email,
          promotionId: pid,
          accountQr,
        });
      } else {
        await api.post("/api/promotions/visit", {
          clientEmail: client.email,
          promotionId: pid,
          accountQr,
        });
      }

      toast.success("Visita registrada con éxito. La página se refrescará en 3 segundos.");
      const audio = new Audio(marioCoinSound);
      audio.play().catch((error) => console.error("Error al reproducir el audio:", error));

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      const errorMessage = error.response?.data?.error;
      if (errorMessage === "Point already redeemed today") return toast.info("Ya visitaste el día de hoy. ¡Vuelve mañana para más!");

      toast.error("Error al validar la visita!");
      console.error("Error al registrar la visita o puntos:", error);
      toast.error("Error al validar la visita!");
    } finally {
      setProcessing(false);
      setShowScanner(false);
    }
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
      const errorMessage = error.response?.data?.error;
      if (errorMessage === "Point already redeemed today") return toast.info("Ya visitaste el día de hoy. ¡Vuelve mañana para más!");

      toast.error("Error al validar la visita!");
    }

    setProcessing(false);
    setShowScanner(false);
  };

  useEffect(() => {
    const fetchPromotionDetails = async () => {
      try {
        const response = await api.get(`/api/promotions/${cid}/${pid}`);
        console.log(response.data.socialMedia);
        setPromotion(response.data.promotion);
        setSocialMedia(response.data.socialMedia);
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
  console.log(socialMedia.website);
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
        {promotion.status === "Redeemed" ? (
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
          <div className='flex flex-col space-y-4 mb-6 w-full items-center justify-center'>
            {promotion.status !== "Expired" && (
              <>
                <Button
                  variant='contained'
                  onClick={() => setShowScanner(true)}
                  className='mt-16 w-[95%] md:w-1/4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-lg transition duration-300'
                >
                  {promotionDetails.systemType === "points" ? "Abrir Escáner QR para sumar puntos" : "Abrir Escáner QR para sumar visitas"}
                </Button>
                <hr></hr>
              </>
            )}
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
                <Button variant={showRewards ? "contained" : "outlined"} color='primary' onClick={() => setShowRewards(true)} className='w-full md:min-h-20'>
                  Recompensas
                </Button>
                <Button variant={!showRewards ? "contained" : "outlined"} color='primary' onClick={() => setShowRewards(false)} className='w-full md:min-h-20'>
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
                                <>
                                  <Button
                                    variant='contained'
                                    onClick={handleOpenConfirmDialog}
                                    className='w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-md transition ease-in-out duration-300'
                                  >
                                    Canjear
                                  </Button>

                                  {/* Confirmación de canje */}
                                  <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
                                    <DialogTitle>Confirmar Canje</DialogTitle>
                                    <DialogContent>
                                      <p>
                                        Estás a punto de canjear {reward.points} puntos por la promoción: "{reward.description}".
                                      </p>
                                      <p>¿Estás seguro de que quieres continuar?</p>
                                    </DialogContent>
                                    <DialogActions>
                                      <Button onClick={handleCloseConfirmDialog} color='primary'>
                                        Cancelar
                                      </Button>
                                      <Button onClick={() => handleRedeem(reward)} color='primary'>
                                        Confirmar
                                      </Button>
                                    </DialogActions>
                                  </Dialog>

                                  {/* Diálogo de éxito */}
                                  <Dialog open={openSuccessDialog} onClose={handleCloseSuccessDialog}>
                                    <DialogTitle>¡Felicidades!</DialogTitle>
                                    <DialogContent>
                                      <p>
                                        Has canjeado {reward.points} puntos por la promoción: "{reward.description}".
                                      </p>
                                      <p>Este mensaje será mostrado al vendedor para validar el canje.</p>
                                    </DialogContent>
                                    <DialogActions>
                                      <Button onClick={handleCloseSuccessDialog} color='primary'>
                                        OK
                                      </Button>
                                    </DialogActions>
                                  </Dialog>
                                </>
                              ) : (
                                <span className='text-sm text-gray-500 block text-center mt-2'>Faltan {reward.points - promotion.pointsEarned} puntos</span>
                              )}
                            </div>

                            {/* Divisor */}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </section>
              ) : (
                // Si el botón está en Detalles, mostrar los detalles completos
                <div className='mt-4 md:mt-0 w-full md:w-1/2 space-y-6'>
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
            <div className='mt-4 w-full flex flex-col md:flex-row md:w-[95%] space-y-6 justify-center m-auto pb-20'>
              <div>
                <h1 className='mt-4 font-bold text-left font-poppins text-4xl'>{promotionDetails.title}</h1>
                <h2 className='text-lg font-normal'>Detalles de la Promoción</h2>
                <p
                  className='mt-2 w-full'
                  dangerouslySetInnerHTML={{
                    __html: promotionDetails.description.replace(/\r\n|\r|\n/g, "<br />"),
                  }}
                />
                <p className='mt-2'>Tipo: {promotionDetails.systemType === "points" ? "Puntos" : "Visitas"}</p>
              </div>
              <div className='w-full  text-center border rounded-xl'>
                <div className='relative w-full h-full aspect-[16/9]'>
                  <img src={promotionDetails.imageUrl} alt='Promotion' className='w-full h-full object-cover rounded-xl' />
                </div>
              </div>
              <hr></hr>
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
                    <Scanner scanDelay={1000} onScan={handleScanComplete} components={{ audio: false }} className='w-full h-full' />
                  ) : (
                    <Scanner scanDelay={1000} onScan={handleScan} components={{ audio: false }} className='w-full h-full' />
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

        <footer className='flex flex-col w-full md:flex-row items-center justify-center space-y-6 md:space-x-20 mt-2 p-6'>
          <div>{socialMedia && <div className='bg-gray-600/20 w-full border-1 h-1' />}</div>
          {/* Logo */}
          {socialMedia.logo && (
            <div className='flex justify-center md:justify-start'>
              <img
                src={socialMedia.logo}
                alt='Logo'
                className='max-w-full max-h-20 md:max-h-36 mb-4 object-contain'
                style={{ width: "auto", height: "auto" }}
              />
            </div>
          )}

          {/* Social Media Links */}
          {(socialMedia.instagram || socialMedia.facebook || socialMedia.whatsapp) && (
            <div className='flex space-x-4 justify-center md:justify-start'>
              {/* Instagram */}
              {socialMedia.instagram && (
                <a href={socialMedia.instagram} target='_blank' rel='noopener noreferrer'>
                  <Instagram sx={{ fontSize: 40 }} className='text-main hover:text-main/80 duration-300' />
                </a>
              )}

              {/* Facebook */}
              {socialMedia.facebook && (
                <a href={socialMedia.facebook} target='_blank' rel='noopener noreferrer'>
                  <Facebook sx={{ fontSize: 40 }} className='text-main hover:text-main/80 duration-300' />
                </a>
              )}

              {/* WhatsApp */}
              {socialMedia.whatsapp && (
                <a href={`https://wa.me/${socialMedia.whatsapp}`} target='_blank' rel='noopener noreferrer'>
                  <WhatsApp sx={{ fontSize: 40 }} className='text-main hover:text-main/80 duration-300' />
                </a>
              )}
              {socialMedia.website && (
                <a href={socialMedia.website} target='_blank' rel='noopener noreferrer'>
                  <LanguageRounded sx={{ fontSize: 40 }} className='text-main hover:text-main/80 duration-300' />
                </a>
              )}
            </div>
          )}
        </footer>
      </Container>
    </>
  );
};
