import { Hero, WhatIsFidelidapp, Features, AdditionalServices, Testimonials, WhyChooseFidelidapp, ContactForm } from "./components";
import { useRef } from "react";

const LandingMain = ({ refs }) => {
  console.log(refs);
  const whyChooseFidelidappRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  return (
    <div>
      <Hero refs={refs} />
      <WhatIsFidelidapp refs={refs.WhatIsFidelidapp} />
      <div ref={featuresRef}>
        <Features />
      </div>
      <div ref={whyChooseFidelidappRef}>
        <WhyChooseFidelidapp />
      </div>
      <AdditionalServices />
      <Testimonials refs={refs} />

      <ContactForm refs={refs} />
    </div>
  );
};

export default LandingMain;
