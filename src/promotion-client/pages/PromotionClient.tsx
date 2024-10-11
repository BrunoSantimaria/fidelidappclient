import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../utils/api";
import { Backdrop, Button, CircularProgress, TextField } from "@mui/material";
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

  console.log(promotion);

  // if (status && status === "authenticated") handleNavigate(`/dashboard/promotion/${id}`);

  useEffect(() => {
    const fetchPromotion = async () => {
      try {
        const response = await api.get(`/api/promotions/${id}`);
        setPromotion(response.data);
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
  };
  const handleNameChange = (event) => {
    setClientName(event.target.value);
  };

  const handleSubmit = async () => {
    if (!clientEmail) {
      toast.info("Por favor, ingresa un email válido.");

      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(clientEmail)) toast.info("Por favor, ingresa un email válido.");
    if (!clientName || clientName.trim().length < 2) {
      toast.info("Debes ingresar un nombre.");
    }
    setIsSubmitting(true);
    try {
      await api.post("/api/promotions/client", {
        promotionId: id,
        clientEmail: clientEmail,
        clientName: clientName,
      });
      toast.success("Te has sumado exitosamente a la promoción.");
      setClientEmail("");
      setClientName("");
    } catch (error) {
      console.log(error);

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
    <section className='relative flex flex-col justify-center place-items-center space-y-6 w-full h-full md:h-screen  bg-gradient-to-br from-gray-50 to-main/50'>
      <div className='flex flex-col md:flex-row justify-between w-full max-w-6xl mx-auto'>
        <div className='relative z-10  w-[95%] md:w-[60%] space-y-6  m-0 text-left p-6 rounded-md '>
          <h1 className='font-poppins font-bold text-5xl'>{promotion.title}</h1>
          <p className='font-medium'>{promotion.description}</p>
          <div>
            <p className='italic'>
              La promoción se activa con: {promotion.visitsRequired} visitas en {promotion.promotionDuration} días.
            </p>
            <p className='italic'>Términos y condiciones aplican, serán enviados a tu correo una vez inscrito a la promoción</p>
          </div>
          <div className='space-y-2 flex flex-col mb-6'>
            <p className='flex flex-col'>Para ser agregado a la promoción, inscribe tu nombre y email a continuación:</p>
            <TextField label='Nombre' variant='filled' sx={{ width: "100%" }} value={clientName} onChange={handleNameChange} />

            <TextField label='Email' variant='filled' sx={{ width: "100%" }} value={clientEmail} onChange={handleEmailChange} />
            <Button variant='contained' onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? "Sumándose a la promoción..." : "Sumarme a la promoción."}
            </Button>
          </div>
        </div>

        <div className='relative z-10 w-[95%] md:w-[40%] flex justify-center'>
          <div className='w-full h-120 ml-6 rounded-md overflow-hidden bg-gray-200 shadow-md'>
            <img src={promotion.imageUrl} alt='Promotion' className='object-cover w-full h-full' />
          </div>
        </div>
      </div>

      <Backdrop open={isSubmitting} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color='inherit' />
        <div className='mt-2 text-white'>Sumándose a la promoción...</div>
      </Backdrop>
    </section>
  );
};
