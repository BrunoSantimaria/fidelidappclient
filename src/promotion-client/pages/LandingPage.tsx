"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Facebook, Instagram, Globe, CreditCard, Star, LogOutIcon, Search, ChevronRight, ChevronLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { Alert } from "@mui/material";
import { useParams } from "react-router-dom";
import { CiLogout } from "react-icons/ci";

import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import api from "@/utils/api";
import { FaWhatsapp } from "react-icons/fa";
import { AuthDialog } from "../utils/AuthDialog";
import { useAuth } from "../utils/AuthContext";
import { useNavigateTo } from "@/hooks/useNavigateTo";

import { sortPromotions } from "../utils/SortPromotions";
import { toast as toastify } from "../../utils/toast";

import { generatePalette } from "../utils/colorPalettes";

import { ImageViewer } from "../components/ImageViewer";

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
interface MenuItem {
  name: string;
  description: string;
  price: number;
  image: string;
  available: boolean;
  _id: string;
}

interface MenuCategory {
  name: string;
  icon: string;
  description: string;
  items: MenuItem[];
  _id: string;
}

// Componente para mostrar el menú

const MenuDialog = ({ account, isOpen, onClose }) => {
  const palette = generatePalette(account?.landing?.colorPalette);
  const [selectedCategory, setSelectedCategory] = useState(() => account?.landing?.menu?.categories[0]?.name || null);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState({
    min: "",
    max: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const contentRef = useRef(null);
  const categoryScrollRef = useRef(null);

  // Add debounced values
  const debouncedSearch = useDebounce(searchTerm, 300);
  const debouncedPriceFilter = useDebounce(priceFilter, 300);
  function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [value, delay]);

    return debouncedValue;
  }
  const allItems = useMemo(
    () =>
      account?.landing?.menu?.categories.flatMap((category) =>
        (category.items || []).map((item) => ({
          ...item,
          categoryName: category.name,
          name: item.name || "",
          description: item.description || "",
        }))
      ) || [],
    [account?.landing?.menu?.categories]
  );
  const filteredItems = useMemo(() => {
    if (!debouncedSearch && !debouncedPriceFilter.min && !debouncedPriceFilter.max) return [];

    setIsLoading(true);
    const results = allItems.filter((item) => {
      const searchLower = (debouncedSearch || "").toLowerCase();
      const itemName = (item.name || "").toLowerCase();
      const itemDescription = (item.description || "").toLowerCase();

      const matchesSearch = !debouncedSearch || itemName.includes(searchLower) || itemDescription.includes(searchLower);

      const itemPrice = Number(item.price) || 0;
      const minPrice = Number(debouncedPriceFilter.min) || 0;
      const maxPrice = Number(debouncedPriceFilter.max) || Infinity;

      const matchesPrice = (!debouncedPriceFilter.min || itemPrice >= minPrice) && (!debouncedPriceFilter.max || itemPrice <= maxPrice);

      return matchesSearch && matchesPrice;
    });
    setIsLoading(false);
    return results;
  }, [allItems, debouncedSearch, debouncedPriceFilter]);
  // Memoize current category items
  const categoryItems = useMemo(
    () => account?.landing?.menu?.categories.find((c) => c.name === selectedCategory)?.items || [],
    [account?.landing?.menu?.categories, selectedCategory]
  );

  const itemsToShow = debouncedSearch || debouncedPriceFilter.min || debouncedPriceFilter.max ? filteredItems : categoryItems;

  // Handle category change and scroll reset
  const handleCategoryChange = (categoryName) => {
    setSelectedCategory(categoryName);
    setSearchTerm("");
    setPriceFilter({ min: "", max: "" });
    setShowSearch(false);
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  };

  // Custom debounce hook

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`fixed inset-0 h-screen overflow-hidden z-50 ${palette.background}`}
      >
        <div className='h-full flex flex-col'>
          {/* Header */}
          <div className='sticky top-0 z-10 bg-inherit'>
            <div className='flex items-center justify-between p-4'>
              <h1 className={`text-2xl font-bold ${palette.textPrimary}`}>Nuestro Menú</h1>
              <div className='flex items-center gap-2'>
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className={`p-2 rounded-full hover:${palette.buttonHover} ${showSearch ? palette.cardBackground : ""}`}
                >
                  <Search className={`w-6 h-6 ${palette.textPrimary}`} />
                </button>
                <button onClick={onClose} className={`p-2 rounded-full hover:${palette.buttonHover}`}>
                  <X className={`w-6 h-6 ${palette.textPrimary}`} />
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <AnimatePresence>
              {showSearch && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className='overflow-hidden'
                >
                  <div className='px-4 pb-4 space-y-4'>
                    <div className='relative'>
                      <input
                        type='text'
                        placeholder='Buscar productos'
                        className={`w-full p-3 pl-10 rounded-lg border border-gray-600 ${palette.background} ${palette.textPrimary}`}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <Search className='absolute left-3 top-3.5 text-gray-400' />
                      {searchTerm && (
                        <button onClick={() => setSearchTerm("")} className='absolute right-3 top-3.5'>
                          <X className='w-5 h-5 text-gray-400' />
                        </button>
                      )}
                    </div>

                    <div className='flex gap-2'>
                      <input
                        type='number'
                        placeholder='Precio min'
                        className={`w-1/2 p-3 rounded-lg border border-gray-600 ${palette.background} ${palette.textPrimary}`}
                        value={priceFilter.min}
                        onChange={(e) => setPriceFilter((prev) => ({ ...prev, min: e.target.value }))}
                      />
                      <input
                        type='number'
                        placeholder='Precio max'
                        className={`w-1/2 p-3 rounded-lg border border-gray-600 ${palette.background} ${palette.textPrimary}`}
                        value={priceFilter.max}
                        onChange={(e) => setPriceFilter((prev) => ({ ...prev, max: e.target.value }))}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Categories */}
            <div className='px-4'>
              <div ref={categoryScrollRef} className='flex gap-3 overflow-x-auto pb-4 scrollbar-hide' style={{ scrollSnapType: "x mandatory" }}>
                {account?.landing?.menu?.categories.map((category, index) => (
                  <motion.button
                    key={category._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    onClick={() => handleCategoryChange(category.name)}
                    className={`
                      flex-shrink-0 
                      min-w-[100px]
                      flex 
                      flex-col 
                      items-center 
                      p-4 
                      rounded-lg 
                      transition-all
                      scroll-snap-align-start
                      ${selectedCategory === category.name ? palette.cardBackground : `${palette.background} hover:${palette.buttonHover}`} 
                      ${palette.textPrimary}
                    `}
                  >
                    <div className='text-2xl mb-2'>{category.icon}</div>
                    <span className='text-xs text-center font-medium'>{category.name}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div ref={contentRef} className='flex-1 overflow-y-auto'>
            <div className='container mx-auto px-4 py-6'>
              <div className='mb-6'>
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`text-xl font-semibold ${palette.textPrimary}`}
                >
                  {debouncedSearch || debouncedPriceFilter.min || debouncedPriceFilter.max ? "Resultados de búsqueda" : selectedCategory}
                </motion.h2>
                {!debouncedSearch && !debouncedPriceFilter.min && !debouncedPriceFilter.max && (
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className={`mt-2 ${palette.textSecondary}`}
                  >
                    {account?.landing?.menu?.categories.find((c) => c.name === selectedCategory)?.description}
                  </motion.p>
                )}
              </div>

              {isLoading ? (
                <div className='flex justify-center items-center py-12'>
                  <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900'></div>
                </div>
              ) : (
                <>
                  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-8'>
                    {itemsToShow.map((item, index) => (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`${palette.cardBackground} rounded-lg shadow-sm overflow-hidden`}
                      >
                        {item.image && (
                          <div className='relative h-48'>
                            <img src={item.image} alt={item.name} className='w-full h-full object-cover' />
                          </div>
                        )}
                        <div className='p-4'>
                          <h3 className={`font-semibold mb-2 ${palette.textPrimary}`}>{item.name}</h3>
                          <p className={`text-sm mb-4 ${palette.textSecondary}`}>{item.description}</p>
                          {account?.landing?.menu?.settings?.showPrices && (
                            <p className={`text-lg font-bold ${palette.textPrimary}`}>
                              {account?.landing?.menu?.settings?.currency}
                              {item.price.toLocaleString()}
                            </p>
                          )}
                          {!item.available && <span className='bg-red-500 text-white px-2 py-1 rounded mt-2 inline-block'>No disponible</span>}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {itemsToShow.length === 0 && (
                    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`text-center ${palette.textSecondary} py-8`}>
                      No se encontraron productos que coincidan con tu búsqueda
                    </motion.p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
export function LandingPage() {
  const { slug } = useParams();

  const { login, logout, isLoggedInForAccount, getClientId } = useAuth();
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPdfDialogOpen, setIsPdfDialogOpen] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [accountNotFound, setAccountNotFound] = useState(false);
  const [isMenuDialogOpen, setIsMenuDialogOpen] = useState(false);

  // Cargar la información de la cuenta
  const getAccInfo = async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const response = await api.get(`/api/landing/${slug}`);

      setAccount(response.data);
      document.title = `${response.data.name} | FidelidApp`;
      if (response.data.landing.card.content) setNumPages(response.data.landing.card.content.length);
      setAccountNotFound(false);
    } catch (error) {
      console.error(error);
      setAccountNotFound(true);
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
  if (accountNotFound) {
    return (
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='min-h-screen bg-gradient-to-tr from-slate-400 to-slate-700 py-12 px-4 sm:px-6 lg:px-8 text-white flex flex-col justify-center items-center'
      >
        <div className='max-w-md w-full space-y-8 text-center'>
          <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
            <h1 className='text-5xl font-bold text-white mb-2'>Oops!</h1>
            <p className='mt-2 text-xl text-gray-300'>Cuenta no encontrada</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
            <p className='mt-4 text-lg text-gray-300'>Lo sentimos, pero no pudimos encontrar la cuenta que estás buscando.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.6 }}>
            <Button
              onClick={() => (window.location.href = "/")}
              className='mt-8 bg-[#3a3b40] p-6 hover:bg-[#4a4b50] text-white font-bold transition-colors duration-300 w-full'
            >
              Volver a la página principal
            </Button>
          </motion.div>
        </div>
      </motion.div>
    );
  }
  const palette = generatePalette(account?.landing?.colorPalette);

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen  ${palette.gradient} py-12 px-4 sm:px-6 lg:px-8 text-white`}
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
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`text-center ${isLoggedInForAccount(account?._id || "") && "mt-12"} `}
            >
              <h1 className={`text-5xl mb-2 font-bold ${palette.textPrimary}`}>{account?.name || "Restaurante"}</h1>
              <p className={`mt-2 text-xl font-bold w-full md:w-2/3 justify-center m-auto ${palette.textPrimary} font-poppins`}>
                {account?.landing?.title || ""}
              </p>
              <p className={`mt-2 text-md w-full md:w-2/3 justify-center m-auto ${palette.textSecondary}`}>{account?.landing?.subtitle || ""}</p>
            </motion.div>
            {!isLoggedInForAccount(account?._id) && account && (
              <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <AuthDialog
                  accountId={account._id}
                  selectedPalette={palette}
                  onAuthSuccess={(userId, token, clientId) => {
                    login(account._id, userId, token, clientId);
                    getAccInfo();
                  }}
                />
              </motion.div>
            )}

            <div className='flex flex-col justify-center space-y-6'>
              <Button
                onClick={() => {
                  if (account?.landing?.card.type === "link") {
                    window.open(account?.landing?.card.content[0], "_blank");
                  } else if (account?.landing?.card.type === "view_on_site") {
                    setIsPdfDialogOpen(true);
                  } else if (account?.landing?.card.type === "menu") {
                    setIsMenuDialogOpen(true);
                  }
                }}
                className={`
    ${!account?.landing?.card.content && "hidden"}
    ${palette.buttonBackground} 
    ${palette.buttonHover}
    text-white font-bold p-6 transition-colors duration-300
    ring-0 
    hover:ring-2
    hover:ring-[${palette.textSecondary}]
  `}
              >
                {account?.landing?.card.title || "Ver nuestra carta"}
              </Button>

              {/* Agrega el MenuDialog */}
              <MenuDialog account={account} isOpen={isMenuDialogOpen} onClose={() => setIsMenuDialogOpen(false)} />
              {account?.landing?.googleBusiness && (
                <Button
                  onClick={() => window.open(account?.landing?.googleBusiness, "_blank")}
                  className={`
        bg-yellow-500 
        hover:bg-yellow-600 
        text-black 
        w-full 
        m-auto 
        font-bold 
        p-6 
        transition-colors 
        duration-300 
        flex 
        items-center 
        space-x-2
        ring-0 
        hover:ring-2
        hover:ring-[${palette.textSecondary}]
      `}
                >
                  Valóranos en Google
                  <Star />
                </Button>
              )}

              {isLoggedInForAccount(account?._id || "") && (
                <>
                  <Button
                    onClick={() => {
                      handleNavigate(`/landing/${slug}/fidelicard/${clientId}`);
                    }}
                    className={`
    ${palette.buttonBackground} 
    ${palette.buttonHover}
    p-6 text-white font-bold transition-colors duration-300
    ring-0 
        hover:ring-2
        hover:ring-[${palette.textSecondary}]
  `}
                  >
                    Mi FideliCard <CreditCard />
                  </Button>

                  <motion.button
                    onClick={() => {
                      logout(account?._id);
                      handleNavigate(`/landing/${slug}`);
                    }}
                    whileHover='hover'
                    initial='rest'
                    animate='rest'
                    variants={{
                      rest: { width: "auto", justifyContent: "center" },
                      hover: {
                        width: 180,
                        justifyContent: "flex-start",
                        transition: {
                          duration: 0.3,
                          type: "tween",
                        },
                      },
                    }}
                    className={`
        ${palette.buttonBackground} 
        ${palette.buttonHover}
        p-2 text-white font-bold 
        flex items-center 
        overflow-hidden 
        absolute top-0 
      `}
                  >
                    <motion.div
                      variants={{
                        rest: {
                          padding: "0.5rem",
                          x: 0,
                        },
                        hover: {
                          padding: "0.5rem",
                          x: 0,
                          transition: {
                            duration: 0.3,
                            type: "tween",
                          },
                        },
                      }}
                      className={`flex items-center ring-0 
        hover:ring-2
        hover:ring-[${palette.textSecondary}]`}
                    >
                      <CiLogout className='mr-2' />

                      <motion.span
                        variants={{
                          rest: {
                            opacity: 0,
                            width: 0,
                            display: "none",
                          },
                          hover: {
                            opacity: 1,
                            width: "auto",
                            display: "block",
                            transition: {
                              duration: 0.3,
                              delay: 0.2,
                            },
                          },
                        }}
                        className='whitespace-nowrap'
                      >
                        Cerrar sesión
                      </motion.span>
                    </motion.div>
                  </motion.button>
                </>
              )}
            </div>

            <Dialog open={isPdfDialogOpen} onOpenChange={setIsPdfDialogOpen}>
              <DialogContent className='p-0 bg-transparent flex justify-center items-center'>
                <DialogHeader className='sr-only'>
                  <DialogTitle>Nuestra Carta</DialogTitle>
                </DialogHeader>
                <ImageViewer account={account} currentPage={currentPage} numPages={numPages} goToPrevPage={goToPrevPage} goToNextPage={goToNextPage} />{" "}
              </DialogContent>
            </Dialog>
            {/* Promociones activas */}
            <div>
              <h2 className={`${!sortedPromotions.length && "hidden"} text-2xl font-bold ${palette.textPrimary} mb-4 text-center`}>Nuestras Promociones</h2>{" "}
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
                          <Card
                            className={`${palette.cardBackground} shadow-lg hover:shadow-xl transition-shadow cursor-pointer relative overflow-hidden h-full`}
                          >
                            {" "}
                            <CardContent
                              className={`${isHot ? "border-4 border-transparent bg-clip-border shadow-fire" : ""} p-6 bg-gradient-to-br ${
                                palette.gradient
                              } text-white rounded-lg h-full flex flex-col justify-between`}
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
                      <DialogContent className={`${palette.background} w-[95%] pt-20 text-white`}>
                        <DialogHeader className='mt-16 flex flex-col m-auto justify-center'>
                          <DialogTitle className='text-white text-2xl'>{promo.title}</DialogTitle>
                          <DialogDescription className='text-gray-300'>{promo.description}</DialogDescription>
                        </DialogHeader>
                        <div className='mt-4 space-y-4 flex flex-col justify-center'>
                          <img src={promo.imageUrl} alt={promo.title} className='w-full md:m-auto md:w-[30vw] rounded-lg' />
                          {promo.systemType === "points" && promo.rewards?.length > 0 && (
                            <div className='mt-4 '>
                              <h3 className='text-lg font-semibold text-white mb-4'>Recompensas</h3>
                              <ul
                                className={`divide-y bg-gradient-to-tr ${palette.gradient} divide-gray-200 rounded-lg border border-gray-300 bg-white shadow-md`}
                              >
                                {promo.rewards.map((reward) => (
                                  <li key={reward._id} className='flex flex-col items-center justify-between p-4 transition'>
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
                            <Alert severity='warning' className={`text-sm text-white ${palette.cardBackground}`}>
                              Esta promoción solo está disponible los días: {applicableDays}. Hoy ({daysOfWeek[today]}) no es un día válido para esta promoción.
                            </Alert>
                          )}

                          {/* Conditions Alert */}
                          <Alert severity='info' className={`text-sm text-gray-300 ${palette.cardBackground}`}>
                            {formatConditions(promo.conditions)}
                          </Alert>
                          {isLoggedInForAccount(account?._id || "") ? (
                            <Alert severity='success' className={`w-full text-sm text-white ${palette.cardBackground}`}>
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
                            <Alert severity='success' className={`w-full text-sm text-white ${palette.cardBackground}`}>
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
              <div className='flex flex-row space-x-6 m-auto'>
                {getSocialLinks().map((link, index) => (
                  <span
                    key={index}
                    onClick={() => window.open(link.href, "_blank", "noopener,noreferrer")}
                    className={`text-white hover:${palette.textSecondary} transition-colors duration-500 transform hover:scale-110 cursor-pointer`}
                  >
                    <link.icon size={28} />
                  </span>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}
