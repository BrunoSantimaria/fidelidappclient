import { Plan } from "../interfaces/types";

export const planList: Plan[] = [
  {
    type: "Gratis",

    description: ["1 promoción activa", "1 agenda activa", "Hasta 250 clientes", "Carga de Clientes por CSV", "Reportes y métricas", "Soporte básico"],
    button: "COMIENZA GRATIS",
  },
  {
    type: "Premium",
    price: "49.990",
    description: [
      "Promociones ilimitadas",
      "Agenda ilimitada",
      "ChatBot",
      "Segmentación de clientes",
      "Email marketing personalizados hasta 10 mil correos por mes",
      "Carga de Clientes por CSV",
      "Reportes generales y por promoción",
      "Evaluación y segmentación inicial",
      "Asistencia en implementación",
    ],
    button: "QUIERO COMENZAR",
  },

  {
    type: "Servicios Extras",

    description: [
      "Activación On Site",
      "Campañas SMS",
      "Gestión de Google y Meta Ads",
      "Gestión de RRSS",
      "Email Marketing Personalizado (Diseño y Envío)",
      "Creación de Landing Page corporativa",
      "Soporte 24/7",
    ],
    button: "HABLEMOS",
  },
];
