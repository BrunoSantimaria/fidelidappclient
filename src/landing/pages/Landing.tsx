import React from "react";
import { Box, Divider } from "@mui/material";
import { EmailMarketing, Faqs, Home, OurServices, Pattern, Plans, Promotions, Steps, Testimonials } from "./";
import { HowItWorks } from "./HowItWorks";
import ContactForm from "./ContactForm";
import { motion } from "framer-motion";
import { CallAndEmail } from "../components/CallAndEmail";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const Landing = ({ refs }) => {
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
      <motion.div ref={refs.homeRef} initial='hidden' whileInView='visible' variants={fadeIn} transition={{ duration: 0.5 }}>
        <Home refs={refs.promotionRef} />
      </motion.div>

      <motion.div ref={refs.promotionRef} initial='hidden' whileInView='visible' variants={fadeIn} transition={{ duration: 0.5 }}>
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
    </Box>
  );
};
