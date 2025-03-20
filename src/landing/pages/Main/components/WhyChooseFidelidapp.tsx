import { motion } from "framer-motion";

const waveStyles = `
  .custom-shape-divider-top-1738010154,
  .custom-shape-divider-bottom-1738010154 {
    position: absolute;
    left: 0;
    width: 100%;
    overflow: hidden;
    line-height: 0;
  }

  .custom-shape-divider-top-1738010154 {
    top: 0;
  }

  .custom-shape-divider-bottom-1738010154 {
    bottom: 0;
    transform: rotate(180deg);
  }

  .custom-shape-divider-top-1738010154 svg,
  .custom-shape-divider-bottom-1738010154 svg {
    position: relative;
    display: block;
    width: calc(100% + 1.3px);
    height: 78px;
    
    @media (min-width: 768px) {
      height: 120px;
    }
  }

  .custom-shape-divider-top-1738010154 .shape-fill,
  .custom-shape-divider-bottom-1738010154 .shape-fill {
    fill: #FFFFFF;
  }
`;

export const WhyChooseFidelidapp = () => {
  return (
    <div className='relative py-24 overflow-hidden bg-main mt-5 mb-5'>
      <style jsx>{waveStyles}</style>

      <div className='custom-shape-divider-top-1738010154'>
        <motion.svg data-name='Layer 1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'>
          <motion.path
            d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z'
            className='shape-fill'
            animate={{
              d: [
                "M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z",
                "M321.39,46.44c58-8.79,114.16-25.13,172-36.86,82.39-14.72,168.19-15.73,250.45-.39C823.78,25,906.67,65,985.66,85.83c70.05,16.48,146.53,24.09,214.34,1V0H0V22.35A600.21,600.21,0,0,0,321.39,46.44Z",
              ],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "mirror",
              duration: 10,
              ease: "easeIn",
            }}
          />
        </motion.svg>
      </div>

      <div className='custom-shape-divider-bottom-1738010154'>
        <motion.svg data-name='Layer 1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'>
          <motion.path
            d='M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z'
            className='shape-fill mb-12'
            animate={{
              d: [
                "M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z",
                "M321.39,36.44c58-12.79,114.16-32.13,172-43.86,82.39-18.72,168.19-19.73,250.45-.39C823.78,11,906.67,62,985.66,82.83c70.05,18.48,146.53,26.09,214.34,3V0H0V17.35A600.21,600.21,0,0,0,321.39,36.44Z",
              ],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "mirror",
              duration: 30,
              ease: "easeIn",
            }}
          />
        </motion.svg>
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10'>
        <div className='lg:text-center'>
          <h2 className='text-base text-white font-semibold tracking-wide uppercase'>¿Por qué elegir Fidelidapp?</h2>
          <p className='mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl'>
            La elección inteligente para la fidelización de clientes
          </p>
        </div>

        <div className='mt-10'>
          <div className='flex flex-col md:flex-row items-center justify-between'>
            <div className='md:w-1/2 mb-8 md:mb-0'>
              <p className='text-xl text-white'>
                Fidelidapp ofrece una solución completa y fácil de usar para la fidelización de clientes. Con nuestra plataforma, podrás:
              </p>
              <ul className='text-lg mt-6 list-disc list-inside text-white'>
                <li>Aumentar la retención de clientes hasta en un 25%</li>
                <li>Incrementar el valor promedio de compra en un 20%</li>
                <li>Mejorar la satisfacción del cliente en un 30%</li>
                <li>Optimizar tus campañas de marketing con datos precisos</li>
                <li>Ahorrar tiempo y recursos en la gestión de programas de fidelización</li>
              </ul>
            </div>

            <img
              src='https://res.cloudinary.com/di92lsbym/image/upload/v1738103164/3shots_so_1_l28gbn.png'
              alt='Métricas de Fidelidapp'
              width={600}
              height={400}
              className='duration-700 hover:scale-105'
            />
          </div>
        </div>
      </div>
    </div>
  );
};
