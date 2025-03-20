"use client";

import { FadeIn } from "@/landing/components/animations/FadeIn";
import { motion } from "framer-motion";
import { Database, Mail, Tag, MessageSquare, BarChart2, Gift, ArrowRight, Check, Calendar } from "lucide-react";

const features = [
  {
    name: "Gestión de Promociones",
    description: "Aumenta tus ventas con descuentos y promociones personalizadas.",
    icon: Tag,
    details: [
      "Cupones y códigos de descuento",
      "Promociones por tiempo limitado",
      "Ofertas personalizadas según historial de compra",
      "Automatización de campañas promocionales",
      "Seguimiento del rendimiento de cada promoción"
    ],
  },
  {
    name: "Programas de Fidelización",
    description: "Recompensa a tus clientes y fomenta su lealtad con incentivos atractivos.",
    icon: Gift,
    details: [
      "Sistema de puntos por compras",
      "Niveles de recompensas exclusivas",
      "Bonos por referidos",
      "Tarjetas de fidelidad digitales",
      "Seguimiento del uso y efectividad del programa"
    ],
  },
  {
    name: "Campañas de Email Marketing",
    description: "Conéctate con tus clientes a través de emails automatizados y personalizados.",
    icon: Mail,
    details: [
      "Envío de campañas segmentadas",
      "Plantillas de email personalizables",
      "Automatización de correos por eventos",
      "Análisis de aperturas y clics en tiempo real",
      "A/B testing para optimización"
    ],
  },
  {
    name: "Gestión de Agenda",
    description: "Optimiza tu tiempo y el de tus clientes con un sistema de reservas eficiente.",
    icon: Calendar,
    details: [
      "Calendario interactivo para citas",
      "Reservas en línea 24/7",
      "Recordatorios automáticos por email y SMS",
      "Gestión de disponibilidad y horarios",
      "Historial y seguimiento de citas"
    ],
  },
  {
    name: "Base de Datos de Clientes y Segmentación",
    description: "Organiza y aprovecha los datos de tus clientes para personalizar su experiencia.",
    icon: Database,
    details: [
      "Segmentación avanzada según comportamiento",
      "Historial de compras y preferencias",
      "Gestión de perfiles con información detallada",
      "Importación y exportación de datos",
      "Etiquetas y categorías personalizadas"
    ],
  },
  {
    name: "Informes en Tiempo Real",
    description: "Toma decisiones basadas en datos con reportes detallados y métricas clave.",
    icon: BarChart2,
    details: [
      "Panel de control con métricas en tiempo real",
      "Análisis de tendencias y patrones de compra",
      "Reportes exportables en distintos formatos",
      "Seguimiento de campañas y promociones",
      "KPIs personalizados para evaluar el rendimiento"
    ],
  },
  
];

export const Features = () => {
  return (
    <div className='py-16 '>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <FadeIn>
          <div className='text-center'>
            <h2 className='text-base text-main font-semibold tracking-wide uppercase'>Funcionalidades</h2>
            <p className='mt-2 text-4xl font-extrabold text-main sm:text-5xl'>Todo lo que necesitas para fidelizar a tus clientes</p>
          </div>
        </FadeIn>

        <div className='mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {features.map((feature, index) => (
            <FadeIn key={feature.name} delay={index * 0.1}>
              <motion.div className='relative bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300' whileHover={{ y: -5 }}>
                <div className='flex items-center space-x-4 mb-4'>
                  <div className='flex-shrink-0'>
                    <div className='flex items-center justify-center h-12 w-12 rounded-lg bg-main text-white'>
                      <feature.icon className='h-6 w-6' />
                    </div>
                  </div>
                  <h3 className='text-xl font-bold text-gray-900'>{feature.name}</h3>
                </div>

                <p className='text-gray-500 mb-6'>{feature.description}</p>

                <ul className='space-y-3 mb-6'>
                  {feature.details.map((detail, i) => (
                    <motion.li
                      key={i}
                      className='flex items-start'
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Check className='h-5 w-5 text-green-500 mr-2 flex-shrink-0' />
                      <span className='text-gray-600'>{detail}</span>
                    </motion.li>
                  ))}
                </ul>

                <motion.div className='absolute bottom-6 right-6' whileHover={{ x: 5 }} transition={{ type: "spring", stiffness: 400 }}>
                  <a
                    href={`/features#${feature.name.toLowerCase().replace(/\s+/g, "-").replace(/\//g, "-")}`}
                    className='inline-flex items-center text-main font-medium'
                  >
                    Conoce más
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </a>
                </motion.div>
              </motion.div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={0.5}>
          <div className='mt-12 text-center'>
            <a
              href='/auth/login#register'
              className='inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-main transition-all duration-300 transform hover:text-white hover:scale-105'
            >
              Empieza ahora
              <ArrowRight className='ml-2 -mr-1 h-5 w-5' />
            </a>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};
