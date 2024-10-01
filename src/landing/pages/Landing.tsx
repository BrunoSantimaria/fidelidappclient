import { Container } from "@mui/material";
import { Home, OurServices, Pattern, Testimonials } from "./";
import { HowItWorks } from "./HowItWorks";
export const Landing = () => {
  return (
    <Container
      sx={{
        display: "flex",

        flexDirection: "column",
        textAlign: "left",
        justifyContent: "flex-start",
        minWidth: "100vw",
        padding: { md: "0 0px" },
        marginLeft: { xs: "0px", md: "0px" },
        margin: { xs: "0px", md: "0 auto" },
      }}
    >
      <Home />
      <OurServices />
      <Pattern />
      <HowItWorks />
      <Testimonials />
    </Container>
  );
};
