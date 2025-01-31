"use client";

import { FadeIn } from "@/landing/components/animations/FadeIn";
import { motion } from "framer-motion";
import { Database, Mail, MessageSquare, BarChart2, Gift, ArrowRight, Check, Calendar } from "lucide-react";

const features = [
  {
    name: "Base de Datos de Clientes",
    description: "Gestiona y segmenta tu base de clientes de manera eficiente.",
    icon: Database,
    details: ["Segmentación avanzada", "Historial de compras", "Gestión de perfiles", "Importación/Exportación", "Etiquetado personalizado"],
  },
  {
    name: "Email Marketing",
    description: "Crea y envía campañas de email personalizadas a tus clientes.",
    icon: Mail,
    details: ["Plantillas personalizables", "Automatización de envíos", "Seguimiento en tiempo real", "A/B testing", "Reportes detallados"],
  },
  {
    name: "SMS Marketing",
    description: "Llega a tus clientes con mensajes directos y efectivos.",
    icon: MessageSquare,
    details: ["Envíos programados", "Personalización de mensajes", "Códigos promocionales", "Confirmaciones automáticas", "Análisis de entregas"],
  },
  {
    name: "Informes y Métricas",
    description: "Analiza el rendimiento de tus campañas y programas de fidelización.",
    icon: BarChart2,
    details: ["Dashboards en tiempo real", "Exportación de reportes", "Métricas personalizadas", "Análisis predictivo", "Seguimiento de KPIs"],
  },
  {
    name: "Sistema de Puntos/Promociones",
    description: "Implementa programas de recompensas para incentivar la lealtad.",
    icon: Gift,
    details: ["Programa de puntos", "Cupones digitales", "Recompensas por niveles", "Promociones temporales", "Beneficios exclusivos"],
  },
  {
    name: "Agenda y Citas",
    description: "Gestiona las citas y horarios de tu negocio de manera eficiente.",
    icon: Calendar,
    details: ["Calendario interactivo", "Reservas en línea", "Recordatorios automáticos", "Gestión de disponibilidad", "Historial de citas"],
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
