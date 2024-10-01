import { Container } from "@mui/material";
import { Home, OurServices } from "./";
export const Landing = () => {
  return (
    <Container
      sx={{
        display: "flex",
        flexDirection: "column",
        textAlign: "left",
        justifyContent: "flex-start", // Alinea el contenido a la izquierda
        minWidth: "100vw", // Asegura que ocupe todo el ancho
        padding: { md: "0 0px" },
        marginLeft: { xs: "0px", md: "0px" },
        margin: { xs: "0px" }, // Opcional: añade un poco de espacio en los lados
      }}
    >
      <Home />
      <OurServices />
    </Container>
  );
};
