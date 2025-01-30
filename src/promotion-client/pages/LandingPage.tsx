"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Facebook, Instagram, Globe, CreditCard, Star, Search, X, QrCode, Notebook, Gift, Power, Bolt, LockKeyholeOpen, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
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
import { generatePalette } from "../utils/colorPalettes";
import { ImageViewer } from "../components/ImageViewer";
import { LandingNotFound } from "../components/LandingPage/LandingNotFound";
import { Scanner } from "@yudiel/react-qr-scanner";
import { toast } from "react-toastify";
import moment from "moment";
import { Accordion, AccordionSummary, AccordionDetails, Typography, LinearProgress, Alert } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ClientChatbotInteraction } from "@/landing/components/ClientChatbot";
import { ChatBubble } from "@mui/icons-material";
import { ScrollArea } from "@radix-ui/react-scroll-area";

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

const PromotionsDialog = ({
  account,
  isOpen,
  onClose,
  promotions,
  handleRedeemPromotion,
  wasRedeemedToday,
  isPromotionHot,
  redeemingPromotion,
  isLoggedIn,
  totalPoints,
}) => {
  const palette = generatePalette(account?.landing?.colorPalette);
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
              <h1 className={`text-2xl font-bold ${palette.textPrimary}`}>Promociones</h1>
              <button onClick={onClose} className={`p-2 rounded-full hover:${palette.buttonHover}`}>
                <X className={`w-6 h-6 ${palette.textPrimary}`} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className='flex-1 overflow-y-auto'>
            <div className='container mx-auto px-4 py-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-8'>
                {promotions.map((promotion) => {
                  const isRedeemedToday = wasRedeemedToday(promotion, promotions);
                  console.log("isRedeemedToday", isRedeemedToday);
                  const isPointsPromotion = promotion.systemType === "points";

                  return (
                    <motion.div
                      key={promotion._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`${palette.cardBackground} rounded-lg shadow-sm overflow-hidden`}
                    >
                      <div className='p-4'>
                        <h3 className={`font-semibold mb-2 ${palette.textPrimary}`}>{promotion.title}</h3>
                        <p className={`text-sm mb-4 ${palette.textSecondary}`}>{promotion.description}</p>

                        {promotion.imageUrl && <img src={promotion.imageUrl} alt={promotion.title} className='w-full h-48 object-cover' />}

                        {isPointsPromotion ? (
                          <>
                            <Typography className={`text-sm ${palette.textPrimary} mb-2 py-4 `}>
                              Puntos acumulados: <span className='text-bold'>{totalPoints} </span>
                            </Typography>
                            <Accordion
                              sx={{
                                backgroundColor: palette.background.match(/\[(.+?)\]/)[1],
                                "& .MuiAccordionSummary-root": {
                                  color: palette.textPrimary.match(/\[(.+?)\]/)[1],
                                },
                                "& .MuiAccordionDetails-root": {
                                  color: palette.textSecondary.match(/\[(.+?)\]/)[1],
                                },
                                "& .MuiTypography-root": {
                                  color: "inherit",
                                },
                                "& .MuiLinearProgress-root": {
                                  backgroundColor: palette.textSecondary.match(/\[(.+?)\]/)[1] + "40",
                                  "& .MuiLinearProgress-bar": {
                                    backgroundColor: palette.textSecondary.match(/\[(.+?)\]/)[1],
                                  },
                                },
                              }}
                            >
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon className={`${palette.textPrimary}`} />}
                                aria-controls='panel1a-content'
                                id='panel1a-header'
                              >
                                <Typography className={`text-sm `}>Recompensas Disponibles</Typography>
                              </AccordionSummary>
                              <AccordionDetails>
                                {promotion.rewards.map((reward) => (
                                  <div key={reward._id} className='mb-2'>
                                    <Typography className={`text-sm ${palette.textSecondary}`}>{reward.description}</Typography>
                                    <LinearProgress variant='determinate' value={(totalPoints / reward.points) * 100} className='mb-2' />
                                    <Button
                                      onClick={() => {
                                        if (isLoggedIn) {
                                          handleRedeemPromotion(promotion, reward);
                                        } else {
                                          toast.info("Por favor, regístrate o inicia sesión para canjear esta promoción.");
                                        }
                                      }}
                                      disabled={isLoggedIn ? redeemingPromotion || totalPoints < reward.points : false}
                                      className={`w-full ${palette.buttonBackground} ${!redeemingPromotion ? palette.buttonHover : ""}`}
                                    >
                                      {redeemingPromotion
                                        ? "Canjeando..."
                                        : totalPoints < reward.points
                                          ? `Te faltan ${reward.points - totalPoints} punto(s)`
                                          : `Canjear por ${reward.points} punto(s)`}
                                    </Button>
                                  </div>
                                ))}
                              </AccordionDetails>
                            </Accordion>
                          </>
                        ) : (
                          <Button
                            onClick={() => {
                              if (isLoggedIn) {
                                handleRedeemPromotion(promotion);
                              } else {
                                toast.info("Por favor, regístrate o inicia sesión para canjear esta promoción.");
                              }
                            }}
                            disabled={isLoggedIn ? isRedeemedToday || redeemingPromotion : false}
                            className={`w-full mt-4 ${palette.buttonBackground} ${!isRedeemedToday && !redeemingPromotion ? palette.buttonHover : ""} ${isRedeemedToday ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                          >
                            {isLoggedIn
                              ? isRedeemedToday
                                ? "Ya canjeaste hoy"
                                : redeemingPromotion
                                  ? "Canjeando..."
                                  : "Canjear promoción"
                              : "Regístrate o inicia sesión para canjear"}
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const ChatbotDialog = ({ account, isOpen, onClose }) => {
  const palette = generatePalette(account?.landing?.colorPalette);
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
              <h1 className={`text-2xl font-bold ${palette.textPrimary}`}>Chatbot</h1>
              <button onClick={onClose} className={`p-2 rounded-full hover:${palette.buttonHover}`}>
                <X className={`w-6 h-6 ${palette.textPrimary}`} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className='flex-1 overflow-y-auto'>
            <div className='container mx-auto px-4 py-6'>
              <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-8'>
                <ClientChatbot></ClientChatbot>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );

};

export function LandingPage() {
  const { slug } = useParams();
  const [totalPoints, setTotalPoints] = useState(0);
  const { login, logout, isLoggedInForAccount, getClientId } = useAuth();
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPdfDialogOpen, setIsPdfDialogOpen] = useState(false);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [accountNotFound, setAccountNotFound] = useState(false);
  const [isMenuDialogOpen, setIsMenuDialogOpen] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [hasPointPromotion, setHasPointPromotion] = useState(null);
  const [userActivities, setUserActivities] = useState([]);
  const [canRedeemPoints, setCanRedeemPoints] = useState(true);
  const [redeemingPromotion, setRedeemingPromotion] = useState(false);
  const [isPromotionsDialogOpen, setIsPromotionsDialogOpen] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null);
  const [showRedemptionDialog, setShowRedemptionDialog] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [selectedReward, setSelectedReward] = useState(null);

  
  // Cargar la información de la cuenta
  const getAccInfo = async () => {
    if (!slug) return;
    setLoading(true);
    try {
      const response = await api.get(`/api/landing/${slug}`);
      setAccount(response.data);
      if (!response.data) {
        handleNavigate("/");

        return;
      }
      // Si hay un cliente logueado, obtener sus actividades
      if (isLoggedInForAccount(response.data._id)) {
        const clientId = getClientId(response.data._id);

        try {
          console.log("Fetching user data with:", {
            email: clientId,
            accountId: response.data._id,
          });

          const userResponse = await api.get(`/api/landing/${slug}/fidelicard`, {
            params: {
              email: clientId,
              accountId: response.data._id,
            },
          });

          console.log("User Response:", userResponse.data);
          setTotalPoints(userResponse.data.totalPoints);
          // Buscar la promoción de puntos en addedPromotions
          const pointPromotion = userResponse.data.addedPromotions.find((promo) => promo.systemType === "points" && promo.status === "Active");

          if (pointPromotion) {
            console.log("Found point promotion:", pointPromotion);
            setHasPointPromotion({
              _id: pointPromotion._id,
              ...pointPromotion.promotion,
            });
          }

          setUserActivities(userResponse.data.activities);

          // Verificar si ya canjeó puntos hoy usando moment
          const today = moment().startOf("day");
          const hasRedeemedToday = userResponse.data.activities.some((activity) => {
            const activityDate = moment(activity.date).startOf("day");
            return activityDate.isSame(today) && activity.type === "points";
          });

          setCanRedeemPoints(!hasRedeemedToday);
        } catch (error) {
          console.error("Error fetching user data:", error);
          console.error("Error details:", error.response?.data);
        }
      }
    } catch (error) {
      handleNavigate("/");
      console.error(error.response?.data);
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
  {
    /* Si la cuenta no existe retorna landing not found. */
  }
  if (accountNotFound) {
    return <LandingNotFound />;
  }
  const palette = generatePalette(account?.landing?.colorPalette);

  const getClientData = async () => {
    try {
      const response = await api.get(`/api/landing/${slug}/fidelicard`, {
        params: { email: clientId, accountId: account?._id },
      });
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Agregar función para manejar el escaneo
  const handleScan = async (result) => {
    setProcessing(true);

    if (!result) {
      toast.error("No se pudo leer el código QR. Intenta nuevamente.");
      setProcessing(false);
      setShowScanner(false);
      return;
    }

    if (!canRedeemPoints) {
      toast.error("Ya has sumado puntos hoy. Vuelve mañana!");
      setProcessing(false);
      setShowScanner(false);
      return;
    }

    if (!hasPointPromotion) {
      toast.error("No hay una promoción de puntos activa.");
      setProcessing(false);
      setShowScanner(false);
      return;
    }

    const accountQr = result[0].rawValue;

    try {
      const clientId = getClientId(account?._id);
      console.log("Scanning with:", {
        clientEmail: clientId,
        promotionId: hasPointPromotion._id,
        accountQr,
      });

      const response = await api.post("/api/landing/redeem-points", {
        clientId: clientId,
        promotionId: hasPointPromotion._id,
        accountQr,
      });

      toast.success("Visita registrada con éxito ⭐");
      await getAccInfo(); // Refrescar datos
    } catch (error) {
      console.error("Error in handleScan:", error);
      toast.error(error.response?.data?.error || "Error al registrar puntos");
    } finally {
      setProcessing(false);
      setShowScanner(false);
    }
  };

  const handleRedeemPromotion = async (promotion) => {
    if (redeemingPromotion) return;

    try {
      setRedeemingPromotion(true);
      const clientId = getClientId(account?._id);

      const response = await api.post(`/api/landing/${slug}/redeem-promotion`, {
        clientId,
        promotionId: promotion._id,
      });

      toast.success("¡Promoción canjeada con éxito! 🎉", {
        position: "bottom-center",
        autoClose: 3000,
      });

      await getAccInfo();
    } catch (error) {
      toast.error(error.response?.data?.error || "Error al canjear la promoción", {
        position: "bottom-center",
        autoClose: 3000,
      });
    } finally {
      setRedeemingPromotion(false);
    }
  };

  // Función para verificar si una promoción ya fue canjeada hoy
  const wasRedeemedToday = (promotion, allPromotions) => {
    if (!userActivities || !promotion || !allPromotions) return false;

    // Si es una promoción de puntos, siempre permitir el canje
    if (promotion.systemType === "points") {
      return false;
    }

    // Para promociones de visitas, verificar si ya se canjeó alguna hoy
    const currentPromotion = allPromotions.find((p) => p._id === promotion._id);
    if (currentPromotion?.systemType === "visits") {
      const today = moment().startOf("day");
      return userActivities.some((activity) => activity.type === "visit" && moment(activity.date).startOf("day").isSame(today));
    }

    return false;
  };

  const handleRedeemVisitPromotion = (promotion, reward = null) => {
    if (wasRedeemedToday(promotion, account?.promotions || [])) {
      toast.error("Ya has canjeado una promoción de visita hoy. Vuelve mañana!", {
        position: "bottom-center",
        autoClose: 3000,
      });
      return;
    }

    setSelectedPromotion(promotion);
    setSelectedReward(reward); // Guardar el reward seleccionado
    setShowConfirmDialog(true);
  };

  const confirmRedeem = async () => {
    if (!selectedPromotion) return;
    console.log("selectedPromotion", selectedPromotion);
    try {
      setRedeemingPromotion(true);
      const clientId = getClientId(account?._id);

      // Determinar el endpoint según el systemType
      if (selectedPromotion.systemType === "points") {
        await api.post(`/api/landing/redeem-promotion-reward`, {
          email: clientId,
          accountId: account?._id,
          promotionId: selectedPromotion._id,
          rewardId: selectedReward._id,
          points: selectedReward.points,
        });
      } else {
        await api.post(`/api/landing/redeem-hot-promotion`, {
          email: clientId,
          accountId: account?._id,
          promotionId: selectedPromotion._id,
        });
      }

      toast.success("¡Promoción canjeada con éxito! 🎉", {
        position: "bottom-center",
        autoClose: 3000,
      });

      await getAccInfo();
      setShowRedemptionDialog(true);
    } catch (error) {
      console.log("error", error);
      toast.error(error.response?.data?.error || "Error al canjear la promoción", {
        position: "bottom-center",
        autoClose: 3000,
      });
    } finally {
      setRedeemingPromotion(false);
      setShowConfirmDialog(false);
    }
  };


  // Para el chatbot


  useEffect(() => {
    if (showRedemptionDialog) {
      setIsButtonDisabled(true);
      const timer = setTimeout(() => {
        setIsButtonDisabled(false);
      }, 5000); // Deshabilitar el botón por 5 segundos

      return () => clearTimeout(timer);
    }
  }, [showRedemptionDialog]);

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
              {/*  <p className={`mt-2 text-md w-full md:w-2/3 justify-center m-auto ${palette.textSecondary}`}>{account?.landing?.subtitle || ""}</p> */}
            </motion.div>
            {!isLoggedInForAccount(account?._id) && account && (
              <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <AuthDialog
                  accountId={account._id}
                  selectedPalette={palette}
                  onAuthSuccess={(userId, token, clientId) => {
                    login(account._id, userId, token, clientId);
                    getAccInfo();
                    window.location.reload();
                  }}
                  slug={slug}
                />
              </motion.div>
            )}

            <div className='flex flex-col justify-center space-y-6'>
              <MenuDialog account={account} isOpen={isMenuDialogOpen} onClose={() => setIsMenuDialogOpen(false)} />

              {isLoggedInForAccount(account?._id || "") && (
                <>
                  <Button
                    onClick={() => setShowScanner(true)}
                    disabled={!canRedeemPoints}
                    className={`
                      ${!hasPointPromotion ? "hidden" : ""}
    ${palette.buttonBackground} 
    ${palette.buttonHover}
    p-6 text-white font-bold transition-colors duration-300
    ring-0 
        hover:ring-2
        hover:ring-[${palette.textSecondary}]
        ${!canRedeemPoints && "opacity-50 cursor-not-allowed"}
  `}
                  >
                    {canRedeemPoints ? "Sumar puntos" : "Ya sumaste puntos hoy"} <QrCode />
                  </Button>
                </>
              )}
              <Button
                onClick={() => setIsPromotionsDialogOpen(true)}
                className={`
                  ${palette?.buttonBackground} 
                  ${palette?.buttonHover}
                  p-6 text-white font-bold transition-colors duration-300
                  ring-0 
                  hover:ring-2
                  hover:ring-[${palette?.textSecondary}]
                `}
              >
                Promociones <Gift />
              </Button>
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
    ${palette?.buttonBackground} 
    ${palette?.buttonHover}
    text-white font-bold p-6 transition-colors duration-300
    ring-0 
    hover:ring-2
    hover:ring-[${palette.textSecondary}]
  `}
              >
                {account?.landing?.card.title || "Ver nuestra carta"} <Notebook />
              </Button>
              {account?.landing?.googleBusiness && (
                <Button
                  onClick={() => window.open(account?.landing?.googleBusiness, "_blank")}
                  className={`
     
    ${palette.buttonBackground} 
    ${palette?.buttonHover}
    text-white font-bold p-6 transition-colors duration-300
    ring-0 
    hover:ring-2
    hover:ring-[${palette?.textSecondary}]
        hover:ring-[${palette?.textSecondary}]
      `}
                >
                  Valóranos en Google
                  <Star />
                </Button>
              )}
              {isLoggedInForAccount(account?._id || "") && (
                <div className='flex justify-between w-full absolute top-0 right-0 px-6'>
                  <motion.button
                    onClick={() => {
                      logout(account?._id);
                      setTotalPoints;
                      handleNavigate(`/landing/${slug}`);
                    }}
                    whileHover='hover'
                    initial='rest'
                    animate='rest'
                    variants={{
                      rest: { width: "auto" },
                      hover: {
                        width: 180,
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
                    rounded-md
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
                    FideliCard <CreditCard />
                  </Button>
                </div>
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

            {/* Logo y redes sociales */}
            <div className='flex flex-col justify-center'>
              <div className='m-auto mb-6'>{account?.logo && <img src={account.logo} className='w-[12.5rem] h-auto' alt={`${account.name} Logo`} />}</div>
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

              <p className='flex items-center m-auto italic mt-6'>
                Powered by&nbsp;<span className='font-bold'>FidelidApp.cl</span>
                <ShieldCheck className='ml-2' />
              </p>
            </div>
          </>
        )}

        <button onClick={async () => { console.log(getClientData()) }} className={`text-white ${palette.buttonHover}`}>Obtener datos clientes</button>

        {/* Agregar el componente del chatbot */}


      </div>

      {/* Agregar el componente del Scanner */}
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

      {/* Dialogo de promociones */}

      <PromotionsDialog
        account={account}
        isOpen={isPromotionsDialogOpen}
        onClose={() => setIsPromotionsDialogOpen(false)}
        promotions={sortedPromotions}
        handleRedeemPromotion={handleRedeemVisitPromotion}
        wasRedeemedToday={(promotion) => wasRedeemedToday(promotion, account?.promotions || [])}
        isPromotionHot={isPromotionHot}
        redeemingPromotion={redeemingPromotion}
        isLoggedIn={isLoggedInForAccount(account?._id || "")}
        totalPoints={totalPoints}
      />

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent
          className={`
          max-w-[90%] max-h-[80%]
          max-h-fit 
          md:max-h-[30%] 
          overflow-y-scroll 
          p-4 
          rounded-lg 
          shadow-md 
          border border-gray-400 
          ${palette.background}
        `}
        >
          <DialogHeader className='pt-16'>
            <DialogTitle className={`text-lg font-semibold  ${palette.textPrimary}`}>Confirmar Canje</DialogTitle>
            <DialogDescription className={`text-sm ${palette.textSecondary}`}>
              ¿Estás seguro de que deseas canjear la promoción "{selectedPromotion?.title}"?
            </DialogDescription>
            <Alert severity='info' className={`text-sm mb-4 ${palette.textSecondary}`}>
              {selectedPromotion?.conditions}
            </Alert>
            <DialogFooter className='flex justify-end gap-2 mt-4'>
              <Button
                variant='outline'
                className={`
                  text-sm px-4 py-2 
                  ${palette.buttonBackground} 
                  ${palette.buttonHover}
                  ${palette.textPrimary}
                  border-gray-600
                `}
                onClick={() => setShowConfirmDialog(false)}
              >
                Cancelar
              </Button>
              <Button
                disabled={redeemingPromotion}
                className={`
                  text-sm px-4 py-2
    
                  ${palette.buttonHover}
                  ${palette.textPrimary}
                  ${redeemingPromotion ? "opacity-50" : ""}
                `}
                onClick={confirmRedeem}
              >
                Confirmar
              </Button>
            </DialogFooter>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={showRedemptionDialog} onOpenChange={setShowRedemptionDialog}>
        <DialogContent className='h-fit'>
          <DialogHeader>
            <DialogTitle className='pt-8'>Promoción Canjeada</DialogTitle>
            <DialogDescription>
              {selectedPromotion?.systemType === "points" && selectedReward
                ? `Has canjeado "${selectedReward?.description}" por ${selectedReward?.points} puntos.`
                : `Has canjeado la promoción "${selectedPromotion?.title}".`}
            </DialogDescription>
            <div className='mt-4 bg-blue-50 p-4 rounded-lg'>
              <p className='text-sm text-gray-700'>{selectedPromotion?.description}</p>
            </div>
            <Alert severity='success' className='text-left'>
              Muestra este mensaje para validar tu canje. Si no puedes mostrar en tu actividad reciente.
            </Alert>
            <Alert severity='info' sx={{ fontWeight: "bold" }}>
              Canje realizado el: {moment().format("DD/MM/YYYY HH:mm:ss")}
            </Alert>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => {
                setShowRedemptionDialog(false);
                setSelectedPromotion(null);
                setSelectedReward(null);
                setShowConfirmDialog(false);
              }}
              disabled={isButtonDisabled}
            >
              {isButtonDisabled ? "Cargando..." : "Entendido"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
