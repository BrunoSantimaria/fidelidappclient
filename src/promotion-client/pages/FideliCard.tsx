"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CreditCard, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import api from "@/utils/api";
import { useAuth } from "../utils/AuthContext";
import { useNavigateTo } from "@/hooks/useNavigateTo";
import { useParams } from "react-router-dom";
import { Alert } from "@mui/material";
import QrCode2RoundedIcon from "@mui/icons-material/QrCode2Rounded";
import { Toaster } from "@/components/ui/toaster";
import { Activities } from "../components/FideliCard";
import { Scanner } from "@yudiel/react-qr-scanner";
import { sortPromotions } from "../utils/SortPromotions";
import { Badge } from "@/components/ui/badge";
import { toast as toastify } from "react-toastify";
import moment from "moment";

export default function FideliCard() {
  const { slug, clientId } = useParams();
  const { authData, getClientId, logout } = useAuth();
  console.log("🚀 ~ FideliCard ~ authData:", authData);
  const { handleNavigate } = useNavigateTo();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    totalPoints: 0,
  });
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [selectedReward, setSelectedReward] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showRedemptionDialog, setShowRedemptionDialog] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [loadingRedeem, setLoadingRedeem] = useState(false);
  const [activities, setActivities] = useState([]);
  const [promotions, setPromotions] = useState([]);
  const [hasPointPromotion, setHasPointPromotion] = useState("");
  // Check if a promotion is currently active

  const fetchFideliCardData = async () => {
    try {
      const resp = await api.get(`/api/landing/${slug}`);

      console.log("🚀 ~ fetchFideliCardData ~ resp:", resp);
      const accountId = resp.data._id;

      if (!accountId) {
        throw new Error("No logged-in account found");
      }

      const clientId = getClientId(accountId);
      const userEmail = authData[accountId].userId;

      if (!userEmail || !clientId) {
        throw new Error("No user email or client ID found");
      }

      const response = await api.get(`/api/landing/${slug}/fidelicard`, {
        params: { email: clientId, accountId: userEmail },
      });

      const { name, email, phoneNumber, totalPoints, activities: userActivities, addedPromotions: availablePromotions } = response.data;

      setUserDetails({
        name,
        email,
        phoneNumber,
        totalPoints,
      });
      setActivities(userActivities);
      setPromotions(availablePromotions);

      const activePointPromotion = availablePromotions.find((promotion) => {
        console.log(promotion.promotion.systemType, promotion.promotion.status); // Verifica los valores
        return promotion.promotion.systemType.toLowerCase().trim() === "points" && promotion.promotion.status.toLowerCase().trim() === "active";
      });

      setHasPointPromotion(activePointPromotion);

      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching FideliCard data:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos de la FideliCard",
        variant: "destructive",
      });
      setIsLoading(false);
      handleNavigate(`/landing/${slug}`);
    }
  };
  const refreshFideliCardData = async () => {
    try {
      const freshData = await fetchFideliCardData();
      setUserDetails(freshData.userDetails);
      setActivities(freshData.activities);
      setPromotions(freshData.promotions);
    } catch (error) {
      console.error("Failed to refresh data", error);
    }
  };
  const isPromotionHot = (promotion) => {
    const today = new Date().getDay();

    const adjustedToday = today === 0 ? 7 : today;

    return promotion?.promotion.status?.toLowerCase() === "active" && promotion.promotion.daysOfWeek.includes(adjustedToday);
  };
  const confirmRedeem = async () => {
    try {
      setLoadingRedeem(true);
      console.log("Selected Promotion in Confirm:", selectedPromotion);
      console.log("Selected Reward in Confirm:", selectedReward);

      // Verificar si el systemType es 'visits'
      if (selectedPromotion?.promotion?.systemType === "visits") {
        console.log("El tipo de sistema es 'visits', no se utilizará recompensa basada en puntos.");

        // Si es una promoción de tipo 'visits', no se requiere recompensa basada en puntos
        if (!selectedReward) {
          console.log("No se necesita recompensa para la promoción de visitas.");
        }

        const resp = await api.get(`/api/landing/${slug}`);
        const accountId = resp.data._id;
        const clientId = getClientId(accountId);
        const userEmail = authData[accountId].userId;

        // Realizar el canje de promoción de visitas
        const response = await api.post("/api/landing/redeem-hot-promotion", {
          email: clientId,
          accountId: accountId,
          promotionId: selectedPromotion.promotion._id,
        });
        await fetchFideliCardData();

        selectedPromotion?.promotion?.systemType === "visits"
          ? toastify.success(`Promoción canjeada con éxito.`)
          : toastify.success(`Recompensa canjeada con éxito.`);

        setShowConfirmDialog(false);
        setShowRedemptionDialog(true);
      } else if (selectedPromotion?.promotion?.systemType === "points") {
        console.log("El tipo de sistema es 'points', se requiere recompensa basada en puntos.");

        // Si es una promoción de tipo 'points', se necesita una recompensa válida seleccionada
        if (!selectedReward) {
          toast({
            title: "Error de Recompensa",
            description: "No se ha seleccionado una recompensa válida.",
            variant: "destructive",
          });
          return;
        }

        const resp = await api.get(`/api/landing/${slug}`);
        const accountId = resp.data._id;
        const clientId = getClientId(accountId);
        const userEmail = authData[accountId].userId;

        const activityToAdd = {
          type: "redeemed",
          description: selectedReward ? selectedReward.description : "Canje de visita", // Si es 'visits', no necesita descripción de recompensa
          amount: selectedReward ? selectedReward.points : 0, // 0 puntos para 'visits', puntos para 'points'
          promotionId: selectedPromotion.promotion._id,
        };

        // Realizar canje de puntos o visitas
        const response = await api.post("/api/landing/redeem-promotion-reward", {
          email: clientId,
          accountId: accountId,
          promotionId: selectedPromotion.promotion._id,
          rewardId: selectedReward?._id,
          points: selectedReward?.points || 0, // 0 puntos si es una promoción 'visits'
        });

        setShowConfirmDialog(false);
        setShowRedemptionDialog(true);
      } else {
        // Si el tipo de promoción no es 'visits' ni 'points'
        toast({
          title: "Error",
          description: "Tipo de promoción no válido.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error redeeming promotion:", error);
      toast({
        title: "Error",
        description: error.response?.data?.error || "No se pudo canjear la promoción",
        variant: "destructive",
      });
    } finally {
      await refreshFideliCardData();
      setLoadingRedeem(false);
    }
  };

  const isPromotionHot2 = (promotion) => {
    const today = new Date().getDay();

    return promotion?.status === "active" && promotion.daysOfWeek.includes(today);
  };

  const handleScan = async (result) => {
    setProcessing(true);

    if (!result) {
      toastify.error("No se pudo leer el código QR. Intenta nuevamente.");
      setProcessing(false);
      setShowScanner(false);
      return;
    }

    const accountQr = result[0].rawValue;
    console.log("🚀 ~ handleScan ~ accountQr:", accountQr);
    setProcessing(false);
    setShowScanner(false);

    try {
      const response = await api.post("/api/landing/redeem-points", {
        clientEmail: userDetails.email,
        promotionId: hasPointPromotion.promotion._id,
        accountQr,
      });
      toastify.success("Visita registrada con exito ⭐");
    } catch (error) {
      console.log(error);
      toastify.error(error.response.data.error);
    } finally {
      await refreshFideliCardData();
      setProcessing(false);
      setShowScanner(false);
    }
  };

  const sortedPromotions = sortPromotions(promotions, isPromotionHot);

  useEffect(() => {
    fetchFideliCardData();
  }, []);

  // Validate promotion and show confirmation dialog
  const handleRedeemReward = async (promotion, reward = null) => {
    console.log("Promotion:", promotion);
    console.log("Reward:", reward);

    // Validate promotion object
    if (!promotion || !promotion._id) {
      toast({
        title: "Error de Promoción",
        description: "La promoción seleccionada no es válida.",
        variant: "destructive",
      });
      return;
    }

    // Validate reward object
    if (!reward || !reward.description) {
      toast({
        title: "Error de Recompensa",
        description: "La recompensa seleccionada no es válida.",
        variant: "destructive",
      });
      return;
    }

    // Special handling for 0-point rewards
    if (reward.points === 0) {
      const hasRedeemedZeroPointReward = activities.some((activity) => activity.type === "redeemed" && activity.description === reward.description);

      if (hasRedeemedZeroPointReward) {
        toast({
          title: "Recompensa ya canjeada",
          description: "Ya has canjeado esta recompensa anteriormente.",
          variant: "destructive",
        });
        return;
      }
    } else {
      // Existing points check for non-zero point rewards
      if (userDetails.totalPoints < reward.points) {
        toast({
          title: "Puntos insuficientes",
          description: `Necesitas ${reward.points} puntos para canjear este premio. Tienes ${userDetails.totalPoints} puntos.`,
          variant: "destructive",
        });
        return;
      }
    }

    // Set selected promotion and reward
    setSelectedPromotion({
      promotion: {
        ...promotion,
        systemType: "points",
      },
      _id: promotion._id,
    });

    setSelectedReward(reward);
    setShowConfirmDialog(true);
  };

  const handleRedeemPromotion = async (promotion) => {
    console.log("🚀 ~ handleRedeemPromotion ~ promotion:", promotion);
    const daysOfWeek = [null, "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

    // Día actual ajustado al rango 1-7
    const today = new Date().getDay();
    const adjustedToday = today === 0 ? 7 : today;

    // Validar si la promoción está activa y es válida hoy
    const isHot = promotion?.status?.toLowerCase() === "active" && promotion.daysOfWeek.includes(adjustedToday);

    // Verificar si ya se canjeó una promoción del tipo "visits" hoy
    const hasRedeemedToday = promotions.some((promo) => {
      if (!promo.lastRedeemDate || promo.systemType !== "visits") return false;

      const options = {
        timeZone: "America/Santiago",
        year: "numeric",
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };

      const lastRedeemDate = new Date(promo.lastRedeemDate).toLocaleString("es-CL", options);
      const todayChile = new Date().toLocaleString("es-CL", options);

      return lastRedeemDate === todayChile;
    });

    // Validar disponibilidad de la promoción
    if (!isHot) {
      toast({
        title: "Promoción no disponible",
        description: `Esta promoción solo está disponible los días: ${promotion.daysOfWeek.map((day) => daysOfWeek[day]).join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    // Validar si ya se canjeó una promoción hoy
    if (hasRedeemedToday) {
      toast({
        title: "Promoción ya canjeada",
        description: "Ya has canjeado una promoción hoy",
        variant: "destructive",
      });
      return;
    }

    setSelectedPromotion({
      promotion: {
        ...promotion,
        systemType: "visits",
      },
    });
    setShowConfirmDialog(true);
  };

  // Modify the confirmRedeem method to handle both reward and promotion redemptions
  const getFormattedDateTimeChile = () => {
    // Crear una nueva fecha
    const now = new Date();

    // Configurar la zona horaria de Chile
    const options = {
      timeZone: "America/Santiago",
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Formato de 24 horas
    };

    // Formatear la fecha y hora
    const formattedDateTime = new Intl.DateTimeFormat("es-CL", options).format(now);

    return formattedDateTime.replace(",", ""); // Eliminar la coma si está presente
  };

  // Loading state
  if (isLoading) {
    return (
      <div className='flex justify-center items-center min-h-screen'>
        <p>Cargando datos de FideliCard...</p>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-tr from-slate-400 to-slate-700 p-4 font-sans text-gray-800'>
      <div className='max-w-4xl md:max-w-6xl lg:w-[95%] mx-auto'>
        <Toaster />
        <Card className='bg-white shadow-lg rounded-xl overflow-hidden'>
          <CardHeader className='pb-2 bg-main text-white'>
            <Button
              onClick={() => handleNavigate(`/landing/${slug}`)}
              className='inline-flex items-center w-1/3 md:w-1/6 bg-slate-600 text-white hover:text-blue-800 mb-4'
            >
              <ArrowLeft className='mr-2  text-white ' />
            </Button>
            <div className='flex justify-between items-center'>
              <CardTitle className='text-2xl font-bold'>FideliCard</CardTitle>
              <CreditCard className='h-8 w-8' />
            </div>
            <CardDescription className='text-blue-100'>{userDetails.name}</CardDescription>
          </CardHeader>
          <CardContent className='p-6'>
            <div className='grid gap-6 md:grid-cols-2'>
              <div>
                <div className='bg-blue-50 rounded-lg p-4 mb-4'>
                  <h3 className='text-lg font-semibold mb-1 text-main'>Puntos acumulados</h3>
                  <p className='text-3xl font-bold text-main'>{userDetails.totalPoints}</p>
                </div>
                {hasPointPromotion ? (
                  <>
                    <div onClick={() => setShowScanner(true)} className='p-2 bg-main font-bold text-white rounded-md text-center cursor-pointer'>
                      Abrir escaner QR <QrCode2RoundedIcon />
                    </div>
                    <Alert severity='info' className='my-6'>
                      Escanéa y suma 1 punto en cada visita.
                      <p className='font-light italic text-[12px]'>*Con la compra mínima de $20.000CLP</p>
                    </Alert>
                  </>
                ) : (
                  <>
                    <Alert severity='info'>Este negocio no cuenta con un sistema de puntos aún.</Alert>
                  </>
                )}

                <div className='space-y-4'>
                  <h3 className='text-lg font-semibold mb-2 text-gray-700'>Promociones disponibles</h3>
                  {sortedPromotions.map((promo) => {
                    const isHot = isPromotionHot(promo);

                    const daysOfWeek = [null, "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

                    // Día actual (ajustado al rango 1-7)
                    const today = new Date().getDay();
                    const normalizeText = (text) => text.toLowerCase().trim().replace(/\.$/, "");

                    const applicableDays = [...new Set(promo.promotion.daysOfWeek)] // Elimina duplicados
                      .filter((day) => day >= 1 && day <= 7) // Filtra valores fuera de rango
                      .sort((a, b) => a - b) // Ordena los días
                      .map((day) => {
                        const dayName = daysOfWeek[day];
                        return day === today ? `${dayName}` : dayName;
                      });

                    // Formatear `applicableDays` a días normalizados
                    const normalizedApplicableDays = applicableDays.map(normalizeText);

                    // Formatear `formattedDays`
                    const formattedDays =
                      applicableDays.length > 0
                        ? applicableDays.slice(0, -1).join(", ") + (applicableDays.length > 1 ? " y " : "") + applicableDays[applicableDays.length - 1] + "."
                        : "";

                    // Extraer y normalizar los días de `formattedDays`
                    const formattedDaysList = formattedDays
                      .replace(/ y /g, ",") // Cambia " y " por ","
                      .split(",") // Divide en días individuales
                      .map(normalizeText); // Normaliza cada día

                    // Verificar si algún día de `formattedDaysList` está en `normalizedApplicableDays`
                    const hasMatchingDay = formattedDaysList.some((day) => normalizedApplicableDays.includes(day));

                    return (
                      <Dialog key={promo._id}>
                        <DialogTrigger asChild>
                          <motion.div
                            className={`bg-white rounded-lg p-4 shadow-md cursor-pointer border ${
                              isHot || promo.promotion.systemType === "points" ? "border-red-500 hover:border-red-600" : "border-gray-200 hover:border-blue-500"
                            } transition-all duration-300`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className='flex justify-between items-start'>
                              <h4 className='font-semibold mb-2 text-main'>{promo.promotion.title}</h4>
                              {isHot || promo.promotion.systemType === "points" ? <Badge variant='destructive'>HOT</Badge> : ""}
                            </div>
                            <p className='text-sm text-gray-600 mb-2'>{promo.promotion.description}</p>

                            <p className={`${!formattedDays && "hidden"} text-xs text-gray-500`}>Válido: {formattedDays}</p>
                          </motion.div>
                        </DialogTrigger>

                        <DialogContent className='bg-white w-[95%] max-w-lg pt-14'>
                          <DialogHeader>
                            <DialogTitle className='text-xl'>{promo.promotion.title}</DialogTitle>
                            {promo.promotion.systemType === "points" && promo.promotion.rewards && (
                              <div className='mt-6 space-y-4'>
                                <h3 className='text-xl font-semibold text-gray-800'>Premios disponibles</h3>
                                {promo.promotion.rewards.map((reward) => {
                                  const isRewardAchievable = reward.points === 0 ? true : userDetails.totalPoints >= reward.points;

                                  // Verificar si la recompensa de 0 puntos ha sido canjeada
                                  const isRewardRedeemed = activities.some(
                                    (activity) =>
                                      activity.type === "reward_redeemed" &&
                                      activity.description === reward.description &&
                                      activity.promotionId === promo.promotion._id
                                  );
                                  const isRewarded = activities?.map(({ amount, type }) => {
                                    return amount === 0 && type === "reward_reedem";
                                  });

                                  const progress = reward.points !== 0 ? (userDetails.totalPoints / reward.points) * 100 : 100;

                                  return (
                                    <div key={reward._id} className='bg-gray-50 p-4 rounded-lg shadow-sm'>
                                      <div className='flex justify-between items-start mb-2'>
                                        <div>
                                          <h4 className='font-semibold text-lg text-gray-800'>{reward.title}</h4>
                                          <p className='text-sm text-gray-600'>{reward.description}</p>
                                        </div>
                                      </div>
                                      <div className='mt-3'>
                                        {reward.points === 0 ? (
                                          <Alert severity='success'>¡Recompensa gratis por registro!</Alert>
                                        ) : (
                                          <>
                                            <div className='flex justify-between text-sm text-gray-600 mb-1'>
                                              <span>{userDetails.totalPoints} pts</span>
                                              <span className='text-main font-bold'>{reward.points} pts</span>
                                            </div>
                                            <div className='w-full bg-gray-200 rounded-full h-2.5'>
                                              <div
                                                className={`h-2.5 rounded-full ${isRewardAchievable ? "bg-green-500" : "bg-blue-500"}`}
                                                style={{ width: `${Math.min(progress, 100)}%` }}
                                              ></div>
                                            </div>
                                          </>
                                        )}
                                      </div>

                                      {/* Mostrar mensaje si la recompensa de 0 puntos ya ha sido canjeada */}
                                      {reward.points === 0 && isRewardRedeemed ? (
                                        <p className='mt-2 text-sm text-gray-500'>Promoción única ya canjeada</p>
                                      ) : (
                                        <Button
                                          onClick={() => {
                                            console.log("Reward clicked:", reward);
                                            console.log("Promotion:", promo.promotion);
                                            console.log("Is Reward Achievable:", isRewardAchievable);
                                            setSelectedReward(reward);
                                            handleRedeemReward(promo.promotion, reward);
                                          }}
                                          disabled={!isRewardAchievable || (reward.points === 0 && isRewarded.length)}
                                          className={`mt-3 w-full ${
                                            isRewardAchievable && !(reward.points === 0 && isRewardRedeemed)
                                              ? "bg-green-500 hover:bg-green-600 text-white"
                                              : "bg-gray-300 text-gray-600 cursor-not-allowed"
                                          }`}
                                        >
                                          {reward.points === 0 && isRewarded.length
                                            ? "Promoción única ya canjeada"
                                            : isRewardAchievable
                                            ? "Canjear"
                                            : `Te faltan ${reward.points - userDetails.totalPoints} pts`}
                                        </Button>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                            {/* Conditional Alert for Non-Applicable Days */}
                            {!isHot && promo.promotion.systemType === "visits" && (
                              <Alert severity='warning' className='mt-4 h-fit'>
                                Esta promoción solo está disponible los días: {formattedDays}. Hoy ({daysOfWeek[today]}) no es un día válido para esta
                                promoción.
                              </Alert>
                            )}

                            <img className='rounded-md py-4' src={promo.promotion.imageUrl} />
                            <DialogDescription>{promo.promotion.description}</DialogDescription>
                            <Alert severity='info' className='text-left'>
                              {promo.promotion?.conditions}
                            </Alert>
                            {promo.promotion?.systemType === "visits" && <Alert className='text-left'>Promoción válida los día(s): {formattedDays}</Alert>}
                          </DialogHeader>

                          {/* Point-based rewards for point promotions */}

                          <DialogFooter>
                            {isHot && promo.systemType === "visits" && (
                              <Button
                                onClick={() => {
                                  handleRedeemPromotion(promo.promotion);
                                }}
                                className={`flex w-full ${
                                  // Verificar si CUALQUIER promoción de visitas ya fue canjeada hoy
                                  promotions.some((p) => {
                                    return (
                                      p.systemType === "visits" &&
                                      p.lastRedeemDate &&
                                      new Date(p.lastRedeemDate).toISOString().split("T")[0] === new Date().toISOString().split("T")[0]
                                    );
                                  })
                                    ? "bg-gray-400 text-gray-600 cursor-not-allowed"
                                    : "bg-main text-white hover:bg-main/90 duration-500"
                                }`}
                                disabled={promotions.some((p) => {
                                  return (
                                    p.systemType === "visits" &&
                                    p.lastRedeemDate &&
                                    new Date(p.lastRedeemDate).toISOString().split("T")[0] === new Date().toISOString().split("T")[0]
                                  );
                                })}
                              >
                                {promotions.some((p) => {
                                  return (
                                    p.systemType === "visits" &&
                                    p.lastRedeemDate &&
                                    new Date(p.lastRedeemDate).toISOString().split("T")[0] === new Date().toISOString().split("T")[0]
                                  );
                                })
                                  ? "Ya has canjeado una promoción hoy"
                                  : "Canjear Promoción"}
                              </Button>
                            )}
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    );
                  })}
                </div>
              </div>

              <div>
                <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
                  <DialogContent className='max-w-xs max-h-[40%] md:max-h-[30%] overflow-y-scroll p-4 rounded-lg shadow-md border border-gray-200 bg-white'>
                    <DialogHeader className='pt-16'>
                      <DialogTitle className='text-lg font-semibold'>Confirmar Canje</DialogTitle>
                      <DialogDescription className='text-sm text-gray-600'>
                        {selectedPromotion?.promotion.systemType === "points"
                          ? `¿Estás seguro de que deseas canjear "${selectedReward?.description}" por ${selectedReward?.points} punto(s)?`
                          : `¿Estás seguro de que deseas canjear la promoción "${selectedPromotion?.promotion.title}"?`}
                      </DialogDescription>
                      <DialogFooter className='flex justify-end gap-2 mt-4'>
                        <Button variant='outline' className='text-sm px-4 py-2' onClick={() => setShowConfirmDialog(false)}>
                          Cancelar
                        </Button>
                        <Button disabled={loadingRedeem} className='text-sm px-4 py-2' onClick={confirmRedeem}>
                          Confirmar
                        </Button>
                      </DialogFooter>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
                {/* Redemption Confirmation Dialog */}
                {showConfirmDialog && (
                  <Card className='h-fit w-full sm:w-auto'>
                    <CardHeader>
                      <h3 className='pt-12'>Confirmar Canje</h3>
                    </CardHeader>
                    <CardContent>
                      <p>
                        {selectedPromotion?.promotion.systemType === "points"
                          ? `¿Estás seguro de que deseas canjear "${selectedReward?.title}" por ${selectedReward?.points} puntos?`
                          : `¿Estás seguro de que deseas canjear la promoción "${selectedPromotion?.promotion.title}"?`}
                      </p>
                    </CardContent>
                    <CardFooter className='space-y-4'>
                      <div className='flex flex-col space-y-4'>
                        <Button variant='outline' onClick={() => setShowConfirmDialog(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={confirmRedeem}>Confirmar</Button>
                      </div>
                    </CardFooter>
                  </Card>
                )}

                <h3 className='text-lg font-semibold mb-2 text-gray-700'>Actividad reciente</h3>
                <div className='space-y-2'>{<Activities activities={activities} />}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Confirmation Dialog */}
        <Dialog open={showRedemptionDialog} onOpenChange={setShowRedemptionDialog}>
          <DialogContent className='h-fit'>
            <DialogHeader>
              <DialogTitle className='pt-8'>Promoción Canjeada</DialogTitle>
              <DialogDescription>
                {selectedPromotion?.promotion.systemType === "points"
                  ? `Has canjeado "${selectedReward?.description}" por ${selectedReward?.points} puntos.`
                  : `Has canjeado la promoción "${selectedPromotion?.promotion.title}".`}
              </DialogDescription>
              <div className='mt-4 bg-blue-50 p-4 rounded-lg'>
                <p className='text-sm text-gray-700'>{selectedPromotion?.promotion?.description}</p>
              </div>
              <Alert severity='success' className='text-left'>
                Muestra este mensaje para validar tu canje. Si no puedes mostrar en tú actividad reciente.
              </Alert>
              <Alert severity='info' sx={{ fontWeight: "bold" }}>
                Canje realizado el: {getFormattedDateTimeChile()}
              </Alert>
            </DialogHeader>
            <DialogFooter>
              <Button
                onClick={() => {
                  setShowRedemptionDialog(false);
                  setSelectedPromotion(null);
                  setSelectedReward(null);
                }}
              >
                Entendido
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {showScanner && (
        <div onClick={() => setShowScanner(false)} className='fixed inset-0 flex justify-center items-center bg-slate-700 bg-opacity-70 p-6 z-50'>
          <div className='relative bg-white p-6 rounded-lg shadow-lg w-11/12 max-w-md'>
            <button onClick={() => setShowScanner(false)} className='absolute top-2 right-2 text-gray-600 hover:text-gray-900 text-xl font-bold'>
              ✕
            </button>

            <div className='w-full aspect-square p-6'>
              <Scanner
                scanDelay={1000}
                onScan={handleScan}
                className='w-full h-full object-contain p-6'
                constraints={{
                  video: {
                    width: { ideal: 640 },
                    height: { ideal: 480 },
                    facingMode: "environment",
                  },
                }}
              />
            </div>
          </div>
        </div>
      )}
      <p className='text-white text-center mt-2'>© {new Date().getFullYear()} FidelidApp. Todos los derechos reservados.</p>
    </div>
  );
}
