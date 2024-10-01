import { AppBar, Box, Toolbar, Typography, Drawer, List, ListItem, ListItemText, IconButton, Container } from "@mui/material";
import logo from "../assets/Logo Principal.png"; // Importa tu logo
import React from "react";
import { MdOutlineMenu } from "react-icons/md";

export const NavBar = () => {
  const [showMenu, setShowMenu] = React.useState(false);

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  return (
    <Container sx={{ marginBottom: 12 }}>
      <AppBar sx={{ paddingX: "80px", backgroundColor: "primary.main" }}>
        <Toolbar sx={{ backgroundColor: "primary.main" }}>
          {/* Logo */}
          <Box className='transition-text' sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <img src={logo} alt='Logo' height='80em' style={{ margin: 10 }} />
          </Box>

          {/* Menu icon for small screens */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton onClick={handleMenuToggle}>
              <MdOutlineMenu size={42} color='white' />
            </IconButton>
          </Box>

          {/* Menu items for medium to large screens */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 4 }}>
            <Typography className='transition-text'>Home</Typography>
            <Typography className='transition-text'>Cómo Funciona</Typography>
            <Typography className='transition-text'>Planes</Typography>
            <Typography className='transition-text'>Contacto</Typography>
            <Typography className='transition-text'>Iniciar Sesión</Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer for small screens */}
      <Drawer anchor='right' open={showMenu} onClose={handleMenuToggle}>
        <Box sx={{ width: 250 }} role='presentation' onClick={handleMenuToggle} onKeyDown={handleMenuToggle}>
          <List>
            {["Home", "Cómo Funciona", "Contacto", "Iniciar Sesión"].map((text) => (
              <ListItem button key={text}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Container>
  );
};
