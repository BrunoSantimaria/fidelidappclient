import { Plan } from "../interfaces/types";

export const planList: Plan[] = [
  {
    type: "Free",
    price: 0,
    description: [
      "1 promoción activa",
      "50 clientes activos",
      "Hasta 3 administradores",
      "Reportes generales y por promoción",
      "Apoyo básico de implementación",
    ],
    button: "COMIENZA GRATIS",
  },
  {
    type: "Pro",
    price: 19,
    description: [
      "5 promociones activas",
      "Clientes activos ilimitados",
      "Evaluación y Segmentación Inicial",
      "Apoyo en implementación",
      "Reportes generales y por promoción",
      "Envía emails personalizados a tus clientes",
      "Soporte prioritario",
    ],
    button: "QUIERO COMENZAR",
  },
  {
    type: "Premium",
    price: 99,
    description: [
      "Promociones Ilimitadas",
      "Clientes activos ilimitados",
      "Hasta 5 administradores",
      "Reportes generales y por promoción",
      "Envía emails personalizados a tus clientes",
      "Análisis avanzado de datos a la medida",
      "Account Manager dedicado",
    ],
    button: "HABLEMOS",
  },
];
