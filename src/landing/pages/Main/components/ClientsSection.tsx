const clientLogos = [
  { src: "https://res.cloudinary.com/di92lsbym/image/upload/v1736404361/Sundeco/Logo-Sundeco.webp", alt: "Sundeco" },
  { src: "https://res.cloudinary.com/di92lsbym/image/upload/v1739817264/fidelizarte/Dise%C3%B1o_sin_t%C3%ADtulo_5_wwndum.png", alt: "Rocco Rental S.R.L." },
  { src: "https://res.cloudinary.com/di92lsbym/image/upload/v1739817264/fidelizarte/favicon-imagendent-Recuperado_jhy7rv.png", alt: "Imagendent" },
  { src: "https://res.cloudinary.com/di92lsbym/image/upload/v1739817263/fidelizarte/RAHUIL-LOGO-blanco_niufk2.png", alt: "Rahuil Transportes y Logística" },
  { src: "https://res.cloudinary.com/di92lsbym/image/upload/v1739817263/fidelizarte/ClubMore-logo-blanco_pbpgrh.png", alt: "Club More" },
  { src: "https://res.cloudinary.com/di92lsbym/image/upload/v1739817263/fidelizarte/inugami-logo-blanco_tqmow2.png", alt: "Inugami" },
  { src: "https://res.cloudinary.com/di92lsbym/image/upload/v1739817263/fidelizarte/bakery-logo0blanco_ap8tb7.png", alt: "Bakery to go" },
];

export const ClientsSection = () => {
  return (
    <section id="clientes" className="py-20 bg-[#5b7898]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Nuestros Clientes</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Empresas que confían en nosotros para impulsar su presencia digital.
          </p>
        </div>

        {/* Marquee Animation */}
        <div className="mt-12 overflow-hidden whitespace-nowrap relative">
          <div className="flex animate-marquee">
            {[...clientLogos, ...clientLogos, ...clientLogos].map((logo, index) => (
              <div key={index} className="flex-shrink-0 mx-12">
                <img src={logo.src || "/placeholder.svg"} alt={logo.alt} className="h-16 w-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tailwind Custom Styles */}
      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-100%); }
          }
          
          .animate-marquee {
            animation: marquee 30s linear infinite;
            display: flex;
          }

          @media (max-width: 768px) {
            .animate-marquee {
              animation: marquee 20s linear infinite;
            }
          }
        `}
      </style>
    </section>
  );
};