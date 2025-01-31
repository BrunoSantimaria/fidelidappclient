import { FadeIn } from "@/landing/components/animations/FadeIn";
import { motion } from "framer-motion";
import { Megaphone, Facebook, Users, Globe, Wrench, ArrowRight, Check } from "lucide-react";

const services = [
  {
    name: "Campañas de Google Ads",
    description: "Optimiza tu presencia en línea y alcanza a tu audiencia ideal con campañas de Google Ads estratégicamente diseñadas.",
    icon: Megaphone,
    details: [
      "Investigación de palabras clave",
      "Optimización de pujas",
      "Creación de anuncios persuasivos",
      "Seguimiento de conversiones",
      "Informes detallados de rendimiento",
      "Presupuestos personalizados",
    ],
  },
  {
    name: "Campañas de Meta Ads",
    description: "Llega a tu audiencia en Facebook e Instagram con anuncios personalizados que generan resultados.",
    icon: Facebook,
    details: [
      "Segmentación avanzada",
      "Diseño creativo de anuncios",
      "Retargeting inteligente",
      "Optimización de conversiones",
      "Análisis de audiencia",
      "Gestión de presupuesto",
    ],
  },
  {
    name: "Servicio de Community Manager",
    description: "Gestiona y mejora tu presencia en redes sociales con nuestro equipo de expertos en gestión de comunidades.",
    icon: Users,
    details: [
      "Planificación de contenido",
      "Gestión de redes sociales",
      "Interacción con la audiencia",
      "Reportes mensuales",
      "Diseño de posts",
      "Estrategia de crecimiento",
    ],
  },
  {
    name: "Landing Page Corporativa",
    description: "Crea una página de aterrizaje profesional que convierte visitantes en clientes potenciales.",
    icon: Globe,
    details: ["Diseño personalizado", "Optimización móvil", "Integración con CRM", "Formularios optimizados", "Análisis de conversión", "Optimización SEO"],
  },
  {
    name: "Servicios On-Site",
    description: "Optimiza tu negocio con servicios personalizados en tu ubicación para maximizar resultados.",
    icon: Wrench,
    details: [
      "Configuración de sistemas",
      "Capacitación de personal",
      "Soporte técnico presencial",
      "Implementación de QR",
      "Optimización de procesos",
      "Mantenimiento continuo",
    ],
  },
];

export const AdditionalServices = () => {
  return (
    <div className='py-16 bg-white'>
      <div className='max-w-7xl  mx-auto px-4 sm:px-6 lg:px-8'>
        <FadeIn>
          <div className='text-center'>
            <h2 className='text-base text-main font-semibold tracking-wide uppercase'>Servicios Adicionales</h2>
            <p className='mt-2 text-4xl font-extrabold text-main sm:text-5xl'>Potencia tu negocio con nuestros servicios complementarios</p>
            <p className='mt-4 text-xl text-gray-500 max-w-3xl mx-auto'>
              Maximiza el potencial de tu negocio con nuestra suite completa de servicios diseñados para impulsar tu presencia digital y fidelizar a tus
              clientes.
            </p>
          </div>
        </FadeIn>

        <div className='mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
          {services.map((service, index) => (
            <FadeIn key={service.name} delay={index * 0.1}>
              <motion.div className='relative bg-gray-50 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300' whileHover={{ y: -5 }}>
                <div className='flex items-center space-x-4 mb-4'>
                  <div className='flex-shrink-0'>
                    <div className='flex items-center justify-center h-12 w-12 rounded-lg bg-main text-white'>
                      <service.icon className='h-6 w-6' />
                    </div>
                  </div>
                  <h3 className='text-xl font-bold text-gray-900'>{service.name}</h3>
                </div>

                <p className='text-gray-500 mb-6'>{service.description}</p>

                <ul className='space-y-3 mb-16'>
                  {service.details.map((detail, i) => (
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
                  <a href={`/services`} className='inline-flex items-center text-main font-medium'>
                    Ver más
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
              href='/services'
              className='inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-main transition-all duration-300 transform hover:scale-105 hover:text-white'
            >
              Consulta todos nuestros servicios
              <ArrowRight className='ml-2 -mr-1 h-5 w-5' />
            </a>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};
