import { Plan } from "../interfaces/types";

export const planList: Plan[] = [
  {
    type: "Gratis",

    description: ["1 promoción activa", "Agenda", "Maximo 250 clientes", "Carga de Clientes por CSV", "Reportes generales y por promoción"],
    button: "COMIENZA GRATIS",
  },
  {
    type: "Premium",
    price: "49.990",
    description: [
      "10 promociones activas",
      "Agenda",
      "Clientes activos ilimitados",
      "Email marketing personalizados hasta 10 mil correos por mes",
      "Carga de Clientes por CSV",
      "Reportes generales y por promoción",
      "Evaluación y segmentación inicial",
      "Apoyo en implementación",
    ],
    button: "QUIERO COMENZAR",
  },
  {
    type: "Servicios Extras",

    description: [
      "Activación Presencial",
      "Impresión de Pendones / Afiches",
      "Gestión de RRSS",
      "Email Marketing Personalizado (Diseño y Envío)",
      "Creaciónde Landing Page",
      "Estrategia / Implementación Google Ads",
    ],
    button: "HABLEMOS",
  },
];
