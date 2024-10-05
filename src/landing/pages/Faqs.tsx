import React from "react";
import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export const Faqs = () => {
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
    setExpanded(newExpanded ? panel : false);
  };

  interface Faq {
    title: string;
    description: string;
  }

  const faqList: Faq[] = [
    {
      title: "¿En qué consiste el análisis inicial de mi negocio?",
      description:
        "Antes de implementar cualquier promoción, realizamos un análisis profundo de tu negocio y de tu base de clientes. Esto nos permite entender tus desafíos específicos y crear un plan de fidelización que esté alineado con tus objetivos y necesidades.",
    },
    {
      title: "¿Cómo ayuda Fidelidapp a segmentar a mis clientes?",
      description:
        "Fidelidapp te ofrece herramientas para segmentar a tus clientes según sus comportamientos y preferencias. Esto te permite crear campañas personalizadas que resuenen mejor con cada grupo de clientes, aumentando la efectividad de tus promociones y mejorando la experiencia del cliente.",
    },
    {
      title: "¿Qué beneficios tiene la segmentación de clientes para mi negocio?",
      description:
        "Al segmentar a tus clientes, puedes dirigir promociones específicas que aborden sus necesidades particulares. Esto no solo mejora la relevancia de tus ofertas, sino que también incrementa la probabilidad de que los clientes respondan positivamente, resultando en una mayor fidelización y un incremento en el valor de vida del cliente (CLV).",
    },
    {
      title: "¿Cómo puede Fidelidapp ayudarme a fidelizar a mis clientes?",
      description:
        "Fidelidapp te ofrece herramientas personalizadas para crear promociones y recompensas que mantienen a tus clientes comprometidos y satisfechos. A través de campañas diseñadas específicamente para tu negocio, podrás incentivar visitas recurrentes y aumentar la lealtad de tus clientes.",
    },
    {
      title: "¿Qué tipo de promociones puedo crear con Fidelidapp?",
      description:
        "Con Fidelidapp, puedes diseñar una variedad de promociones, desde descuentos por compras repetidas hasta programas de puntos y recompensas especiales. Nuestro equipo te asesora para que elijas la estrategia que mejor se adapta a tus objetivos y al perfil de tus clientes.",
    },
    {
      title: "¿Cómo me acompaña Fidelidapp durante la implementación?",
      description:
        "Nuestro equipo te guiará paso a paso en la configuración de tu cuenta y la creación de tus primeras promociones. Además, te brindamos capacitación personalizada para que tu equipo saque el máximo provecho de la plataforma y puedas lanzar campañas exitosas desde el primer día.",
    },
    {
      title: "¿Cómo Fidelidapp mejora la relación con mis clientes?",
      description:
        "Fidelidapp te permite comunicarte de manera efectiva y directa con tus clientes, enviándoles promociones y ofertas que realmente les interesan. Al personalizar tu enfoque, lograrás una relación más cercana y una mayor satisfacción, lo que se traduce en un aumento en la retención de clientes.",
    },
    {
      title: "¿Qué soporte ofrece Fidelidapp para maximizar mis resultados?",
      description:
        "Nuestro equipo de soporte está disponible para ayudarte en cada etapa del proceso. Desde la configuración inicial hasta la optimización continua de tus campañas, estamos aquí para asegurar que Fidelidapp te brinde los mejores resultados posibles en términos de fidelización y crecimiento del cliente.",
    },
  ];

  return (
    <Box sx={{ marginTop: "60px", padding: "0 20px" }}>
      <Typography variant='h4' sx={{ textAlign: "center", marginBottom: "30px" }}>
        Preguntas Frecuentes
      </Typography>
      {faqList.map((faq, index) => (
        <Accordion
          sx={{ width: "100%", margin: "0 auto", marginBottom: "10px" }}
          key={index}
          expanded={expanded === `panel${index}`}
          onChange={handleChange(`panel${index}`)}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel${index}-content`} id={`panel${index}-header`}>
            <Typography sx={{ fontWeight: "bold" }}>{faq.title}</Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ width: "100%", textAlign: "left" }}>
            <Typography sx={{ maxWidth: "80%" }}>{faq.description}</Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};
