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
        height: { xs: "100vh", md: "100vh" },
        maxWidth: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box sx={{ marginTop: { xs: 20, md: 0 }, paddingX: { xs: 2, md: 6 }, textAlign: { xs: "left", sm: "left", md: "center", lg: "left" } }}>
        <Typography
          variant='h3'
          sx={{
            fontWeight: "bold",
            fontSize: { xs: 40, sm: 28, md: 32, lg: 32, xl: "3em" },
            color: "white",
            position: "relative",
            bottom: { xs: 80, sm: 120, md: 150, lg: 0 },
            zIndex: 1,
            width: { xs: "100%", sm: "90%", md: "70%", lg: "60%" },
          }}
        >
          Programas de Lealtad y Fidelidad
        </Typography>
        <Typography
          variant='h5'
          sx={{
            fontSize: { xs: 16, sm: 14, md: "1.5em" }, // Texto responsivo
            color: "white",
            position: "relative",
            bottom: { xs: 70, sm: 120, md: 150, lg: 0 },
            zIndex: 1,
            width: { xs: "100%", sm: "90%", md: "50%", lg: "40%" }, // Ajustando ancho
            marginTop: { xs: 1, sm: 2, md: 4 },
          }}
        >
          <span className=' leading-9'>
            Programas de Lealtad y Fidelización Personalizados Lleva la fidelización de tus clientes al siguiente nivel con Fidelidapp. Diseña promociones
            exclusivas y tarjetas de fidelidad virtuales adaptadas a tu negocio. ¡<span className='underline font-bold'>Sin costo inicial</span>! Descubre cómo
            puedes aumentar la lealtad de tus clientes hoy mismo.{" "}
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
            Escríbenos para conocer más.
          </Button>
        </Box>
        <Typography
          sx={{
            color: "white",
            position: "relative",
            zIndex: 1,
            bottom: { xs: 60, md: 60, lg: 0 },
            width: { xs: "100%", sm: "90%", md: "50%", lg: "40%" }, // Ajustando ancho
            marginTop: { xs: 1, sm: 2, md: 4 },
            fontStyle: "italic",
            fontSize: { xs: 14, sm: 12, md: "inherit" }, // Ajustando tamaño de fuente
          }}
        >
          Sin compromiso. Conoce cómo podemos ayudarte a fidelizar a tus clientes.
        </Typography>
      </Box>

      <ModalLanding open={open} handleClose={handleClose} />

      <Box
        className='absolute top-0 left-[-600px] md:left-0  md:h-[100px] lg:h-full right-0 bottom-0 md:bottom-[300px] lg:bottom-0 bg-cover bg-left filter blur-sm brightness-[50%] z-0'
        style={{ backgroundImage: `url(${background2})` }}
      />
      <span
        onClick={() => handleScrollTo(refs)}
        className='absolute bg-main rounded-md  bottom-6 animate-bounce duration-1000 p-4 cursor-pointer group hover:bg-white'
      >
        <FaArrowDown className='text-white group-hover:text-main' />
      </span>
    </Box>
  );
};
