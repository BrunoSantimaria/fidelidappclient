import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControlLabel,
  Switch,
  Divider,
  DialogActions,
  Card,
  CardContent,
  CardHeader,
  CardActions,
  Typography,
  Badge,
  Tab,
  Tabs,
  Box,
  LinearProgress,
  IconButton,
} from "@mui/material";
import {
  Facebook,
  Favorite,
  FavoriteBorder,
  Instagram,
  WhatsApp,
  Language as LanguageRounded,
  Person as User,
  CalendarToday as Calendar,
  QrCode,
} from "@mui/icons-material";
import { toast } from "react-toastify";
import Lottie from "react-lottie";
import celebrationAnimation from "../../assets/celebration.json";
import keyUrl from "../../assets/fondocandado2.png";
import { Scanner } from "@yudiel/react-qr-scanner";
import { Helmet } from "react-helmet-async";
import api from "../../utils/api";
import { motion, AnimatePresence } from "framer-motion";
import ClientPromotionsTable from "../components/ClientPromotionsTable";


const marioCoinSound = "https://themushroomkingdom.net/sounds/wav/smb/smb_coin.wav";
const marioStarSound = "https://themushroomkingdom.net/sounds/wav/smb2/smb2_grow.wav";
const marioNewLifeSound = "https://themushroomkingdom.net/sounds/wav/smb/smb_1-up.wav";

// Agregar esta función antes del componente ClientPromotionCard
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

// Después de la función formatDate y antes del componente ClientPromotionCard
const generateIcons = (actualVisits: number, requiredVisits: number) => {
  const icons = [];
  for (let i = 0; i < requiredVisits; i++) {
    icons.push(
      <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.1 }}>
        {i < actualVisits ? <Favorite sx={{ color: "#5b7898", fontSize: 32 }} /> : <FavoriteBorder sx={{ color: "#5b7898", fontSize: 32 }} />}
      </motion.div>
    );
  }
  return icons;
};

// Después de generateIcons y antes del componente ClientPromotionCard
const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData: celebrationAnimation,
  rendererSettings: {
    preserveAspectRatio: "xMidYMid slice",
  },
};

export const ClientPromotionCard = () => {
  // ... mantener todos los estados existentes ...
  const { cid, pid } = useParams();
  const [promotion, setPromotion] = useState({
    status: "",
    pointsEarned: 0,
    actualVisits: 0,
    // ... otros campos
  });
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
  const [tabValue, setTabValue] = useState(0);
  const [rewardToConfirm, setRewardToConfirm] = useState(null);
  const [clientPromotions, setClientPromotions] = useState([]);

  const handleOpenConfirmDialog = () => setOpenConfirmDialog(true);
  const handleCloseConfirmDialog = () => {
    setOpenConfirmDialog(false);
  };
  const handleOpenSuccessDialog = () => setOpenSuccessDialog(true);
  const handleCloseSuccessDialog = () => {
    setOpenSuccessDialog(false);
    setRewardToConfirm(null);
    window.location.reload();
  };

  // Lógica principal - useEffect
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
        setClientPromotions(response.data.clientPromotions);

        const userResponse = await api.get("/auth/current");
        setUser(userResponse.data);
        setLoading(false);

        // Manejo de estados de la promoción
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

  // Función para actualizar puntos/visitas
  const updatePromotionProgress = (type: "points" | "visit", amount: number) => {
    setPromotion((prev) => ({
      ...prev,
      pointsEarned: type === "points" ? prev.pointsEarned + amount : prev.pointsEarned,
      actualVisits: type === "visit" ? prev.actualVisits + amount : prev.actualVisits,
    }));
  };

  // Funciones de manejo de QR y escaneo
  const handleScan = async (result) => {
    setProcessing(true);

    if (!result) {
      toast.error("No se pudo leer el código QR");
      setProcessing(false);
      setShowScanner(false);
      return;
    }

    const accountQr = result[0].rawValue;

    try {
      if (promotion.systemType === "points") {
        const response = await api.post("/api/promotions/redeem-points", {
          clientEmail: client.email,
          promotionId: pid,
          accountQr,
        });
        updatePromotionProgress("points", response.data.pointsEarned || 1);
      } else {
        await api.post("/api/promotions/visit", {
          clientEmail: client.email,
          promotionId: pid,
          accountQr,
        });
        updatePromotionProgress("visit", 1);
      }

      toast.success("Visita registrada con éxito");
      const audio = new Audio(marioCoinSound);
      audio.play().catch((error) => console.error("Error al reproducir el audio:", error));
    } catch (error) {
      if (error.response?.data?.error === "Ya has registrado una visita hoy") {
        toast.info("Ya visitaste el día de hoy. ¡Vuelve mañana para más!");
      } else {
        toast.error("Error al validar la visita!");
      }
      console.error("Error al registrar la visita o puntos:", error);
    } finally {
      setProcessing(false);
      setShowScanner(false);
    }
  };

  const handleScanComplete = async (result) => {
    try {
      await api.post("/api/promotions/complete", {
        clientEmail: client.email,
        promotionId: pid,
      });
      toast.success("Promoción completada con éxito, la página se refrescará en 3 segundos.");

      const audio = new Audio(marioStarSound);
      await audio.play().catch((error) => console.error("Error al reproducir el audio:", error));

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    } catch (error) {
      const errorMessage = error.response?.data?.error;
      if (errorMessage === "Point already redeemed today") {
        return toast.info("Ya visitaste el día de hoy. ¡Vuelve mañana para más!");
      }
      toast.error("Error al validar la visita!");
    }
    setProcessing(false);
    setShowScanner(false);
  };

  // Función para reiniciar la promoción
  const restartPromotion = async () => {
    try {
      handleOpenConfirmDialog();
    } catch (error) {
      toast.error(error.response?.data?.error || "Error al reiniciar la promoción.");
    }
  };

  // Función para iniciar el proceso de canje
  const handleRedeem = (reward) => {
    setRewardToConfirm(reward);
    handleOpenConfirmDialog();
  };

  // Función para confirmar el canje
  const handleConfirmRestart = async () => {
    if (rewardToConfirm) {
      try {
        await api.post("/api/promotions/redeemPromotion", {
          promotionId: pid,
          clientEmail: client.email,
          rewardId: rewardToConfirm._id,
        });

        setPromotion((prev) => ({
          ...prev,
          pointsEarned: prev.pointsEarned - rewardToConfirm.points,
        }));

        handleCloseConfirmDialog();
        handleOpenSuccessDialog();
      } catch (error) {
        console.error("Error en el canje:", error);
        toast.error("Hubo un error al canjear la promoción. Inténtalo de nuevo.");
      }
    } else {
      // Lógica original para reiniciar promoción
      try {
        await api.post("/api/promotions/restart", {
          clientEmail: client.email,
          promotionId: pid,
        });

        setPromotion((prev) => ({
          ...prev,
          status: "Active",
          pointsEarned: 0,
          actualVisits: 0,
        }));

        toast.success("Promoción reiniciada con éxito");
        const audio = new Audio(marioNewLifeSound);
        await audio.play().catch((error) => console.error("Error al reproducir el audio:", error));

        handleCloseConfirmDialog();
      } catch (error) {
        toast.error(error.response?.data?.error || "Error al reiniciar la promoción.");
      }
    }
  };

  const handleRedirect = (id) => {
    console.log(`Redirecting to promotion with ID: ${id}`);
    // Implement navigation logic here
  };

  // Loading state
  if (loading) {
    return (
      <Container className='flex items-center justify-center h-screen bg-white'>
        <div className='text-center'>
          <p>Cargando detalles de la promoción...</p>
        </div>
      </Container>
    );
  }

  // Error state
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
        <title>FidelidCard: {promotionDetails.title || "Fidelidapp"}</title>
        <meta name='description' content={promotionDetails.description || "Detalles de la promoción"} />
        <meta property='og:title' content={promotionDetails.title || "Fidelidapp"} />
        <meta property='og:description' content={promotionDetails.description || "Detalles de la promoción"} />
        <meta property='og:url' content={`https://www.fidelidapp.cl/promotions/${pid}`} />
      </Helmet>

      <div className='container  w-screen flex flex-col '>
        <Card className='border-[#5b7898] border-t-4  w-screen shadow-lg flex-1'>
          <CardHeader
            sx={{
              bgcolor: "#5b7898",
              color: "white",
              p: 3,
            }}
            title={
              <div className='flex flex-col space-y-2'>
                <div className='flex items-center space-x-2'>
                  <User fontSize='small' />
                  <span className='text-sm md:text-base truncate'>{client?.email}</span>
                </div>
              </div>
            }
          />

          <CardContent sx={{ p: 3 }}>
            {/* Stats Grid */}
            <Box className='grid grid-cols-2 md:grid-cols-5 gap-4 text-sm mb-6'>
              <div className='space-y-1'>
                <Typography color='textSecondary' variant='caption'>
                  Estado
                </Typography>
                <div className='font-medium flex items-center space-x-1'>
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${promotion.status === "Active" ? "bg-green-500" : promotion.status === "Expired" ? "bg-red-500" : "bg-yellow-500"
                      }`}
                  />
                  <span>{promotion.status}</span>
                </div>
              </div>
              <div className='space-y-1'>
                <Typography color='textSecondary' variant='caption'>
                  Canjes Realizados
                </Typography>
                <div className='font-medium'>{promotion.redeemCount}</div>
              </div>
              {promotionDetails.systemType !== "points" && (
                <div className='space-y-1'>
                  <span>Visitas</span>
                  <div className='flex space-x-1'>{generateIcons(promotion.actualVisits, promotionDetails.visitsRequired)}</div>
                </div>
              )}
              {promotionDetails.systemType === "points" && (
                <div className='space-y-1'>
                  <Typography color='textSecondary' variant='caption'>
                    Puntos Ganados
                  </Typography>
                  <div className='font-medium'>{promotion.pointsEarned}</div>
                </div>
              )}
              <div className='space-y-1'>
                <Typography color='textSecondary' variant='caption'>
                  Fecha de Registro
                </Typography>
                <div className='font-medium flex items-center space-x-1'>
                  <Calendar fontSize='small' />
                  <span>{formatDate(promotion.addedDate)}</span>
                </div>
              </div>
              <div className='space-y-1'>
                <Typography color='textSecondary' variant='caption'>
                  Fin de Vigencia
                </Typography>
                <div className='font-medium flex items-center space-x-1'>
                  <Calendar fontSize='small' />
                  <span>{formatDate(promotion.endDate)}</span>
                </div>
              </div>
            </Box>

            {/* Contenido principal - Solo mostrar si no es sistema de puntos o si estamos en la vista de detalles */}
            {promotionDetails.systemType !== "points" && (
              <div className='flex flex-col md:flex-row gap-4'>
                <div className='flex-1'>
                  <div className='flex flex-col'>
                    <span className='font-bold text-main font-lato text-xl md:text-3xl'>{promotionDetails.title}</span>
                  </div>
                  <Typography variant='body1' paragraph>
                    {promotionDetails.description}
                  </Typography>
                </div>

                {imageUrl && (
                  <div className='w-full md:w-1/3'>
                    <Box className='w-full aspect-video rounded-lg overflow-hidden'>
                      <img src={imageUrl} alt='Promoción' className='w-full h-full object-cover' />
                    </Box>
                  </div>
                )}
              </div>
            )}

            {/* Botón de escanear QR - Modificar la condición */}
            {promotion.status !== "Expired" && promotion.status !== "Redeemed" && (
              <Box sx={{ my: 3 }}>
                <Button
                  fullWidth
                  variant='contained'
                  onClick={() => setShowScanner(true)}
                  startIcon={<QrCode />}
                  sx={{
                    bgcolor: "#5b7898",
                    "&:hover": { bgcolor: "#4a6277" },
                  }}
                >
                  {promotion.status === "Pending"
                    ? "Canjear Promoción"
                    : `Abrir Escáner QR para ${promotionDetails.systemType === "points" ? "Sumar Puntos" : "Registrar Visita"}`}
                </Button>
              </Box>
            )}

            {/* Agregar el botón de canjear y animación cuando se completan las visitas */}

            {/* Sistema de Puntos/Visitas */}
            {promotionDetails.systemType === "points" ? (
              <>
                <Tabs value={showRewards ? 0 : 1} onChange={(_, newValue) => setShowRewards(newValue === 0)} sx={{ mb: 3 }}>
                  <Tab label='Recompensas' />
                  <Tab label='Detalles de la Promoción' />
                </Tabs>

                {showRewards ? (
                  <Box className='space-y-4'>
                    {promotionDetails.rewards.map((reward, index) => {
                      const progress = (promotion.pointsEarned / reward.points) * 100;
                      return (
                        <Card key={index} variant='outlined' sx={{ p: 2 }}>
                          <Box className='space-y-2'>
                            <div className='flex justify-between items-center'>
                              <Typography variant='subtitle1' component='h3'>
                                {reward.points} puntos
                              </Typography>
                              <Typography variant='caption' color='textSecondary'>
                                Faltan {reward.points - promotion.pointsEarned} puntos
                              </Typography>
                            </div>
                            <LinearProgress variant='determinate' value={Math.min(progress, 100)} sx={{ height: 8, borderRadius: 1 }} />
                            <Typography variant='body2'>{reward.description}</Typography>
                            {progress >= 100 && (
                              <Button fullWidth variant='contained' onClick={() => handleRedeem(reward)} sx={{ mt: 1 }}>
                                Canjear Recompensa
                              </Button>
                            )}
                          </Box>
                        </Card>
                      );
                    })}

                    {/* Lista de promociones del cliente */}
                    <div className='flex flex-col md:flex-row gap-4'>
                      <div className='flex-1'>
                        <div className='flex flex-col'>
                          <span className='font-bold text-main font-lato text-xl md:text-3xl'>Tus otras promociones </span>
                        </div>
                      </div>
                    </div>

                    <ClientPromotionsTable clientPromotions={clientPromotions} onRedirect={handleRedirect} />


                    {/* Social Media y Logo centrados */}
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mt: 4 }}>
                      {socialMedia?.logo && <img src={socialMedia.logo} alt='Logo' className='w-32 h-32 object-contain mb-2' />}
                      {(socialMedia?.instagram || socialMedia?.facebook || socialMedia?.whatsapp || socialMedia?.website) && (
                        <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                          {socialMedia.instagram && (
                            <IconButton href={socialMedia.instagram} target='_blank' sx={{ color: "#5b7898" }}>
                              <Instagram />
                            </IconButton>
                          )}
                          {socialMedia.facebook && (
                            <IconButton href={socialMedia.facebook} target='_blank' sx={{ color: "#5b7898" }}>
                              <Facebook />
                            </IconButton>
                          )}
                          {socialMedia.whatsapp && (
                            <IconButton href={`https://wa.me/${socialMedia.whatsapp}`} target='_blank' sx={{ color: "#5b7898" }}>
                              <WhatsApp />
                            </IconButton>
                          )}
                          {socialMedia.website && (
                            <IconButton href={socialMedia.website} target='_blank' sx={{ color: "#5b7898" }}>
                              <LanguageRounded />
                            </IconButton>
                          )}
                        </Box>
                      )}
                    </Box>
                  </Box>
                ) : (
                  <Box className='space-y-4'>
                    <Typography variant='body1' paragraph>
                      {promotionDetails.description}
                    </Typography>
                    {imageUrl && (
                      <Box className='w-full aspect-video rounded-lg overflow-hidden'>
                        <img src={imageUrl} alt='Promoción' className='w-full h-full object-cover' />
                      </Box>
                    )}
                  </Box>
                )}
              </>
            ) : (
              ""
            )}
          </CardContent>
          {(promotion.status === "Completed" || promotion.status === "Redeemed") && promotionDetails.promotionRecurrent === "True" && (
            <Box sx={{ my: 3, display: "flex", justifyContent: "center" }}>
              <Button
                variant='contained'
                onClick={restartPromotion}
                sx={{
                  bgcolor: "#5b7898",
                  "&:hover": { bgcolor: "#4a6277" },
                  width: "auto",
                  px: 4,
                }}
              >
                Reiniciar Promoción
              </Button>
            </Box>
          )}
        </Card>

        {/* QR Scanner Dialog */}
        <Dialog open={showScanner} onClose={() => setShowScanner(false)} fullWidth maxWidth='sm'>
          <DialogTitle>Escáner de Código QR</DialogTitle>
          <DialogContent>
            {processing ? (
              <Box sx={{ p: 3, textAlign: "center" }}>
                <Typography>Procesando...</Typography>
              </Box>
            ) : (
              <Box className='w-full h-[500px] bg-gray-900 rounded-lg overflow-hidden'>
                <Scanner
                  scanDelay={1000}
                  onScan={promotion.status === "Pending" ? handleScanComplete : handleScan}
                  components={{ audio: false }}
                  className='w-full h-full'
                />
              </Box>
            )}
          </DialogContent>
        </Dialog>

        {/* Diálogo de confirmación */}
        <Dialog open={openConfirmDialog} onClose={handleCloseConfirmDialog}>
          <DialogTitle>{rewardToConfirm ? "Confirmar Canje" : "Confirmar Reinicio"}</DialogTitle>
          <DialogContent>
            <Typography>
              {rewardToConfirm
                ? `¿Estás seguro de que deseas canjear ${rewardToConfirm.points} puntos por: ${rewardToConfirm.description}?`
                : "¿Estás seguro de que deseas reiniciar la promoción?"}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseConfirmDialog}>Cancelar</Button>
            <Button onClick={handleConfirmRestart} color='primary'>
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Diálogo de éxito */}
        <Dialog open={openSuccessDialog} onClose={handleCloseSuccessDialog} maxWidth='sm' fullWidth>
          <DialogTitle sx={{ textAlign: "center" }}>¡Felicidades!</DialogTitle>
          <DialogContent>
            <Box sx={{ textAlign: "center", py: 2 }}>
              <Lottie options={defaultOptions} height={150} width={150} />
              <Typography variant='h6' gutterBottom>
                Has canjeado exitosamente:
              </Typography>
              <Typography variant='body1' gutterBottom>
                {rewardToConfirm?.description}
              </Typography>
              <Typography variant='body1' color='primary' sx={{ mt: 2, fontWeight: "bold" }}>
                Por {rewardToConfirm?.points} puntos
              </Typography>
              <Typography
                variant='body2'
                sx={{
                  mt: 3,
                  color: "text.secondary",
                  bgcolor: "#f5f5f5",
                  p: 2,
                  borderRadius: 1,
                }}
              >
                Muestra este mensaje al negocio para validar tu canje
              </Typography>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseSuccessDialog} variant='contained' fullWidth sx={{ m: 2 }}>
              Entendido
            </Button>
          </DialogActions>
        </Dialog>

        {/* Agregar botón de reiniciar cuando la promoción está completada y es recurrente */}
      </div>
    </>
  );
};
