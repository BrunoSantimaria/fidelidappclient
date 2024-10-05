import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#5b7898", // Color primario
    },
    secondary: {
      main: "#dc004e", // Color secundario
    },
  },
  typography: {
    fontFamily: "Poppins, Roboto, sans-serif",
  },
  spacing: 8, // Este es el tamaño base para el espaciado, puedes ajustarlo según sea necesario
  components: {
    MuiContainer: {
      defaultProps: {
        maxWidth: false, // Evitar la limitación de ancho máximo
      },
      styleOverrides: {
        root: {
          paddingLeft: "16px", // Asegura un padding en el eje X
          paddingRight: "16px",
          margin: "0 auto", // Centra el contenedor
          width: "100vw", // Asegura que el ancho sea siempre 100vw
          boxSizing: "border-box", // Incluye padding en el ancho total
        },
      },
    },
    MuiBox: {
      styleOverrides: {
        root: {
          overflowX: "hidden", // Evita el desbordamiento horizontal
        },
      },
    },
  },
});

export default theme;
