import { Box, Button, Container, Typography } from "@mui/material";
import background from "../../assets/Cover.jpeg";
import background2 from "../../assets/Cover3.jpeg";
import { useState } from "react";
import { ModalLanding } from "../components/ModalLanding";
import { FaArrowCircleDown } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa6";
import { handleScrollTo } from "../../utils/handleScrollTo";
import { useNavigateTo } from "../../hooks/useNavigateTo";
export const Home = ({ refs }) => {
  const [open, setOpen] = useState(false);
  const whatsappNumber = "56996706983"; // Reemplaza con tu número de WhatsApp
  const message = "¡Hola! Me gustaría obtener una demo de FidelidApp. ¿Cuándo podemos agendar una reunión?";
  const { handleNavigate } = useNavigateTo();
  const handleClick = () => {
    handleNavigate("/auth/login");
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      sx={{
        position: "relative",
        height: { xs: "fit", md: "100vh" },
        maxWidth: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box sx={{ marginTop: { xs: 30, md: 0 }, paddingX: { xs: 2, md: 6 }, textAlign: { xs: "left", sm: "left", md: "left", lg: "left" } }}>
        <Typography
          variant='h3'
          sx={{
            fontWeight: "bold",
            fontSize: { xs: 36, sm: 28, md: 32, lg: 32, xl: "3em" },
            color: "white",
            position: "relative",
            bottom: { xs: 80, sm: 120, md: 150, lg: 0 },
            zIndex: 1,
            width: { xs: "100%", sm: "90%", md: "70%", lg: "60%" },
          }}
        >
          ¡Convierte tus visitas en clientes frecuentes desde hoy!
        </Typography>
        <Typography
          variant='h5'
          sx={{
            fontSize: { xs: 16, sm: 14, md: "1.5em" }, // Texto responsivo
            color: "white",
            position: "relative",
            bottom: { xs: 70, sm: 120, md: 150, lg: 0 },
            zIndex: 1,
            width: { xs: "100%", sm: "90%", md: "70%", lg: "60%" }, // Ajustando ancho
            marginTop: { xs: 1, sm: 2, md: 4 },
          }}
        >
          <span className='w-full leading-6'>
            <span className='font-bold'>¡Convierte tus visitas en clientes frecuentes!</span>
            <br></br> Con Fidelidapp crea y gestiona <span className='font-bold'>programas de lealtad</span> con puntos, promociones, tarjetas virtuales y
            campañas de <span className='font-bold'>email marketing</span> masivo. Aumenta la lealtad de tus clientes. <br></br>
            <span className='font-bold'>¡Prueba gratis hoy!</span>
          </span>
        </Typography>
        <Box sx={{ marginTop: { xs: 1, sm: 2, md: 4 }, display: "flex", flexDirection: { xs: "column", md: "row" }, alignItems: "center" }}>
          <Button
            onClick={handleClick}
            variant='contained'
            sx={{
              position: "relative",
              bottom: { xs: 60, sm: 100, md: 100, lg: 0 },

              minHeight: { xs: "50px", md: "60px", lg: "60px" },
              zIndex: 1,
              width: { xs: "100%", sm: "70%", md: "16vw", lg: "14vw" },
              marginRight: { md: 2 },
              marginBottom: { xs: 2, md: 0 },
              fontSize: { xs: 14, sm: 14, lg: 12, xl: 14 },
            }}
          >
            Registrate Gratis Ahora
          </Button>
          <Button
            variant='contained'
            sx={{
              position: "relative",
              zIndex: 1,
              width: { xs: "100%", sm: "70%", md: "16vw", lg: "14vw" },
              minHeight: { xs: "50px", md: "60px", lg: "60px" },
              marginBottom: { xs: 2, md: 0 },
              bottom: { xs: 60, sm: 100, md: 100, lg: 0 },
              fontSize: { xs: 14, sm: 14, lg: 12, xl: 14 },
            }}
            onClick={handleOpen}
          >
            Escríbenos para conocer más
          </Button>
        </Box>
      </Box>

      <ModalLanding open={open} handleClose={handleClose} />

      <Box
        className='absolute top-0 left-[-600px] md:left-0  md:h-[100px] lg:h-full right-0 bottom-0 md:bottom-[300px] lg:bottom-0 bg-cover bg-left filter blur-sm brightness-[30%] z-0'
        style={{ backgroundImage: `url(${background2})` }}
      />
      <span
        onClick={() => handleScrollTo(refs)}
        className='absolute bg-main rounded-md  bottom-2 animate-bounce duration-1000 p-4 cursor-pointer group hover:bg-white'
      >
        <FaArrowDown className='text-white group-hover:text-main' />
      </span>
    </Box>
  );
};
