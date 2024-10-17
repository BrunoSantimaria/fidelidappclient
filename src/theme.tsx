import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#5b7898",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  typography: {
    fontFamily: "Poppins, Roboto, sans-serif",
  },
  spacing: 8,
  components: {
    MuiContainer: {
      defaultProps: {
        maxWidth: false,
      },
      styleOverrides: {
        root: {
          paddingLeft: "16px",
          paddingRight: "16px",
          margin: "0 auto",
          width: "100vw",
          boxSizing: "border-box",
        },
      },
    },
    MuiBox: {
      styleOverrides: {
        root: {
          overflowX: "hidden",
        },
      },
    },
  },
});

export default theme;
