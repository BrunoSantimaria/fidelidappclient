import { Container, Typography, useMediaQuery, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import PeopleIcon from "@mui/icons-material/People";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";

const steps = [
  {
    icon: <PeopleIcon className='text-[#5b7898] text-2xl' />,
    title: "Construimos y fortalecemos tu base de clientes",
    description: "Ya sea que tengas una base de clientes o necesites crearla, te acompañamos a dar el siguiente paso.",
    number: 1,
  },
  {
    icon: <TrendingUpIcon className='text-[#5b7898] text-2xl' />,
    title: "Identificamos segmentos en tus clientes",
    description: "Analizamos y descubrimos las tendencias de compra de tus clientes.",
    number: 2,
  },
  {
    icon: <EmojiEmotionsIcon className='text-[#5b7898] text-2xl' />,
    title: "Cuidamos la Satisfacción de Clientes",
    description: "Entendemos lo que realmente le importa a tus clientes y generamos propuestas de valor para atenderlo.",
    number: 3,
  },
];

export const Steps = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <Container maxWidth='lg' className='py-16'>
      <motion.div initial='hidden' animate='visible' variants={containerVariants} className='space-y-12'>
        <motion.div variants={itemVariants} className='text-center space-y-4'>
          <Typography variant='h3' className='text-[#5b7898] font-bold'>
            ¿Qué hacemos por tu negocio?
          </Typography>
          <Typography variant='subtitle1' className='text-gray-600'>
            Potenciamos tu negocio con soluciones efectivas de fidelización
          </Typography>
        </motion.div>

        <div className='space-y-8'>
          {steps.map((step, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`flex ${isMobile ? "flex-col gap-4" : "items-center gap-8"} ${index % 2 === 1 && !isMobile ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`flex-1 bg-white rounded-lg border border-[#5b7898]/20 p-6 
                ${index % 2 === 1 && !isMobile ? "text-right" : ""}`}
              >
                <div
                  className={`flex items-center gap-3 mb-3 
                  ${index % 2 === 1 && !isMobile ? "flex-row-reverse" : ""}`}
                >
                  {step.icon}
                  <Typography variant='h6' className='text-[#5b7898] font-semibold'>
                    {step.title}
                  </Typography>
                </div>
                <Typography variant='body1' className='text-gray-600'>
                  {step.description}
                </Typography>
              </div>

              <div
                className={`hidden md:flex w-16 h-16 rounded-full bg-[#5b7898] 
                text-white items-center justify-center text-2xl font-bold
                ${isMobile ? "mx-auto" : ""}`}
              >
                {step.number}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Container>
  );
};
