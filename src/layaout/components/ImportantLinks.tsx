import { Typography } from "@mui/material";
import { ImportantLinksList } from "../../data/importantLinks";
import { handleScrollTo } from "../../utils/handleScrollTo";
import { useLocation } from "react-router";
import { useNavigateTo } from "../../hooks/useNavigateTo";

export const ImportantLinks = ({ refs }: { refs: any }) => {
  console.log(refs);
  const location = useLocation();
  const { handleNavigate } = useNavigateTo();

  const handleLinkClick = (title) => {
    if (location.pathname !== "/") {
      handleNavigate("/");
      setTimeout(() => scrollToSection(title), 500);
    } else {
      scrollToSection(title);
    }
  };

  const scrollToSection = (title) => {
    switch (title) {
      case "Home":
        handleScrollTo(refs.homeRef);
        break;
      case "Cómo Funciona":
        handleScrollTo(refs.WhatIsFidelidapp);
        break;
      case "Planes":
        handleScrollTo(refs.plansRef);
        break;
      case "Contacto":
        handleScrollTo(refs.contactRef);
        break;
      case "Registrarse":
        handleNavigate("/auth/login", { state: { showRegister: true } });
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Typography sx={{ fontSize: "24px", marginBottom: "10px", color: "white" }}>{ImportantLinksList.title}</Typography>
      {ImportantLinksList.elements.map(({ title }) => (
        <Typography
          className='cursor-pointer hover:underline transition-colors'
          key={title}
          onClick={() => handleLinkClick(title)}
          sx={{ marginBottom: "8px", color: "white" }}
        >
          {title}
        </Typography>
      ))}
    </>
  );
};
