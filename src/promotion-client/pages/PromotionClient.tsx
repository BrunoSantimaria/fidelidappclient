import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/api";
import { Backdrop, Button, CircularProgress, Input, Alert, Divider, duration } from "@mui/material";
import { Facebook, Instagram, WhatsApp } from "@mui/icons-material"; // Importar íconos de redes sociales
import { useAuthSlice } from "../../hooks/useAuthSlice";
import { useNavigateTo } from "../../hooks/useNavigateTo";
import background from "../../assets/fondocandado2.png";
import { toast } from "react-toastify";

export const PromotionClient = () => {
  const { id } = useParams();
  const { status } = useAuthSlice();
  const { handleNavigate } = useNavigateTo();
  const [loading, setLoading] = useState(true);
  const [promotion, setPromotion] = useState(null);
  const [clientEmail, setClientEmail] = useState("");
  const [clientName, setClientName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accountId, setAccountId] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [logo, setLogo] = useState("");
  const [socialMedia, setSocialMedia] = useState({});
  const [emailError, setEmailError] = useState(false);
  const [nameError, setNameError] = useState(false);

  const handlePhoneNumberChange = (event) => {
    setPhoneNumber(event.target.value);
  };

  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        const response = await api.get(`/api/promotions/${id}`);
        setPromotion(response.data.promotion);
        setAccountId(response.data.accountId);
        setLogo(response.data.accountLogo);
        setSocialMedia(response.data.accountSocialMedia[0]); // Asumiendo que solo tienes una entrada en el array de socialMedia
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching promotion:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotion();
  }, [id]);

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
    if (emailError || nameError) {
      return;
    }

    try {
      await api.post("/api/promotions/client", {
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
      toast.success("Has sido agregado a la promoción exitosamente. Enviaremos tu Fidelicard a tu correo!.");
      setClientEmail("");
      setClientName("");
      setPhoneNumber("");
    } catch (error) {
      console.log(error.response.data.error);
      if (error.response.data.error === "Client already has this promotion") {
        return toast.info("Ya te encuentras en esta promoción.");
      }
      toast.error("Error al sumarte a la promoción. Inténtalo de nuevo.");
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

  return (
    <section className='relative flex flex-col justify-center place-items-center space-y-6 w-full h-full md:h-screen bg-gradient-to-br from-gray-50 to-main/50'>
      <div className='flex flex-col md:flex-row justify-between w-full max-w-6xl mx-auto'>
        <div className='relative z-10 w-[100%] md:w-[60%] space-y-6 m-0 text-left p-6 rounded-md'>
          <div className='space-y-2 flex flex-col mb-6'>
            <p className='flex flex-col'>Para ser agregado a la promoción, inscribe tu nombre y email a continuación:</p>

            {nameError && <Alert severity='error'>El nombre no puede estar vacío.</Alert>}
            <Input
              id='name'
              type='name'
              value={clientName}
              onChange={handleNameChange}
              autoComplete='name'
              sx={{ padding: "12px", border: "1px solid #ccc", borderRadius: "4px", backgroundColor: "#ffff" }}
              placeholder='Nombre'
            />

            {emailError && <Alert severity='error'>Introduce un email válido.</Alert>}
            <Input
              id='email'
              type='email'
              value={clientEmail}
              onChange={handleEmailChange}
              autoComplete='email'
              sx={{ padding: "12px", border: "1px solid #ccc", borderRadius: "4px", backgroundColor: "#ffff" }}
              placeholder='Email'
            />

            <Input
              id='phone'
              type='tel'
              value={phoneNumber}
              onChange={handlePhoneNumberChange}
              placeholder='Número de teléfono (opcional)'
              sx={{ padding: "12px", border: "1px solid #ccc", borderRadius: "4px", backgroundColor: "#ffff" }}
            />

            <Button variant='contained' onClick={handleSubmit} disabled={isSubmitting || nameError || emailError}>
              {isSubmitting ? "Sumándose a la promoción..." : "Sumarme a la promoción."}
            </Button>
          </div>

          <h1 className='font-poppins font-bold text-5xl'>{promotion.title}</h1>
          <p className='font-poppins text-lg'>{promotion.description}</p>
        </div>

        {/* Imagen de la promoción */}
        {promotion.imageUrl && (
          <div className='relative w-[95%] md:w-[35%] mb-12 mx-auto md:mx-0'>
            <img src={promotion.imageUrl} alt='Promoción' className='rounded-lg shadow-md object-cover w-full h-full' />
          </div>
        )}
      </div>
      <Divider sx={{ color: "white", width: "60%" }} />
      {/* Footer con logo y redes sociales */}
      {(logo || (socialMedia && (socialMedia.instagram || socialMedia.facebook || socialMedia.whatsapp))) && (
        <footer className='flex flex-row items-center justify-center mt-12 p-6  r'>
          {logo && <img src={logo} alt='Logo' className='w-40 h-40  mb-4' />}

          <div className='flex space-x-4'>
            {socialMedia.instagram && (
              <a href={socialMedia.instagram} target='_blank' rel='noopener noreferrer'>
                <Instagram sx={{ fontSize: 40, color: "black" }} />
              </a>
            )}
            {socialMedia.facebook && (
              <a href={socialMedia.facebook} target='_blank' rel='noopener noreferrer'>
                <Facebook sx={{ fontSize: 40, color: "black" }} />
              </a>
            )}
            {socialMedia.whatsapp && (
              <a href={`https://wa.me/${socialMedia.whatsapp}`} target='_blank' rel='noopener noreferrer'>
                <WhatsApp sx={{ fontSize: 40, color: "black" }} />
              </a>
            )}
          </div>
        </footer>
      )}
    </section>
  );
};

// import { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import api from "../../utils/api";
// import { Backdrop, Button, CircularProgress, TextField } from "@mui/material";
// import { useAuthSlice } from "../../hooks/useAuthSlice";
// import { useNavigateTo } from "../../hooks/useNavigateTo";
// import background from "../../assets/fondocandado2.png";
// import { toast } from "react-toastify";
// import ColorThief from "colorthief";

// const isDark = (r, g, b) => r * 0.299 + g * 0.587 + b * 0.114 < 128;

// const extractColorsFromLogo = (logoUrl, setGradientColors, setTextColor) => {
//   const img = new Image();
//   img.src = logoUrl;
//   img.crossOrigin = "Anonymous"; // Para evitar problemas de CORS

//   img.onload = () => {
//     const colorThief = new ColorThief();

//     // Obtener una paleta de colores (5 colores dominantes)
//     const colors = colorThief.getPalette(img, 5);
//     const avgColor = colors.reduce(
//       (acc, [r, g, b]) => {
//         acc.r += r;
//         acc.g += g;
//         acc.b += b;
//         return acc;
//       },
//       { r: 0, g: 0, b: 0 }
//     );

//     // Calcular el color promedio de la paleta
//     const colorCount = colors.length;
//     const averageColor = {
//       r: Math.floor(avgColor.r / colorCount),
//       g: Math.floor(avgColor.g / colorCount),
//       b: Math.floor(avgColor.b / colorCount),
//     };

//     // Usar el color promedio para determinar si el fondo es claro u oscuro
//     const newTextColor = isDark(averageColor.r, averageColor.g, averageColor.b) ? "#FFFFFF" : "#000000";
//     setTextColor(newTextColor);

//     // Crear un degradado de dos colores basado en el color promedio
//     const gradientColor1 = `rgb(${averageColor.r},${averageColor.g},${averageColor.b})`;
//     const gradientColor2 = `rgb(${Math.min(averageColor.r + 60, 255)},${Math.min(averageColor.g + 60, 255)},${Math.min(averageColor.b + 60, 255)})`;
//     setGradientColors([gradientColor1, gradientColor2]);
//   };
// };

// export const PromotionClient = () => {
//   const { id } = useParams();
//   const { status, user } = useAuthSlice();
//   const { handleNavigate } = useNavigateTo();
//   const [loading, setLoading] = useState(true);
//   const [promotion, setPromotion] = useState(null);
//   const [clientEmail, setClientEmail] = useState("");
//   const [clientName, setClientName] = useState("");
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [accountId, setAccountId] = useState("");

//   // Estado para el degradado y el color del texto
//   const [gradientColors, setGradientColors] = useState(["#ffffff", "#ffffff"]);
//   const [textColor, setTextColor] = useState("#000000");

//   // Cargar los colores del logo
//   useEffect(() => {
//     const fetchPromotion = async () => {
//       try {
//         const response = await api.get(`/api/promotions/${id}`);
//         setPromotion(response.data.promotion);
//         setAccountId(response.data.accountId);

//         // Extraer colores del logo de la cuenta del usuario
//         if (user?.accounts?.logo) {
//           extractColorsFromLogo(user.accounts.logo, setGradientColors, setTextColor);
//         }
//       } catch (error) {
//         console.error("Error fetching promotion:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPromotion();
//   }, [id, user]);

//   const handleEmailChange = (event) => {
//     setClientEmail(event.target.value);
//   };
//   const handleNameChange = (event) => {
//     setClientName(event.target.value);
//   };

//   const handleSubmit = async () => {
//     if (!clientEmail) {
//       return toast.info("Por favor, ingresa un email válido.");
//     }

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(clientEmail)) return toast.info("Por favor, ingresa un email válido.");
//     if (!clientName || clientName.trim().length < 2) {
//       toast.info("Debes ingresar un nombre.");
//     }
//     setIsSubmitting(true);

//     try {
//       await api.post("/api/promotions/client", {
//         promotionId: id,
//         clientEmail: clientEmail.trim(),
//         clientName: clientName.trim(),
//         accountId: accountId,
//       });
//       toast.success("Te has sumado exitosamente a la promoción.");
//       setClientEmail("");
//       setClientName("");
//     } catch (error) {
//       console.log(error.response.data.error);
//       if (error.response.data.error === "Client already has this promotion") return toast.info("Ya te encuentras en esta promoción.");
//       toast.error("Error al sumarte a la promoción. Inténtalo de nuevo.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (loading) {
//     return (
//       <Backdrop open>
//         <CircularProgress color='inherit' />
//       </Backdrop>
//     );
//   }

//   if (!promotion) {
//     return (
//       <div className='relative flex flex-col m-0 text-center justify-center w-screen h-screen'>
//         <div
//           className='absolute inset-0 bg-cover bg-center'
//           style={{
//             backgroundImage: `url(${background})`,
//             opacity: 0.5,
//           }}
//         ></div>
//         <div className='relative z-10'>
//           <div>Esta promoción no existe.</div>
//           <div
//             onClick={() => handleNavigate("/")}
//             className='p-2 bg-main w-[30%] justify-center mx-auto my-10 rounded-md text-white cursor-pointer hover:bg-main/60 duration-300'
//           >
//             Volver a home.
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <section
//       className='relative flex flex-col justify-center place-items-center space-y-6 w-full h-full md:h-screen'
//       style={{
//         background: `linear-gradient(to bottom right, ${gradientColors[0]}, ${gradientColors[1]})`,
//       }}
//     >
//       <div className='flex flex-col md:flex-row justify-between w-full max-w-6xl mx-auto mt-10'>
//         <div className='relative z-10 w-[95%] md:w-[60%] space-y-6 m-0 text-left p-6 rounded-md'>
//           <h1 className={`font-poppins font-bold text-5xl`} style={{ color: textColor }}>
//             {promotion.title}
//           </h1>
//           <p className={`font-medium`} style={{ color: textColor }}>
//             {promotion.description}
//           </p>
//           <div>
//             <p className='italic' style={{ color: textColor }}>
//               La promoción se activa con: {promotion.visitsRequired} visitas en {promotion.promotionDuration} días.
//             </p>
//             <p className='italic' style={{ color: textColor }}>
//               Términos y condiciones aplican, serán enviados a tu correo una vez inscrito a la promoción
//             </p>
//           </div>
//           <div className='space-y-2 flex flex-col mb-6' style={{ color: textColor }}>
//             <p className='flex flex-col' style={{ color: textColor }}>
//               Para ser agregado a la promoción, inscribe tu nombre y email a continuación:
//             </p>
//             <TextField label='Nombre' variant='filled' sx={{ width: "100%" }} value={clientName} onChange={handleNameChange} />

//             <TextField label='Email' variant='filled' sx={{ width: "100%" }} value={clientEmail} onChange={handleEmailChange} />
//             <Button variant='contained' onClick={handleSubmit} disabled={isSubmitting}>
//               {isSubmitting ? "Sumándose a la promoción..." : "Sumarme a la promoción."}
//             </Button>
//           </div>
//         </div>

//         <div className='relative z-10 w-[95%] md:w-[40%] flex justify-center'>
//           <div className='w-full h-120 ml-6 rounded-md overflow-hidden bg-gray-200 shadow-md'>
//             <img src={promotion.imageUrl} alt='Promotion' className='object-cover w-full h-full' />
//           </div>
//         </div>
//       </div>
//       <div className='flex flex-col w-[50%]'>
//         {user.accounts.logo && (
//           <div className='w-[20%]'>
//             <img src={user.accounts.logo} alt='Logo' className=' p-6' />
//           </div>
//         )}
//       </div>
//       <Backdrop open={isSubmitting} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
//         <CircularProgress color='inherit' />
//         <div className='mt-2 text-white'>Sumándose a la promoción...</div>
//       </Backdrop>
//     </section>
//   );
// };
