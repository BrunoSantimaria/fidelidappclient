import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ArrowUp,
  Globe2,
  Share2,
  Users,
  Layout,
  WrenchIcon,
  Target,
  BarChart,
  Users2,
  MonitorSmartphone,
  Settings,
  ShoppingCart,
  Mail,
} from "lucide-react";
import { useState, useEffect } from "react";

const ServiceHighlight = ({ icon: Icon, text }) => (
  <motion.div whileHover={{ scale: 1.05 }} className='flex items-center gap-2 bg-main/10 px-3 py-1.5 rounded-full'>
    <Icon className='w-4 h-4 text-main' />
    <span className='text-sm font-medium text-main'>{text}</span>
  </motion.div>
);

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={scrollToTop}
          className='fixed bottom-8 right-8 p-4 bg-main text-white rounded-full shadow-lg hover:bg-main/90 z-50'
        >
          <ArrowUp className='w-6 h-6' />
        </motion.button>
      )}
    </AnimatePresence>
  );
};

const ServiceNav = () => {
  const scrollToSection = (title: string) => {
    const element = document.getElementById(title.toLowerCase().replace(/\s+/g, "-"));
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className='flex flex-wrap justify-center gap-4 mt-8 '
    >
      {[
        { icon: Globe2, text: "Google Ads" },
        { icon: Share2, text: "Meta Ads" },
        { icon: Users, text: "Community Manager" },
        { icon: Layout, text: "Landing Page" },
        { icon: WrenchIcon, text: "Servicios On-Site" },
        { icon: Mail, text: "Email Marketing" },
      ].map((item, index) => (
        <motion.button
          key={index}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => scrollToSection(item.text)}
          className='flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow'
        >
          <item.icon className='w-4 h-4 text-main' />
          <span className='text-sm font-medium text-gray-700'>{item.text}</span>
        </motion.button>
      ))}
    </motion.div>
  );
};

const ServiceSection = ({
  title,
  description,
  features,
  icon: Icon,
  details,
  reverse = false,
}: {
  title: string;
  description: string;
  features: string[];
  icon: any;
  details: string;
  reverse?: boolean;
}) => {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent(`Hola quiero consultar por el servicio ${title}`);
    window.open(`https://wa.me/56996706983?text=${message}`, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className='bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-8 py-10 mb-20'
    >
      <div className={`flex flex-col ${reverse ? "lg:flex-row-reverse" : "lg:flex-row"} gap-8 items-center`}>
        <div className='lg:w-1/4 flex justify-center'>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className='relative bg-gradient-to-br from-main/10 to-main/5 p-4 rounded-full'
          >
            <Icon className='w-16 h-16 text-main' />
          </motion.div>
        </div>

        <div className='lg:w-3/4 space-y-4'>
          <div className='flex items-center gap-3 mb-2'>
            <h3 className='text-2xl font-bold text-gray-900'>{title}</h3>
            <motion.div whileHover={{ scale: 1.02 }} className='inline-flex items-center gap-1 bg-main/5 px-2 py-1 rounded-full'>
              <Sparkles className='w-4 h-4 text-main' />
              <span className='text-xs font-medium text-main'>Servicio Profesional</span>
            </motion.div>
          </div>

          <p className='text-gray-600'>{description}</p>

          <div className='grid grid-cols-2 gap-2'>
            {features.slice(0, 4).map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: reverse ? 20 : -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className='flex items-center gap-2'
              >
                <div className='flex-shrink-0 w-5 h-5 rounded-full bg-main/10 flex items-center justify-center'>
                  <Icon className='w-3 h-3 text-main' />
                </div>
                <span className='text-sm text-gray-700'>{feature}</span>
              </motion.div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleWhatsAppClick}
            className='px-4 py-2 bg-main text-white rounded-lg hover:bg-main/90 transition-colors text-sm'
          >
            Solicitar información
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

const Services = () => {
  const services = [
    {
      title: "Campañas de Google Ads",
      description: "Optimiza tu presencia en línea y alcanza a tu audiencia ideal con campañas de Google Ads estratégicamente diseñadas.",
      icon: Target,
      features: [
        "Investigación de palabras clave",
        "Optimización de pujas",
        "Creación de anuncios persuasivos",
        "Seguimiento de conversiones",
        "Informes detallados de rendimiento",
        "Presupuestos personalizados",
      ],
      details: "Maximiza tu ROI con campañas optimizadas.",
    },
    {
      title: "Campañas de Meta Ads",
      description: "Llega a tu audiencia en Facebook e Instagram con anuncios personalizados que generan resultados.",
      icon: BarChart,
      features: [
        "Segmentación avanzada",
        "Diseño creativo de anuncios",
        "Retargeting inteligente",
        "Optimización de conversiones",
        "Análisis de audiencia",
        "Gestión de presupuesto",
      ],
      details: "Conecta con tu audiencia en redes sociales.",
      reverse: true,
    },
    {
      title: "Community Manager",
      description: "Gestiona y mejora tu presencia en redes sociales con nuestro equipo de expertos en gestión de comunidades.",
      icon: Users2,
      features: [
        "Planificación de contenido",
        "Gestión de redes sociales",
        "Interacción con la audiencia",
        "Reportes mensuales",
        "Diseño de posts",
        "Estrategia de crecimiento",
      ],
      details: "Mantén una presencia activa en redes sociales.",
    },
    {
      title: "Landing Page",
      description: "Crea una página de aterrizaje profesional que convierte visitantes en clientes potenciales.",
      icon: MonitorSmartphone,
      features: ["Diseño personalizado", "Optimización móvil", "Integración con CRM", "Formularios optimizados", "Análisis de conversión", "Optimización SEO"],
      details: "Convierte visitantes en clientes.",
      reverse: true,
    },
    {
      title: "Servicios On-Site",
      description: "Optimiza tu negocio con servicios personalizados en tu ubicación para maximizar resultados.",
      icon: Settings,
      features: [
        "Configuración de sistemas",
        "Capacitación de personal",
        "Soporte técnico presencial",
        "Implementación de QR",
        "Optimización de procesos",
        "Mantenimiento continuo",
      ],
      details: "Soporte técnico y capacitación presencial.",
    },
    {
      title: "E-commerce",
      description: "Desarrollamos tu tienda online personalizada para vender tus productos y servicios de manera efectiva.",
      icon: ShoppingCart,
      features: ["Diseño personalizado", "Integración de pagos", "Gestión de inventario", "Panel administrativo", "Optimización móvil", "Reportes de ventas"],
      details: "Vende tus productos en línea 24/7.",
      reverse: true,
    },
    {
      title: "Email Marketing",
      description: "Desarrolla campañas de correo electrónico efectivas para mantener el contacto con tus clientes y generar más ventas.",
      icon: Mail,
      features: [
        "Diseño de newsletters",
        "Segmentación de audiencia",
        "Automatización de campañas",
        "Análisis de métricas",
        "A/B Testing",
        "Gestión de listas",
      ],
      details: "Comunícate efectivamente con tus clientes.",
      reverse: true,
    },
  ];

  return (
    <section className='max-w-7xl mx-auto mt-40 px-4 sm:px-6 lg:px-8'>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className='text-center mb-16'>
        <h2 className='text-4xl font-bold text-gray-900 mb-4 text-main'>Servicios Adicionales</h2>
        <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
          Potencia tu negocio con nuestra suite completa de servicios diseñados para impulsar tu presencia digital y fidelizar a tus clientes. En{" "}
          <strong className='text-main'>FidelidApp</strong>, contamos con especialistas en cada área para ofrecerte soluciones personalizadas y efectivas.
        </p>
        <ServiceNav />
      </motion.div>

      <div className='space-y-6'>
        {services.map((service, index) => (
          <div key={index} id={service.title.toLowerCase().replace(/\s+/g, "-")}>
            <ServiceSection {...service} />
          </div>
        ))}
      </div>

      <ScrollToTopButton />
    </section>
  );
};

export default Services;
