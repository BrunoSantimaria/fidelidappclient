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
});

export default theme;
