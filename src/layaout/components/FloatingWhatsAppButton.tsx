import React from "react";
import { Box } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { useLocation } from "react-router";

const FloatingWhatsAppButton = () => {
  const handleClick = () => {
    window.open("https://wa.me/1234567890", "_blank");
  };
  const location = useLocation();

  const allowedRoutes = ["/", "/auth"];

  if (!allowedRoutes.includes(location.pathname)) {
    return null;
  }
  return (
    <Box
      onClick={handleClick}
      sx={{
        zIndex: 10,
        position: "fixed",
        bottom: 20,
        right: 50,
        backgroundColor: "green",
        borderRadius: "50%",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
        cursor: "pointer",
        p: 2,
        "&:hover": {
          backgroundColor: "darkgreen",
        },
      }}
    >
      <WhatsAppIcon sx={{ color: "white", fontSize: 55 }} />
    </Box>
  );
};

export default FloatingWhatsAppButton;
