import { Hero, WhatIsFidelidapp, Features, AdditionalServices, Testimonials, WhyChooseFidelidapp, ContactForm, ClientsSection, Plans, BannerCTA } from "./components";
import { useRef } from "react";

const LandingMain = ({ refs }) => {
  console.log(refs);
  const whyChooseFidelidappRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  return (
    <div>
      <Hero refs={refs} />
      <BannerCTA />
      <div ref={whyChooseFidelidappRef}>
        <WhyChooseFidelidapp />
      </div>

      <div ref={featuresRef}>
        <Features />
      </div>

      <ClientsSection />
      
      <WhatIsFidelidapp refs={refs.WhatIsFidelidapp} />
      
      <Plans refs={refs} />
      
      {/* <AdditionalServices /> */}

      <Testimonials refs={refs} />


      <ContactForm refs={refs} />
    </div>
  );
};

export default LandingMain;
