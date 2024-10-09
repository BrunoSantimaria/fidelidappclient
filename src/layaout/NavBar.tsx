import { AppBar, Box, Toolbar, Typography, Drawer, List, ListItem, ListItemText, IconButton } from "@mui/material";
import logo from "../assets/Logo Principal.png"; // Importa tu logo
import React from "react";
import { MdOutlineMenu } from "react-icons/md";
import { useLocation } from "react-router";
import { useAuthSlice } from "../hooks/useAuthSlice";
import { useNavigateTo } from "../hooks/useNavigateTo";
import { handleScrollTo } from "../utils/handleScrollTo";

export const NavBar = ({ refs }) => {
  const location = useLocation();
  const [showMenu, setShowMenu] = React.useState(false);
  const { user, startLoggingOut } = useAuthSlice();
  const { handleNavigate } = useNavigateTo();

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  const allowedRoutes = ["/", "/auth/login"];

  if (!allowedRoutes.includes(location.pathname)) {
    return null;
  }

  return (
    <Box sx={{ maxWidth: "100%" }}>
      <AppBar
        sx={{
          paddingX: { xs: "20px", sm: "20px", md: "40px" },
          backgroundColor: "primary.main",
          overflowX: "hidden",
          maxWidth: "100%",
          height: { xs: "60px", md: "80px", lg: "100px" },
        }}
      >
        <Toolbar sx={{ display: "flex", alignItems: "center", height: "100%", backgroundColor: "primary.main" }}>
          {/* Logo */}
          <Box className='transition-text' sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <Box
              component='img'
              src={logo}
              alt='Logo'
              sx={{
                height: { xs: "48px", md: "62px", lg: "62px", xl: "62px" },
                margin: { xs: 0, sm: "0 10px", md: "0 10px", lg: "0 10px", xl: "0 10px" },
              }}
            />
          </Box>

          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton onClick={handleMenuToggle}>
              <MdOutlineMenu size={42} color='white' />
            </IconButton>
          </Box>

          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 4 }}>
            <Typography
              onClick={() => {
                location.pathname !== "/" ? handleNavigate("/") : handleScrollTo(refs.homeRef);
              }}
              className='transition-text'
            >
              Home
            </Typography>
            <Typography onClick={() => handleScrollTo(refs.servicesRef)} className='transition-text'>
              Cómo Funciona
            </Typography>
            <Typography onClick={() => handleScrollTo(refs.plansRef)} className='transition-text'>
              Planes
            </Typography>
            <Typography onClick={() => handleScrollTo(refs.contactRef)} className='transition-text'>
              Contacto
            </Typography>
            {user ? (
              <>
                <Typography className='transition-text' onClick={() => handleNavigate("/dashboard")}>
                  Dashboard
                </Typography>
                <Typography className='transition-text' onClick={startLoggingOut}>
                  Salir
                </Typography>
              </>
            ) : (
              <Typography onClick={() => handleNavigate("/auth/login")} className='transition-text'>
                Iniciar Sesión
              </Typography>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer anchor='right' open={showMenu} onClose={handleMenuToggle}>
        <Box sx={{ width: 250 }} role='presentation' onClick={handleMenuToggle} onKeyDown={handleMenuToggle}>
          <List>
            {["Home", "Cómo Funciona", "Planes", "Iniciar Sesión"].map((text) => (
              <ListItem button key={text}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};
