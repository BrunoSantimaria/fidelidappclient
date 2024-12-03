import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/api";
import { Backdrop, Button, CircularProgress, Input, Alert, Divider, Card, CardContent, CardActions, Typography, Container, Box } from "@mui/material";
import { Facebook, Instagram, WhatsApp, Language } from "@mui/icons-material";
import { useAuthSlice } from "../../hooks/useAuthSlice";
import { useNavigateTo } from "../../hooks/useNavigateTo";
import background from "../../assets/fondocandado2.png";
import { toast } from "react-toastify";
import { Helmet } from "react-helmet-async";
import React from "react";
import keysPattern from "../../assets/fondocandado2.png";

export const PromotionClient = () => {
  const { id } = useParams();
  const { status, user } = useAuthSlice();
  const { handleNavigate } = useNavigateTo();
  const [loading, setLoading] = useState(true);
  const [promotion, setPromotion] = useState(null);
  const [clientEmail, setClientEmail] = useState("");
  const [clientName, setClientName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accountId, setAccountId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [socialMedia, setSocialMedia] = useState({});
  const [emailError, setEmailError] = useState(false);
  const [nameError, setNameError] = useState(false);

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  useEffect(() => {
    // Check if 'clientid' cookie exists
    const cookies = document.cookie.split(";").map((cookie) => cookie.trim());
    const clientIdCookie = cookies.find((cookie) => cookie.startsWith("clientId"));
    console.log("clientIdCookie", clientIdCookie);

    if (clientIdCookie) {
      const clientId = clientIdCookie.split("=")[1]; // Extract the value of clientid
      console.log(`/promotions/${clientId}/${id}`);
      handleNavigate(`/promotions/${clientId}/${id}`); // Redirect if the cookie exists
      return; // Exit the effect to avoid unnecessary API calls
    }

    const fetchPromotion = async () => {
      try {
        const response = await api.get(`/api/promotions/${id}`);
        setPromotion(response.data.promotion);
        setAccountId(response.data.accountId);
        setSocialMedia(user.accounts.socialMedia || {}); // Extraer redes sociales del usuario
      } catch (error) {
        console.error("Error fetching promotion:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotion();
  }, [id]);
  console.log(promotion);

  const handleEmailChange = (event) => {
    setClientEmail(event.target.value);
    setEmailError(!validateEmail(event.target.value));
  };

  const handleNameChange = (event) => {
    setClientName(event.target.value);
    setNameError(event.target.value.trim() === "");
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    if (emailError || nameError || !clientEmail || !clientName) {
      toast.info("Por favor completa todos los campos obligatorios");
      return;
    }

    try {
      const response = await api.post("/api/promotions/client", {
        promotionId: id,
        clientEmail: clientEmail.trim().toLowerCase(),
        clientName: clientName
          .trim()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(" "),
        clientPhone: phoneNumber.trim(),
        accountId: accountId,
      });

      // Establecer la cookie 'clientId' solo si el cliente se registra correctamente
      const clientId = response.data.client._id;
      document.cookie = `clientId=${clientId}; path=/`; // Establecer la cookie
      toast.success("Has sido agregado a la promoción exitosamente. Serás redirigido a tu Fidelicard.");
      handleNavigate(`/promotions/${clientId}/${id}`);
    } catch (error) {
      if (error.response && error.response.data.error === "Client already has this promotion") {
        toast.info("Ya te encuentras en esta promoción. Serás redirigido a tu Fidelicard.");
        console.log(document.cookie);
        const cookies = document.cookie.split(";").map((cookie) => cookie.trim());

        const clientIdCookie = cookies.find((cookie) => cookie.startsWith("clientId"));
        console.log("clientIdCookie", clientIdCookie);

        if (clientIdCookie) {
          const clientId = clientIdCookie.split("=")[1];
          console.log("clientId extraído:", clientId);
          handleNavigate(`/promotions/${clientId}/${id}`);
        } else {
          // Aquí podrías manejar el caso si no se encuentra la cookie
          console.error("La cookie 'clientId' no se encontró.");
        }
      } else {
        toast.error("Error al sumarte a la promoción. Inténtalo de nuevo.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Backdrop open>
        <CircularProgress color='inherit' />
      </Backdrop>
    );
  }

  if (!promotion) {
    return (
      <div className='relative flex flex-col m-0 text-center justify-center w-screen h-screen'>
        <div
          className='absolute inset-0 bg-cover bg-center'
          style={{
            backgroundImage: `url(${background})`,
            opacity: 0.5,
          }}
        ></div>
        <div className='relative z-10'>
          <div>Esta promoción no existe.</div>
          <div
            onClick={() => handleNavigate("/")}
            className='p-2 bg-main w-[30%] justify-center mx-auto my-10 rounded-md text-white cursor-pointer hover:bg-main/60 duration-300'
          >
            Volver a home.
          </div>
        </div>
      </div>
    );
  }
  const formatTextWithLineBreaks = (text) => {
    return text.split("\r\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    ));
  };
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url(${keysPattern})`,
        backgroundRepeat: "repeat",
        backgroundSize: "700px",
        py: 8,
        position: "relative",
        "&::before": {
          content: '""',
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "white",
          opacity: 0.8,
          zIndex: 0,
          minHeight: "100vh",
        },
      }}
    >
      <Container
        maxWidth='xxl'
        sx={{
          width: { xs: "100%", md: "100%", lg: "95%" },
          position: "relative",
          zIndex: 1,
          bottom: 40,
        }}
      >
        <Card sx={{ borderTop: 4, borderColor: "#5b7898", boxShadow: 3 }}>
          <CardContent sx={{ p: { xs: 3, md: 6 } }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 4,
                alignItems: "center",
              }}
            >
              {/* Formulario con redes sociales integradas */}
              <Box
                className='space-y-6'
                sx={{
                  width: "100%",
                  order: { xs: 1, md: 2 },
                }}
              >
                <Box className='space-y-4'>
                  <Input fullWidth placeholder='Nombre' value={clientName} onChange={handleNameChange} sx={{ bgcolor: "white", p: 1.5 }} />
                  <Input fullWidth type='email' placeholder='Email' value={clientEmail} onChange={handleEmailChange} sx={{ bgcolor: "white", p: 1.5 }} />
                  <Input
                    fullWidth
                    type='tel'
                    placeholder='Número de teléfono (opcional)'
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                    sx={{ bgcolor: "white", p: 1.5 }}
                  />
                  <Button
                    fullWidth
                    variant='contained'
                    onClick={handleSubmit}
                    disabled={isSubmitting || nameError || emailError}
                    sx={{
                      bgcolor: "#5b7898",
                      "&:hover": { bgcolor: "#4a6277" },
                      py: 2,
                      fontSize: "1.125rem",
                    }}
                  >
                    {isSubmitting ? "Sumándose a la promoción..." : "SUMARME A LA PROMOCIÓN"}
                  </Button>
                </Box>

                {/* Redes sociales movidas al final del contenedor */}
                {user?.accounts && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 2,
                      mt: "auto",
                      pt: 4,
                    }}
                  >
                    {user.accounts.logo && <img src={user.accounts.logo} alt='Logo' className='w-[10rem] h-[10rem] object-contain' />}
                    <Box className='flex gap-4'>
                      {user.accounts.socialMedia.instagram && (
                        <a href={user.accounts.socialMedia.instagram} className='text-[#5b7898] hover:text-[#4a6277]'>
                          <Instagram sx={{ fontSize: 28 }} />
                        </a>
                      )}
                      {user.accounts.socialMedia.facebook && (
                        <a href={user.accounts.socialMedia.facebook} className='text-[#5b7898] hover:text-[#4a6277]'>
                          <Facebook sx={{ fontSize: 28 }} />
                        </a>
                      )}
                      {user.accounts.socialMedia.whatsapp && (
                        <a href={`https://wa.me/${user.accounts.socialMedia.whatsapp}`} className='text-[#5b7898] hover:text-[#4a6277]'>
                          <WhatsApp sx={{ fontSize: 28 }} />
                        </a>
                      )}
                      {user.accounts.socialMedia.website && (
                        <a href={user.accounts.socialMedia.website} className='text-[#5b7898] hover:text-[#4a6277]'>
                          <Language sx={{ fontSize: 28 }} />
                        </a>
                      )}
                    </Box>
                  </Box>
                )}
              </Box>

              {/* Contenido de la promoción */}
              <Box
                className='space-y-6'
                sx={{
                  width: "100%",
                  order: { xs: 2, md: 1 },
                }}
              >
                <Box className='space-y-2'>
                  <Typography
                    variant='h3'
                    sx={{
                      fontWeight: "bold",
                      color: "#5b7898",
                      fontSize: { xs: "2rem", md: "3rem" },
                    }}
                  >
                    {promotion.title}
                  </Typography>
                  <Typography variant='body1' color='text.secondary' sx={{ fontSize: "1.125rem" }}>
                    {formatTextWithLineBreaks(promotion.description)}
                  </Typography>
                </Box>

                {promotion.imageUrl && (
                  <Box className='relative rounded-xl overflow-hidden shadow-xl' sx={{ maxWidth: { xs: "100%", lg: "500px" } }}>
                    <img src={promotion.imageUrl} alt='Promoción' className='object-contain w-full' />
                  </Box>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};
