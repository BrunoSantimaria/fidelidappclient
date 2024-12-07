"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, Gift, Clock, Settings, LogOut, ChevronRight, Coffee, Pizza, Utensils, ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useOutletContext } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

const mockUser = {
  name: "Juan Pérez",
  email: "juan@example.com",
  phone: "987654321",
  points: 7,
};

const mockPromotions = [
  {
    id: 1,
    title: "¡Aprovecha nuestra promoción de Jueves! 🎉",
    description: "Hoy tienes un 20% de descuento en todos nuestros platos principales.",
    image: "https://juanluisboschgutierrez.com/wp-content/uploads/2020/01/Comida-de-latinoamerica.jpg",
    terms: "Tope $25.000CLP. Una promoción por mesa/grupo. Válido los días jueves.",
    rewardSystem: "Descuento",
    systemType: "discount",
    isHot: true,
    activeDay: 4, // 4 represents Thursday
  },
  {
    id: 2,
    title: "Fusion Latina te Premia: Acumula Puntos y canjea",
    description: "Acumula puntos y canjea por increíbles recompensas.",
    image:
      "https://www.mycentraljersey.com/gcdn/authoring/authoring-images/2023/08/23/PCNJ/70660467007-mexi-bar-view-3.jpeg?crop=1207,682,x0,y42&width=1207&height=603&format=pjpg&auto=webp",
    terms:
      "Se otorga 1 punto a su FideliCard con una compra mínima de $15.000CLP. Los puntos no son transferibles. Solo se puede canjear una promoción al día.",
    systemType: "points",
    rewardSystem: [
      {
        points: 5,
        title: "Bebida gratis.",
      },
      {
        points: 10,
        title: "50% OFF en pizzas.",
      },
      {
        points: 15,
        title: "Media pizza y bebida gratis.",
      },
    ],
    activeDay: null, // Active every day
  },
  {
    id: 3,
    title: "Lunes de Locura: ¡2x1 en Cócteles! 🍹",
    description: "Comienza tu semana con el pie derecho. Todos los lunes, disfruta de nuestros cócteles en promoción 2x1.",
    image: "https://cdn7.kiwilimon.com/articuloimagen/30105/28194.jpg",
    terms: "Válido solo los lunes. Máximo 3 promociones por mesa. No acumulable con otras ofertas.",
    rewardSystem: "2x1 en cócteles",
    systemType: "discount",
    isHot: false,
    activeDay: 1, // 1 represents Monday
  },
];

const mockActivities = [
  { id: 1, type: "earned", amount: 1, description: "Compra", date: "2023-06-01" },
  { id: 2, type: "redeemed", amount: 5, description: "50% OFF en pizzas.", date: "2023-06-05" },
  { id: 3, type: "earned", amount: 11, description: "Compra", date: "2023-06-10" },
];

export default function FideliCard() {
  const { onNavigate } = useOutletContext();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [userDetails, setUserDetails] = useState(mockUser);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [showRedeemConfirmation, setShowRedeemConfirmation] = useState(false);
  const [redeemingReward, setRedeemingReward] = useState(null);
  const [currentDay, setCurrentDay] = useState(new Date().getDay());
  const { toast } = useToast();

  useEffect(() => {
    const today = new Date();
    setCurrentDay(today.getDay());
  }, []);

  const handleUpdateDetails = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const updatedDetails = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
    };
    setUserDetails({ ...userDetails, ...updatedDetails });
    setIsSettingsOpen(false);
    toast({
      title: "Perfil actualizado",
      description: "Tus datos han sido actualizados correctamente.",
    });
  };

  const handleLogout = () => {
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente.",
    });
    // Aquí puedes agregar la lógica de cierre de sesión.
  };

  const handleRedeemReward = (promotion, reward = null) => {
    setSelectedPromotion(promotion);
    setRedeemingReward(reward);
    setShowRedeemConfirmation(true);
  };

  const confirmRedeem = () => {
    if (selectedPromotion.systemType === "points") {
      if (userDetails.points >= redeemingReward.points) {
        setUserDetails({ ...userDetails, points: userDetails.points - redeemingReward.points });
        toast({
          title: "Recompensa canjeada",
          description: `Has canjeado "${redeemingReward.title}" por ${redeemingReward.points} puntos.`,
        });
      } else {
        toast({
          title: "Puntos insuficientes",
          description: "No tienes suficientes puntos para canjear esta recompensa.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Promoción aplicada",
        description: `Has aplicado la promoción "${selectedPromotion.title}".`,
      });
    }
    setShowRedeemConfirmation(false);
    setSelectedPromotion(null);
    setRedeemingReward(null);
  };

  const isPromotionActive = (promo) => {
    return promo.activeDay === null || promo.activeDay === currentDay;
  };

  return (
    <div className='min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 p-4 font-sans text-gray-800'>
      <div className='max-w-4xl mx-auto'>
        <Button onClick={() => onNavigate("/landingpage")} className='inline-flex items-center text-main hover:text-blue-800 mb-4'>
          <ArrowLeft className='mr-2' /> Volver a la página principal
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
                  <p className='text-3xl font-bold text-main'>{userDetails.points}</p>
                </div>
                <div className='space-y-4'>
                  <h3 className='text-lg font-semibold mb-2 text-gray-700'>Promociones disponibles</h3>
                  {mockPromotions.map((promo) => (
                    <Dialog key={promo.id}>
                      <DialogTrigger asChild>
                        <motion.div
                          className='bg-white rounded-lg p-4 shadow-md cursor-pointer border border-gray-200 hover:border-blue-500 transition-all duration-300'
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <div className='flex justify-between items-start'>
                            <h4 className='font-semibold mb-2 text-main'>{promo.title}</h4>
                            {promo.isHot && <Badge variant='destructive'>HOT</Badge>}
                          </div>
                          <p className='text-sm text-gray-600 mb-2'>{promo.description}</p>
                          {!isPromotionActive(promo) && (
                            <p className='text-xs text-orange-500 font-semibold'>
                              <Calendar className='inline-block mr-1 h-4 w-4' />
                              Promoción válida solo los {promo.activeDay === 1 ? "lunes" : "jueves"}
                            </p>
                          )}
                        </motion.div>
                      </DialogTrigger>
                      <DialogContent className='bg-white w-[95%] max-w-lg'>
                        <DialogHeader className='mt-4'>
                          <DialogTitle className='text-main text-2xl flex items-center justify-between'>
                            {promo.title}
                            {promo.isHot && <Badge variant='destructive'>HOT</Badge>}
                          </DialogTitle>
                          <DialogDescription className='text-gray-600'>{promo.description}</DialogDescription>
                        </DialogHeader>
                        <div className='mt-4 space-y-4'>
                          <img src={promo.image} alt={promo.title} className='w-full rounded-lg object-cover h-48' />
                          <Alert>
                            <AlertTitle>Términos y condiciones</AlertTitle>
                            <AlertDescription>{promo.terms}</AlertDescription>
                          </Alert>

                          {promo.systemType === "points" ? (
                            <div className='bg-blue-50 p-4 rounded-lg'>
                              <p className='font-bold text-main mb-2'>Recompensas:</p>
                              <ul className='space-y-2'>
                                {promo.rewardSystem.map((reward, index) => (
                                  <li key={index} className='flex justify-between items-center bg-white p-2 rounded shadow-sm'>
                                    <span className='text-sm text-gray-600'>
                                      <span className='font-semibold text-main'>{reward.points} puntos:</span> {reward.title}
                                    </span>
                                    <Button
                                      size='sm'
                                      onClick={() => handleRedeemReward(promo, reward)}
                                      disabled={userDetails.points < reward.points}
                                      className='bg-main hover:bg-blue-700 text-white font-bold'
                                    >
                                      Canjear
                                    </Button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ) : (
                            <div className='bg-yellow-50 p-4 rounded-lg flex justify-between items-center'>
                              <p className='font-bold text-yellow-700'>Recompensa: {promo.rewardSystem}</p>
                              <Button
                                onClick={() => handleRedeemReward(promo)}
                                className='bg-yellow-500 hover:bg-yellow-600 text-white font-bold'
                                disabled={!isPromotionActive(promo)}
                              >
                                {isPromotionActive(promo) ? "Aplicar descuento" : "No disponible hoy"}
                              </Button>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                </div>
              </div>
              <div>
                <h3 className='text-lg font-semibold mb-2 text-gray-700'>Actividad reciente</h3>
                <div className='space-y-2'>
                  {mockActivities.map((activity) => (
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
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className='flex justify-between mt-4 bg-gray-100 p-6'>
            <Button variant='secondary' size='sm' onClick={handleLogout} className='bg-gray-200 hover:bg-gray-300 text-gray-700'>
              <LogOut className='h-4 w-4 mr-2 ' />
              Cerrar sesión
            </Button>
          </CardFooter>
        </Card>

        <Dialog open={showRedeemConfirmation} onOpenChange={setShowRedeemConfirmation}>
          <DialogContent className='bg-white w-[95%]'>
            <DialogHeader className='mt-12'>
              <DialogTitle className='text-main'>Confirmar canje</DialogTitle>
              <DialogDescription className='text-gray-600'>
                {selectedPromotion?.systemType === "points" ? (
                  <>
                    ¿Estás seguro de que quieres canjear "{redeemingReward?.title}" por {redeemingReward?.points} puntos?
                  </>
                ) : (
                  <>¿Estás seguro de que quieres aplicar el descuento de "{selectedPromotion?.title}"?</>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant='outline' onClick={() => setShowRedeemConfirmation(false)} className='border-gray-300 text-gray-700'>
                Cancelar
              </Button>
              <Button onClick={confirmRedeem} className='bg-main hover:bg-blue-600 text-white'>
                Confirmar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
