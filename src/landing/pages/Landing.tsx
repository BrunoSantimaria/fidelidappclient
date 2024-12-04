import { Box } from "@mui/material";
import { motion } from "framer-motion";
import React, { Suspense, lazy } from "react";

// Carga diferida de los componentes
const Home = lazy(() => import("./Home").then((module) => ({ default: module.Home })));
const PointsAndVisits = lazy(() => import("./PointsAndVisits").then((module) => ({ default: module.PointsAndVisits })));
const Promotions = lazy(() => import("./Promotions").then((module) => ({ default: module.Promotions })));
const EmailMarketing = lazy(() => import("./EmailMarketing").then((module) => ({ default: module.EmailMarketing })));
const CallAndEmail = lazy(() => import("../components/CallAndEmail").then((module) => ({ default: module.CallAndEmail })));
const OurServices = lazy(() => import("./OurServices").then((module) => ({ default: module.OurServices })));
const HowItWorks = lazy(() => import("./HowItWorks").then((module) => ({ default: module.HowItWorks })));
const Testimonials = lazy(() => import("./Testimonials").then((module) => ({ default: module.Testimonials })));
const Pattern = lazy(() => import("./Pattern").then((module) => ({ default: module.Pattern })));
const Steps = lazy(() => import("./Steps").then((module) => ({ default: module.Steps })));
const Plans = lazy(() => import("./Plans").then((module) => ({ default: module.Plans })));
const Faqs = lazy(() => import("./Faqs").then((module) => ({ default: module.Faqs })));
const ContactForm = lazy(() => import("./ContactForm"));

export const Landing = ({ refs }) => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
        justifyContent: "flex-start",
        width: "100%",
        padding: 0,
        margin: 0,
        overflowX: "hidden",
        overflowY: "hidden",
      }}
    >
      <Suspense fallback={<div>Loading...</div>}>
        <motion.div ref={refs.homeRef} initial='hidden' whileInView='visible' variants={fadeIn} transition={{ duration: 0.5 }}>
          <Home refs={refs.promotionRef} />
        </motion.div>
        <motion.div ref={refs.promotionRef} initial='hidden' whileInView='visible' variants={fadeIn} transition={{ duration: 0.5 }}>
          <PointsAndVisits />
        </motion.div>
        <div className='w-[70%] md:w-[50%] border-[0.5px] opacity-20 my-16 border-black flex justify-center m-auto bg-black' />
        <motion.div initial='hidden' whileInView='visible' variants={fadeIn} transition={{ duration: 0.5 }}>
          <Promotions />
        </motion.div>
        <motion.div initial='hidden' whileInView='visible' variants={fadeIn} transition={{ duration: 0.5 }}>
          <EmailMarketing />
        </motion.div>
        <motion.div initial='hidden' whileInView='visible' variants={fadeIn} transition={{ duration: 0.5 }}>
          <CallAndEmail />
        </motion.div>
        <motion.div initial='hidden' whileInView='visible' variants={fadeIn} transition={{ duration: 0.5 }}>
          <OurServices />
        </motion.div>

        <motion.div ref={refs.servicesRef} initial='hidden' whileInView='visible' variants={fadeIn} transition={{ duration: 0.5 }}>
          <HowItWorks />
        </motion.div>

        <motion.div ref={refs.testimonialsRef} initial='hidden' whileInView='visible' variants={fadeIn} transition={{ duration: 0.5 }}>
          <Testimonials />
        </motion.div>

        <motion.div ref={refs.stepsRef} initial='hidden' whileInView='visible' variants={fadeIn} transition={{ duration: 0.5 }}>
          <Pattern />
        </motion.div>

        <motion.div initial='hidden' whileInView='visible' variants={fadeIn} transition={{ duration: 0.5 }}>
          <Steps />
        </motion.div>

        <motion.div ref={refs.plansRef} initial='hidden' whileInView='visible' variants={fadeIn} transition={{ duration: 0.5 }}>
          <Plans />
        </motion.div>

        <motion.div ref={refs.faqsRef} initial='hidden' whileInView='visible' variants={fadeIn} transition={{ duration: 0.5 }}>
          <Faqs />
        </motion.div>

        <motion.div ref={refs.contactRef} initial='hidden' whileInView='visible' variants={fadeIn} transition={{ duration: 0.5 }}>
          <ContactForm />
        </motion.div>
      </Suspense>
    </Box>
  );
};
