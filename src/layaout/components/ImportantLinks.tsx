import { Typography } from "@mui/material";
import { ImportantLinksList } from "../../data/importantLinks";
import { handleScrollTo } from "../../utils/handleScrollTo"; // Usa la función que ya tienes para el scroll
import { useLocation } from "react-router";
import { useNavigateTo } from "../../hooks/useNavigateTo";

export const ImportantLinks = ({ refs }) => {
  const location = useLocation();
  const { handleNavigate } = useNavigateTo();

  const handleLinkClick = (title) => {
    if (location.pathname !== "/") {
      handleNavigate("/"); // Si no estamos en "/", navegamos allí primero
      // Puedes usar un setTimeout para asegurarte de que el desplazamiento ocurra después de la navegación
      setTimeout(() => scrollToSection(title), 500);
    } else {
      scrollToSection(title); // Si estamos en "/", simplemente desplazamos
    }
  };

  const scrollToSection = (title) => {
    switch (title) {
      case "Home":
        handleScrollTo(refs.homeRef);
        break;
      case "Cómo Funciona":
        handleScrollTo(refs.servicesRef);
        break;
      case "Planes":
        handleScrollTo(refs.plansRef);
        break;
      case "Contacto":
        handleScrollTo(refs.contactRef);
        break;
      case "Registrarse":
        handleNavigate("/auth/login");
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Typography sx={{ fontSize: "24px", marginBottom: "10px" }}>{ImportantLinksList.title}</Typography>
      {ImportantLinksList.elements.map(({ title }) => {
        return (
          <Typography
            className='transition-text'
            key={title}
            onClick={() => handleLinkClick(title)} // Maneja el clic en los enlaces
            sx={{ marginBottom: "8px", cursor: "pointer" }}
          >
            {title}
          </Typography>
        );
      })}
    </>
  );
};
