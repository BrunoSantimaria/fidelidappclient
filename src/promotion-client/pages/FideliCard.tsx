"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CreditCard, ArrowLeft, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

import { Badge } from "@/components/ui/badge";
import api from "@/utils/api";
import { useAuth } from "../utils/AuthContext";
import { useNavigateTo } from "@/hooks/useNavigateTo";
import { useParams } from "react-router-dom";
import { Alert } from "@mui/material";

// Days of week in Spanish
const daysOfWeek = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];

export default function FideliCard() {
  const { slug, clientId } = useParams();
  const { authData, getClientId, logout } = useAuth();
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
  const [showRedeemConfirmation, setShowRedeemConfirmation] = useState(false);
  const [redeemingReward, setRedeemingReward] = useState(null);
  const [activities, setActivities] = useState([]);
  const [promotions, setPromotions] = useState([]);

  // Check if a promotion is currently active
  const isPromotionHot = (promotion) => {
    const today = new Date().getDay();
    return promotion.promotion.status === "active" && promotion.promotion.daysOfWeek.includes(today);
  };

  // Sort promotions to prioritize hot promotions
  const sortedPromotions = promotions
    ? [...promotions].sort((a, b) => {
        // Programas de puntos siempre arriba
        if (a.systemType === "points") return -1;
        if (b.systemType === "points") return 1;

        // Promoción activa del día ('hot') en segundo lugar
        if (isPromotionHot(a)) return -1;
        if (isPromotionHot(b)) return 1;

        // El resto por startDate cronológicamente
        const dateA = new Date(a.startDate || 0).getTime();
        const dateB = new Date(b.startDate || 0).getTime();
        return dateA - dateB;
      })
    : [];
  // Fetch FideliCard data on component mount
  useEffect(() => {
    const fetchFideliCardData = async () => {
      try {
        const accountId = Object.keys(authData).find((key) => authData[key].loggedIn);

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

        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching FideliCard data:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos de la FideliCard",
          variant: "destructive",
        });
        setIsLoading(false);
        handleNavigate("/login");
      }
    };

    fetchFideliCardData();
  }, []);

  const handleRedeemReward = async (promotion, reward = null) => {
    // Check if promotion is currently active
    const today = new Date().getDay();
    if (!promotion.promotion.daysOfWeek.includes(today)) {
      toast({
        title: "Promoción no disponible",
        description: `Esta promoción solo está disponible los días: ${promotion.promotion.daysOfWeek.map((day) => daysOfWeek[day]).join(", ")}`,
        variant: "destructive",
      });
      return;
    }

    // Check point requirements for point-based promotions
    if (promotion.promotion.systemType === "points" && reward) {
      if (userDetails.totalPoints < reward.points) {
        toast({
          title: "Puntos insuficientes",
          description: `Necesitas ${reward.points} puntos para canjear este premio. Tienes ${userDetails.totalPoints} puntos.`,
          variant: "destructive",
        });
        return;
      }
    }

    setSelectedPromotion(promotion);
    setRedeemingReward(reward);
    setShowRedeemConfirmation(true);
  };

  const confirmRedeem = async () => {
    try {
      const accountId = Object.keys(authData).find((key) => authData[key].loggedIn);

      const clientId = getClientId(accountId);
      const userEmail = authData[accountId].userId;

      // Prepare activity based on redemption type
      const activityToAdd =
        selectedPromotion.promotion.systemType === "points"
          ? {
              type: "redeemed",
              description: redeemingReward.title,
              amount: redeemingReward.points,
              promotionId: selectedPromotion._id,
            }
          : {
              type: "discount",
              description: selectedPromotion.promotion.title,
              amount: 0, // No point deduction for discount
              promotionId: selectedPromotion._id,
            };

      // Add activity via API
      const response = await api.post("/api/landing/add-activity", {
        email: userEmail,
        accountId: clientId,
        activity: activityToAdd,
      });

      // Update UI
      setUserDetails((prev) => ({
        ...prev,
        totalPoints: response.data.totalPoints,
      }));

      toast({
        title: "Recompensa canjeada",
        description:
          selectedPromotion.promotion.systemType === "points"
            ? `Has canjeado "${redeemingReward.title}" por ${redeemingReward.points} puntos.`
            : `Has aplicado la promoción "${selectedPromotion.promotion.title}".`,
      });

      // Reset states
      setShowRedeemConfirmation(false);
      setSelectedPromotion(null);
      setRedeemingReward(null);
    } catch (error) {
      console.error("Error redeeming reward:", error);
      toast({
        title: "Error",
        description: "No se pudo canjear la recompensa",
        variant: "destructive",
      });
    }
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
        <Button onClick={() => handleNavigate(`/landing/${slug}`)} className='inline-flex items-center text-white hover:text-blue-800 mb-4'>
          <ArrowLeft className='mr-2 text-white ' />
        </Button>
        <Card className='bg-white shadow-lg rounded-xl overflow-hidden'>
          <CardHeader className='pb-2 bg-main text-white'>
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
                <div className='space-y-4'>
                  <h3 className='text-lg font-semibold mb-2 text-gray-700'>Promociones disponibles</h3>
                  {sortedPromotions.map((promo) => {
                    const today = new Date().getDay();
                    const isHot = isPromotionHot(promo);
                    const applicableDays = promo.promotion.daysOfWeek.map((day) => daysOfWeek[day]).join(", ");

                    return (
                      <Dialog key={promo._id}>
                        <DialogTrigger asChild>
                          <motion.div
                            className={`bg-white rounded-lg p-4 shadow-md cursor-pointer border ${
                              isHot ? "border-red-500 hover:border-red-600" : "border-gray-200 hover:border-blue-500"
                            } transition-all duration-300`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className='flex justify-between items-start'>
                              <h4 className='font-semibold mb-2 text-main'>{promo.promotion.title}</h4>
                              {isHot && <Badge variant='destructive'>HOT</Badge>}
                            </div>
                            <p className='text-sm text-gray-600 mb-2'>{promo.promotion.description}</p>
                            <p className={`${!applicableDays && "hidden"} text-xs text-gray-500`}>Válido: {applicableDays}</p>
                          </motion.div>
                        </DialogTrigger>
                        <DialogContent className='bg-white w-[95%] max-w-lg pt-20'>
                          <DialogHeader>
                            <DialogTitle>{promo.promotion.title}</DialogTitle>
                            <DialogDescription>{promo.promotion.description}</DialogDescription>
                          </DialogHeader>

                          {/* Point-based rewards for point promotions */}
                          {promo.promotion.systemType === "points" && promo.promotion.rewards && (
                            <div className='mt-4 space-y-2'>
                              <h3 className='text-lg font-semibold'>Premios disponibles</h3>
                              {promo.promotion.rewards.map((reward) => (
                                <div key={reward._id} className='flex justify-between items-center bg-gray-100 p-3 rounded-lg'>
                                  <div>
                                    <h4 className='font-medium'>{reward.title}</h4>
                                    <p className='text-sm text-gray-600'>{reward.description}</p>
                                    <p className='text-sm text-blue-600'>{reward.points} puntos</p>
                                  </div>
                                  <Button onClick={() => handleRedeemReward(promo, reward)} disabled={userDetails.totalPoints < reward.points}>
                                    Canjear
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Conditional Alert for Non-Applicable Days */}
                          {!isHot && promo.promotion.systemType === "visits" && (
                            <Alert severity='warning' className='mt-4 h-fit'>
                              Esta promoción solo está disponible los días: {applicableDays}. Hoy ({daysOfWeek[today]}) no es un día válido para esta promoción.
                            </Alert>
                          )}
                        </DialogContent>
                      </Dialog>
                    );
                  })}
                </div>
              </div>
              <div>
                <h3 className='text-lg font-semibold mb-2 text-gray-700'>Actividad reciente</h3>
                <div className='space-y-2'>
                  {activities?.length > 0 ? (
                    activities.map((activity) => (
                      <div key={activity.id} className='flex justify-between items-center text-sm bg-white rounded-lg p-3 shadow-sm border border-gray-200'>
                        <div>
                          <span className='text-gray-700 font-medium'>{activity.description}</span>
                          <br />
                          <span className='text-xs text-gray-500'>{new Date(activity.date).toLocaleDateString()}</span>
                        </div>
                        <span className={`font-bold ${activity.type === "earned" ? "text-green-600" : "text-red-600"}`}>
                          {activity.type === "earned" ? "+" : "-"}
                          {activity.amount} pts
                        </span>
                      </div>
                    ))
                  ) : (
                    <Alert severity='info'>No hay actividades recientes.</Alert>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className='flex justify-between mt-4 bg-gray-100 p-6'>
            <Button
              variant='secondary'
              size='sm'
              onClick={() => {
                const accountId = Object.keys(authData).find((key) => authData[key].loggedIn);
                logout(accountId);
                handleNavigate(`/landing/${slug}`);
              }}
              className='bg-gray-200 hover:bg-gray-300 text-gray-700'
            >
              <LogOut className='h-4 w-4 mr-2 ' />
              Cerrar sesión
            </Button>
          </CardFooter>
        </Card>

        {/* Confirmation Dialog */}
        <Dialog open={showRedeemConfirmation} onOpenChange={setShowRedeemConfirmation}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmar Canje</DialogTitle>
              <DialogDescription>¿Estás seguro de que deseas canjear {redeemingReward?.title}?</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant='outline' onClick={() => setShowRedeemConfirmation(false)}>
                Cancelar
              </Button>
              <Button onClick={confirmRedeem}>Confirmar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <p className='text-white text-center mt-2'>© {new Date().getFullYear()} FidelidApp. Todos los derechos reservados.</p>
    </div>
  );
}
