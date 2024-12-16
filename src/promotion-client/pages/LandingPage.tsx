"use client";

import React, { useEffect, useState } from "react";
import { Facebook, Instagram, Globe, CreditCard, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { Alert } from "@mui/material";
import { useParams } from "react-router-dom";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import api from "@/utils/api";
import { FaWhatsapp } from "react-icons/fa";
import { AuthDialog } from "../utils/AuthDialog";
import { useAuth } from "../utils/AuthContext";
import { useNavigateTo } from "@/hooks/useNavigateTo";

import { sortPromotions } from "../utils/SortPromotions";
import { toast as toastify } from "../../utils/toast";

interface SocialMedia {
  instagram: string;
  facebook: string;
  whatsapp: string;
  website: string;
}

interface Promotion {
  _id: string;
  title: string;
  description: string;
  conditions: string;
  imageUrl: string;
  systemType: string;
  daysOfWeek: number[];
  status: string;
}

interface Account {
  _id: string;
  name: string;
  logo: string;
  socialMedia: SocialMedia;
  promotions: Promotion[];
  card?: string[];
}

export function LandingPage() {
  const { slug } = useParams();

  const { login, logout, isLoggedInForAccount, getClientId } = useAuth();
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPdfDialogOpen, setIsPdfDialogOpen] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);

  // Cargar la información de la cuenta
  const getAccInfo = async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const response = await api.get(`/api/landing/${slug}`);

      setAccount(response.data);
      document.title = `${response.data.name} | FidelidApp`;
      if (response.data.card) setNumPages(response.data.card.length);
    } catch (error) {
      console.error(error);
      toastify.error("Error al obtener la información de la cuenta");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    getAccInfo();
  }, [slug]);

  // Días de la semana en español
  const daysOfWeek = [null, "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  const isPromotionHot = (promotion) => {
    const today = new Date().getDay();
    const adjustedToday = today === 0 ? 7 : today;

    const isActive = promotion?.status?.toLowerCase().trim() === "active";
    const isDayIncluded = promotion.daysOfWeek.includes(adjustedToday);

    return isActive && isDayIncluded;
  };
  // Generar los enlaces de redes sociales
  const getSocialLinks = () => {
    if (!account?.socialMedia) return [];
    return [
      { icon: Facebook, href: account.socialMedia.facebook },
      { icon: Instagram, href: account.socialMedia.instagram },
      {
        icon: FaWhatsapp,
        href: account.socialMedia.whatsapp ? `https://wa.me/${account.socialMedia.whatsapp}` : null,
      },
      { icon: Globe, href: account.socialMedia.website },
    ].filter((link) => link.href); // Filtrar los enlaces que no tienen `href`
  };
  const formatDescription = (description) => {
    // Reemplazar los saltos de línea '\n' con el componente <br />
    return description.split("\n").map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };
  const formatConditions = (conditions) => {
    // Reemplazar los '\r\n' por <br />
    return conditions.split("\r\n").map((line, index) => (
      <span key={index}>
        {line}
        <br />
      </span>
    ));
  };

  const { handleNavigate } = useNavigateTo();
  const sortedPromotions = sortPromotions(account?.promotions, isPromotionHot);

  const [currentPage, setCurrentPage] = useState(1);

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (numPages && currentPage < numPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  const clientId = getClientId(account?._id);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='min-h-screen bg-gradient-to-tr from-slate-400 to-slate-700 py-12 px-4 sm:px-6 lg:px-8 text-white'
    >
      <div className='max-w-4xl md:max-w-5xl lg:max-w-6xl mx-auto space-y-8'>
        {/* Componente de carga */}
        {loading ? (
          <div className='flex justify-center items-center min-h-[400px]'>
            <div className='spinner-border animate-spin inline-block w-16 h-16 border-4 rounded-full text-white' role='status'>
              <span className='sr-only'>Cargando...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Título de la página */}
            <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className='text-center'>
              <h1 className='text-5xl font-bold text-white mb-2'>{account?.name || "Restaurante"}</h1>
              <p className='mt-2 text-lg w-full md:w-2/3 justify-center m-auto text-gray-300'>
                ¡Regístrate y empieza a sumar puntos! 🌟 Entérate de nuestras promociones y obtén grandes beneficios 🎉
              </p>
            </motion.div>
            {!isLoggedInForAccount(account?._id) && account && (
              <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <AuthDialog
                  accountId={account._id}
                  onAuthSuccess={(userId, token, clientId) => {
                    login(account._id, userId, token, clientId);
                    getAccInfo();
                  }}
                />
              </motion.div>
            )}
            {/* Botones de acción */}

            <div className='flex flex-col justify-center space-y-6'>
              <Button
                onClick={() => setIsPdfDialogOpen(true)}
                className={`${!account?.card && "hidden"} bg-[#3a3b40] p-6 hover:bg-[#4a4b50] text-white font-bold transition-colors duration-300`}
              >
                Ver nuestra carta
              </Button>
              {account?.googleBusiness && (
                <Button
                  onClick={() => window.open(account?.googleBusiness, "_blank")}
                  className={` bg-yellow-500 hover:bg-yellow-600 text-black w-full m-auto font-bold p-6 transition-colors duration-300 flex items-center space-x-2`}
                >
                  <Star className='w-6 h-6 fill-current' />
                  <span>Valóranos en Google</span>
                </Button>
              )}

              {isLoggedInForAccount(account?._id || "") && (
                <>
                  <Button
                    onClick={() => {
                      handleNavigate(`/landing/${slug}/fidelicard/${clientId}`);
                    }}
                    className='bg-[#3a3b40] hover:bg-[#4a4b50] p-6 text-white font-bold transition-colors duration-300'
                  >
                    Mi FideliCard <CreditCard />
                  </Button>

                  <Button
                    onClick={() => logout(account?._id)}
                    className='bg-[#3a3b40] p-6 hover:bg-[#4a4b50] text-white font-bold transition-colors duration-300'
                  >
                    Cerrar Sesión
                  </Button>
                </>
              )}
            </div>

            <Dialog open={isPdfDialogOpen} onOpenChange={setIsPdfDialogOpen}>
              <DialogContent className='p-0 bg-transparent flex justify-center items-center'>
                <DialogHeader className='sr-only'>
                  <DialogTitle>Nuestra Carta</DialogTitle>
                </DialogHeader>
                <div className='w-full md:w-full md:h-[80vh] flex flex-col items-center justify-center'>
                  {/* Image Viewer */}
                  {account?.card && (
                    <div className='flex justify-center items-center w-full h-full'>
                      <img
                        src={account.card[currentPage - 1]}
                        alt={`Page ${currentPage}`}
                        className='w-auto h-auto max-w-full md:w-screen md:h-screen max-h-full object-contain shadow-lg'
                      />
                    </div>
                  )}

                  <div className='flex justify-center space-x-4 bg-black/50 p-4 backdrop-blur-sm mt-4'>
                    <Button onClick={goToPrevPage} disabled={currentPage === 1} className='bg-[#3a3b40] hover:bg-[#4a4b50] text-white px-4 py-2'>
                      Anterior
                    </Button>
                    <span className='text-white flex items-center'>
                      {currentPage} / {numPages}
                    </span>
                    <Button onClick={goToNextPage} disabled={currentPage === numPages} className='bg-[#3a3b40] hover:bg-[#4a4b50] text-white px-4 py-2'>
                      Siguiente
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            {/* Promociones activas */}
            <div>
              <h2 className={`${!sortedPromotions.length && "hidden"} text-2xl font-bold text-white mb-4 text-center`}>Nuestras Promociones</h2>
              <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
                {sortedPromotions?.map((promo) => {
                  const isHot = isPromotionHot(promo);

                  const daysOfWeek = [null, "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

                  // Día actual (ajustado al rango 1-7)
                  const today = new Date().getDay();
                  const normalizeText = (text) => text.toLowerCase().trim().replace(/\.$/, "");

                  const applicableDays = [...new Set(promo.daysOfWeek)] // Elimina duplicados
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
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Card className='bg-[#3a3b40] shadow-lg hover:shadow-xl transition-shadow cursor-pointer relative overflow-hidden h-full'>
                            <CardContent
                              className={`${
                                isHot ? "border-4 border-transparent bg-clip-border shadow-fire" : ""
                              } p-6 bg-gradient-to-br from-[#4a4b50] to-[#3a4b40] text-white rounded-lg h-full flex flex-col justify-between`}
                            >
                              {isHot ||
                                (promo.systemType === "points" && (
                                  <span className='absolute top-0 right-0 py-1 px-3 text-sm bg-red-600 text-white rounded-full font-bold'>Hot</span>
                                ))}
                              <h2 className='text-xl font-semibold'>{promo.title}</h2>
                              <p className='mt-2 text-gray-300'>{formatDescription(promo.description)}</p>

                              <p className={`${promo.systemType === "points" && "hidden"} mt-2 text-sm text-gray-400`}>Válido: {formattedDays}</p>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </DialogTrigger>
                      <DialogContent className='bg-[#28292d] w-[95%] pt-20 text-white'>
                        <DialogHeader className='mt-16 flex flex-col m-auto justify-center'>
                          <DialogTitle className='text-white text-2xl'>{promo.title}</DialogTitle>
                          <DialogDescription className='text-gray-300'>{promo.description}</DialogDescription>
                        </DialogHeader>
                        <div className='mt-4 space-y-4 flex flex-col justify-center'>
                          <img src={promo.imageUrl} alt={promo.title} className='w-full md:m-auto md:w-[30vw] rounded-lg' />
                          {promo.systemType === "points" && promo.rewards?.length > 0 && (
                            <div className='mt-4 '>
                              <h3 className='text-lg font-semibold text-white mb-4'>Recompensas</h3>
                              <ul className='divide-y  bg-gradient-to-tr from-slate-400 to-slate-700 divide-gray-200 rounded-lg border border-gray-300 bg-white shadow-md'>
                                {promo.rewards.map((reward) => (
                                  <li key={reward._id} className='flex flex-col items-center justify-between p-4 hover:bg-gray-50 transition'>
                                    <div>
                                      <p className='text-sm font-medium text-white'>{reward.description}</p>
                                    </div>
                                    <span className='inline-flex mt-6 items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-main'>
                                      {reward.points} puntos
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {/* Conditional Alert for Non-Applicable Days */}
                          {!isHot && promo.systemType === "visits" && (
                            <Alert severity='warning' className='text-sm text-white bg-[#4a4b50]'>
                              Esta promoción solo está disponible los días: {applicableDays}. Hoy ({daysOfWeek[today]}) no es un día válido para esta promoción.
                            </Alert>
                          )}

                          {/* Conditions Alert */}
                          <Alert severity='info' className='text-sm text-gray-300 bg-[#3a3b40]'>
                            {formatConditions(promo.conditions)}
                          </Alert>
                          {isLoggedInForAccount(account?._id || "") ? (
                            <Alert severity='success' className='w-full text-sm text-white bg-[#4a4b50]'>
                              ¡Estás automáticamente registrado en todas nuestras promociones! <br></br>
                              <span
                                className='cursor-pointer font-bold text-main'
                                onClick={() => {
                                  handleNavigate(`/landing/${slug}/fidelicard/${clientId}`);
                                }}
                              >
                                Ir a tu FideliCard
                              </span>
                            </Alert>
                          ) : (
                            <Alert severity='success' className='w-full text-sm text-white bg-[#4a4b50]'>
                              ¡
                              <DialogClose asChild>
                                <span
                                  onClick={() => {
                                    window.scrollTo({ top: 0, behavior: "smooth" });
                                  }}
                                  className='font-bold cursor-pointer'
                                >
                                  Registrate
                                </span>
                              </DialogClose>{" "}
                              para empezar a sumar puntos y canjear promociones!
                            </Alert>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  );
                })}
              </div>
            </div>

            {/* Logo y redes sociales */}
            <div className='flex flex-col justify-center'>
              <div className='m-auto mb-6'>{account?.logo && <img src={account.logo} className='w-[14rem] h-auto' alt={`${account.name} Logo`} />}</div>
              <div className='flex flex-row space-x-4 m-auto'>
                {getSocialLinks().map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-white hover:text-gray-300 transition-colors duration-300'
                  >
                    <link.icon size={24} />
                  </a>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
