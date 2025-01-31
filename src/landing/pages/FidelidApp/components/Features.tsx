import { useNavigateTo } from "@/hooks/useNavigateTo";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Zap, Trophy, Crown, Star, ArrowUp, Database, Mail, MessageSquare, BarChart3, Gift, Layout, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";

const FeatureHighlight = ({ icon: Icon, text }) => (
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

const FeatureNav = () => {
  const scrollToSection = (title: string) => {
    const sectionId = title.toLowerCase().replace(/\s+/g, "-").replace(/\//g, "-");

    // Actualizar la URL con el hash
    window.history.pushState({}, "", `/features#${sectionId}`);

    // Actualizar el título de la página
    document.title = `${title} - FidelidApp`;

    const element = document.getElementById(sectionId);
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
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className='flex flex-wrap justify-center gap-4 mt-8'>
      {[
        { icon: Database, text: "Base de Datos" },
        { icon: Mail, text: "Email Marketing" },
        { icon: MessageSquare, text: "SMS Marketing" },
        { icon: BarChart3, text: "Informes y Métricas" },
        { icon: Gift, text: "Sistema de Puntos/Promociones" },
        { icon: Layout, text: "Landing Page Personalizable" },
        { icon: Calendar, text: "Agenda y Citas" },
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

const FeatureSection = ({
  title,
  description,
  features,
  image,
  details,
  stats,
  reverse = false,
}: {
  title: string;
  description: string;
  features: string[];
  image: string;
  details: string;
  stats?: { label: string; value: string }[];
  reverse?: boolean;
}) => {
  const sectionId = title.toLowerCase().replace(/\s+/g, "-").replace(/\//g, "-");
  const { handleNavigate } = useNavigateTo();
  return (
    <>
      <Helmet>
        <meta property='og:title' content={`${title} - FidelidApp`} />
        <meta property='og:description' content={description} />
        <link rel='canonical' href={`/features#${sectionId}`} />
      </Helmet>
      <motion.div
        id={sectionId}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`flex flex-col ${reverse ? "lg:flex-row-reverse" : "lg:flex-row"} gap-12 py-16`}
      >
        <div className='flex-1 space-y-8'>
          <motion.div initial={{ opacity: 0, x: reverse ? 20 : -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className='space-y-6'>
            <div className='space-y-4'>
              <motion.div whileHover={{ scale: 1.02 }} className='inline-flex items-center gap-2 bg-main/5 px-4 py-2 rounded-full'>
                <Sparkles className='w-5 h-5 text-main' />
                <span className='text-sm font-medium text-main'>Característica Destacada</span>
              </motion.div>
              <h3 className='text-4xl font-bold text-gray-900 leading-tight'>{title}</h3>
              <p className='text-xl text-gray-600'>{description}</p>
            </div>

            {/* Estadísticas impactantes */}
            {stats && (
              <div className='grid grid-cols-2 gap-6'>
                {stats.map((stat, index) => (
                  <motion.div key={index} whileHover={{ scale: 1.05 }} className='bg-white p-4 rounded-xl shadow-lg'>
                    <div className='text-3xl font-bold text-main'>{stat.value}</div>
                    <div className='text-sm text-gray-600'>{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            )}

            <ul className='space-y-4'>
              {features.map((feature, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: reverse ? 20 : -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className='flex items-start gap-3 group'
                >
                  <div className='flex-shrink-0 w-6 h-6 rounded-full bg-main/10 flex items-center justify-center group-hover:bg-main/20 transition-colors'>
                    <Trophy className='w-4 h-4 text-main' />
                  </div>
                  <div>
                    <span className='text-gray-800 font-medium'>{feature}</span>
                    <p className='text-sm text-gray-600 mt-1'>{details}</p>
                  </div>
                </motion.li>
              ))}
            </ul>

            <div className='flex flex-wrap gap-3'>
              {title === "Base de Datos de Clientes" && (
                <>
                  <FeatureHighlight icon={Zap} text='Fácil importación de datos' />
                  <FeatureHighlight icon={Crown} text='Segmentación inteligente' />
                  <FeatureHighlight icon={Star} text='Datos centralizados' />
                </>
              )}
              {title === "Email Marketing" && (
                <>
                  <FeatureHighlight icon={Zap} text='Envíos automatizados' />
                  <FeatureHighlight icon={Crown} text='Templates personalizables' />
                  <FeatureHighlight icon={Star} text='Análisis detallado' />
                </>
              )}
              {title === "SMS Marketing" && (
                <>
                  <FeatureHighlight icon={Zap} text='Respuesta inmediata' />
                  <FeatureHighlight icon={Crown} text='Mensajes personalizados' />
                  <FeatureHighlight icon={Star} text='Alta tasa de lectura' />
                </>
              )}
              {title === "Informes y Métricas" && (
                <>
                  <FeatureHighlight icon={Zap} text='Datos en tiempo real' />
                  <FeatureHighlight icon={Crown} text='Métricas relevantes' />
                  <FeatureHighlight icon={Star} text='Reportes exportables' />
                </>
              )}
              {title === "Sistema de Puntos/Promociones" && (
                <>
                  <FeatureHighlight icon={Zap} text='Gestión simple' />
                  <FeatureHighlight icon={Crown} text='Programa flexible' />
                  <FeatureHighlight icon={Star} text='Fidelización efectiva' />
                </>
              )}
              {title === "Landing Page Personalizable" && (
                <>
                  <FeatureHighlight icon={Zap} text='Diseño responsive' />
                  <FeatureHighlight icon={Crown} text='Fácil personalización' />
                  <FeatureHighlight icon={Star} text='Todo integrado' />
                </>
              )}
              {title === "Agenda y Citas" && (
                <>
                  <FeatureHighlight icon={Zap} text='Reservas 24/7' />
                  <FeatureHighlight icon={Crown} text='Gestión eficiente' />
                  <FeatureHighlight icon={Star} text='Recordatorios automáticos' />
                </>
              )}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                handleNavigate("/auth/login#register");
              }}
              className='px-8 py-4 bg-main text-white rounded-xl hover:bg-main/90 transition-colors shadow-lg hover:shadow-xl'
            >
              ¡Comienza Ahora!
            </motion.button>
          </motion.div>
        </div>

        <div className='flex-1'>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className='relative'>
            <motion.div whileHover={{ scale: 1.02 }} className='relative h-[500px] rounded-2xl overflow-hidden shadow-2xl'>
              <img src={image} alt={title} className='absolute w-full h-full object-cover object-center' />
              <div className='absolute inset-0 bg-gradient-to-t from-black/50 to-transparent' />
            </motion.div>

            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className='absolute -top-6 right-4 bg-main border-2 border-white text-white p-4 rounded-xl shadow-xl max-w-[250px]'
            >
              <div className='text-base text-gray-200 font-medium'>
                {title === "Base de Datos de Clientes" && "Conoce tus clientes, guarda sus datos"}
                {title === "Email Marketing" && "Mejora la comunicación con tus clientes"}
                {title === "SMS Marketing" && "Conecta directamente con tus clientes"}
                {title === "Informes y Métricas" && "Toma decisiones basadas en datos reales"}
                {title === "Sistema de Puntos/Promociones" && "Premia la lealtad de tus clientes"}
                {title === "Landing Page Personalizable" && "Tu negocio en línea 24/7"}
                {title === "Agenda y Citas" && "Gestiona tus citas y horarios de manera eficiente"}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

const Features = () => {
  const features = [
    {
      title: "Base de Datos de Clientes",
      description: "Una potente herramienta de gestión de clientes que te permite conocer, segmentar y entender mejor a tu audiencia.",
      image: "https://res.cloudinary.com/di92lsbym/image/upload/v1738276945/base-de-datos-2-fidelidapp_cfe83s.png",
      features: [
        "Carga de CSV",
        "Actividad de clientes",
        "Datos de clientes",
        "Importación/Exportación masiva de datos",
        "Sistema de etiquetado personalizado para mejor organización",
      ],

      stats: [
        { label: "Clientes", value: "5,000+" },
        { label: "Segmentos", value: "10+" },
      ],
    },
    {
      title: "Email Marketing",
      description: "Crea campañas de email personalizadas que conecten con tus clientes y generen resultados medibles.",
      image: "https://res.cloudinary.com/di92lsbym/image/upload/v1738277415/emailmarketing-fidelidapp_ruvft8.png",
      features: [
        "Editor de plantillas drag & drop intuitivo",
        "Programación de campañas",
        "Seguimiento en tiempo real de apertura y clics",
        "Reportes detallados de rendimiento",
      ],

      stats: [
        { label: "Campañas", value: "100+" },
        { label: "Tasas de apertura", value: "45%" },
      ],
      reverse: true,
    },
    {
      title: "SMS Marketing",
      description: "Llega directamente al móvil de tus clientes con mensajes efectivos y oportunos.",
      image: "/images/features/sms.jpg",
      features: ["Programación flexible de envíos", "Personalización dinámica de mensajes", "Análisis completo de entregas y respuestas"],

      stats: [
        { label: "Mensajes", value: "500+" },
        { label: "Tasas de respuesta", value: "60%" },
      ],
    },
    {
      title: "Informes y Métricas",
      description: "Toma decisiones basadas en datos con nuestro completo sistema de análisis y reportes.",
      image: "https://res.cloudinary.com/di92lsbym/image/upload/v1738103164/3shots_so_1_l28gbn.png",
      features: [
        "Dashboards interactivos en tiempo real",

        "Métricas clave de fidelización",
        "Análisis predictivo de comportamiento",
        "Envío de reportes por email",
      ],

      stats: [
        { label: "Análisis", value: "25+" },
        { label: "Reportes", value: "50+" },
      ],
      reverse: true,
    },
    {
      title: "Sistema de Puntos/Promociones",
      description: "Implementa programas de recompensas flexibles que incentiven la lealtad y las compras recurrentes.",
      image: "https://res.cloudinary.com/di92lsbym/image/upload/v1738105602/DSC08392-min_imoawo.jpg",
      features: [
        "Sistema de puntos personalizable",
        "Generación y gestión de cupones digitales",
        "Programa de recompensas por niveles",
        "Promociones temporales y especiales",
        "Beneficios exclusivos para miembros VIP",
      ],
      details:
        "Crea programas de fidelización que premien a tus mejores clientes. Configura diferentes niveles de recompensas y gestiona todo desde una interfaz intuitiva.",
      stats: [
        { label: "Programas", value: "20+" },
        { label: "Promociones", value: "300+" },
      ],
    },
    {
      title: "Landing Page Personalizable",
      description: "Crea páginas de aterrizaje personalizables para promocionar tus productos o servicios.",
      image: "https://res.cloudinary.com/di92lsbym/image/upload/v1738334985/514shots_so_th4nmy.png",
      features: [
        "Diseño responsive para diferentes dispositivos",
        "Personalización fácil y rápida",
        "Muestra tus productos y servicios",
        "Tarjeta de fidelización",
      ],

      stats: [
        { label: "Plantillas", value: "10+" },
        { label: "Personalizaciones", value: "100%" },
      ],
      reverse: true,
    },
    {
      title: "Agenda y Citas",
      description: "Gestiona las citas y horarios de tu negocio de manera eficiente y profesional.",
      image: "https://res.cloudinary.com/di92lsbym/image/upload/v1738334461/Dise%C3%B1o_sin_t%C3%ADtulo_3_aq9bpa.png",
      features: [
        "Sistema de reservas en línea 24/7",
        "Recordatorios automáticos por email",
        "Gestión flexible de disponibilidad y horarios",
        "Historial completo de citas y servicios",
      ],

      stats: [
        { label: "Citas Mensuales", value: "500+" },
        { label: "Ahorro de Tiempo", value: "60%" },
      ],
      reverse: true,
    },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("[id]");
      let currentSectionId = "";

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const offset = 200; // Ajusta este valor según necesites

        if (rect.top <= offset && rect.bottom >= offset) {
          currentSectionId = section.id;

          // Actualizar URL y título solo si la sección ha cambiado
          const sectionTitle = currentSectionId
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
          if (currentSectionId === "root") {
            window.history.replaceState({}, "", `/features`);
            document.title = "Características - FidelidApp";
          } else {
            window.history.replaceState({}, "", `/features#${currentSectionId}`);
            document.title = `${sectionTitle} - FidelidApp`;
          }
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className='max-w-7xl mx-auto mt-40 px-4 sm:px-6 lg:px-8'>
      <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className='text-center mb-16'>
        <h2 className='text-4xl font-bold text-main mb-4'>Características Principales</h2>
        <p className='text-xl text-gray-600 max-w-3xl mx-auto'>
          Descubre todas las herramientas que FidelidApp tiene para ayudarte a hacer crecer tu negocio y fidelizar a tus clientes.
        </p>
        <FeatureNav />
      </motion.div>

      <div className='space-y-24'>
        {features.map((feature, index) => (
          <div key={index} id={feature.title.toLowerCase().replace(/\s+/g, "-").replace(/\//g, "-")}>
            <FeatureSection {...feature} />
          </div>
        ))}
      </div>

      <ScrollToTopButton />
    </section>
  );
};

export default Features;
