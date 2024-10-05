import { Typography, Container, Box, Grid2, Divider } from "@mui/material";
import Logo from "../assets/LOGO-SIN-FONDO.png";
import { ContactInfo, ImportantLinks } from "./components/";
import { useLocation } from "react-router";

export const Footer = ({ refs }) => {
  const location = useLocation();

  const allowedRoutes = ["/", "/auth/login"];

  if (!allowedRoutes.includes(location.pathname)) {
    return null;
  }

  return (
    <Box
      component='footer'
      sx={{
        backgroundColor: "primary.main",
        mt: 0,
        pb: 2,
        width: "100%", // Asegúrate de que el footer ocupe todo el ancho
        boxSizing: "border-box",
        overflowX: "hidden", // Incluye padding y border en el ancho total
      }}
    >
      <Container maxWidth='xxl' sx={{ px: 2, mt: 2, mb: 2 }}>
        <Grid2 container spacing={2} justifyContent='space-around' alignItems='flex-start' padding={1}>
          <Grid2 item xs={12} md={6} sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", m: { xs: 0, md: 0 } }}>
            <img src={Logo} alt='Logo' width={150} />
          </Grid2>
          <Grid2 item xs={12} md={3} sx={{ color: "white", mb: { xs: 0, md: 0 } }}>
            <ContactInfo />
          </Grid2>
          <Grid2 item xs={12} md={3} sx={{ color: "white", mb: { xs: 0, md: 0 } }}>
            <ImportantLinks refs={refs} />
          </Grid2>
        </Grid2>
        <Divider />
        <Grid2 item xs={12} sx={{ textAlign: "center" }}>
          <Typography variant='body2' sx={{ color: "white" }}>
            &copy; {new Date().getFullYear()} FidelidApp. Todos los derechos reservados.
          </Typography>
        </Grid2>
      </Container>
    </Box>
  );
};

export default Footer;
