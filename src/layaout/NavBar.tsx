import { AppBar, Box, Toolbar, Typography, Drawer, List, ListItem, ListItemText, IconButton } from "@mui/material";
import logo from "../assets/Logo Principal.png"; // Importa tu logo
import React from "react";
import { MdOutlineMenu } from "react-icons/md";

export const NavBar = () => {
  const [showMenu, setShowMenu] = React.useState(false);

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  return (
    <>
      <AppBar sx={{ paddingX: "20px", backgroundColor: "primary.main" }}>
        <Toolbar sx={{ backgroundColor: "primary.main" }}>
          {/* Logo */}
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <img src={logo} alt='Logo' height='100em' style={{ padding: "10px" }} />
          </Box>

          {/* Menu icon for small screens */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton onClick={handleMenuToggle}>
              <MdOutlineMenu size={42} color='white' />
            </IconButton>
          </Box>

          {/* Menu items for medium to large screens */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 4 }}>
            <Typography
              sx={{
                cursor: "pointer",
                transition: "color 0.3s",
                "&:hover": { color: "#f1dab3" },
              }}
            >
              Home
            </Typography>
            <Typography
              sx={{
                cursor: "pointer",
                transition: "color 0.3s",
                "&:hover": { color: "#f1dab3" },
              }}
            >
              Cómo Funciona
            </Typography>
            <Typography
              sx={{
                cursor: "pointer",
                transition: "color 0.3s",
                "&:hover": { color: "#f1dab3" },
              }}
            >
              Contacto
            </Typography>
            <Typography
              sx={{
                cursor: "pointer",
                transition: "color 0.3s",
                "&:hover": { color: "#f1dab3" },
              }}
            >
              Iniciar Sesión
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer for small screens */}
      <Drawer anchor='right' open={showMenu} onClose={handleMenuToggle}>
        <Box sx={{ width: 250 }} role='presentation' onClick={handleMenuToggle} onKeyDown={handleMenuToggle}>
          <List>
            {["Home", "Cómo Funciona", "Contacto", "Iniciar Sesión"].map((text, index) => (
              <ListItem button key={text}>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </>
  );
};
