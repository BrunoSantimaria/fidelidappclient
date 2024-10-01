import { Typography, Container, Box, Grid2, Divider, Grid } from "@mui/material";
import Logo from "../assets/LOGO-SIN-FONDO.png";
import { ContactInfo, ImportantLinks } from "./components/";
import { useLocation } from "react-router";

const conctactInfo = {
  title: "Información de contacto",
  links: [
    {
      text: "info@fidelidapp.com",
      icon: "",
    },
  ],
};
export const Footer = () => {
  const location = useLocation();

  const allowedRoutes = ["/", "/auth"];

  if (!allowedRoutes.includes(location.pathname)) {
    return null;
  }

  return (
    <Box component='footer' sx={{ backgroundColor: "primary.main", mt: 0, pb: 2, width: "100vw", marginTop: 20 }}>
      <Container maxWidth='lg' sx={{ px: 3, mt: 2, mb: 2 }}>
        <Grid2 container spacing={2} justifyContent='space-between' alignItems='flex-start' padding={1}>
          <Grid2 item xs={12} md={6} sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", m: { xs: 0, md: 0 } }}>
            <img src={Logo} alt='Logo' width={150} />
          </Grid2>
          <Grid2 item xs={12} md={3} sx={{ color: "white", mb: { xs: 0, md: 0 } }}>
            <ContactInfo />
          </Grid2>
          <Grid2 item xs={12} md={3} sx={{ color: "white", mb: { xs: 0, md: 0 } }}>
            <ImportantLinks />
          </Grid2>
        </Grid2>
        <Divider>
          <Grid2 item xs={6} md={6} sx={{ textAlign: { xs: "center", md: "right" } }}>
            <Typography variant='body2' sx={{ color: "white" }}>
              &copy; {new Date().getFullYear()} FidelidApp. Todos los derechos reservados.
            </Typography>
          </Grid2>
        </Divider>
      </Container>
    </Box>
  );
};

export default Footer;
