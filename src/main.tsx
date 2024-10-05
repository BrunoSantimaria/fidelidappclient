import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import theme from "./theme.tsx";
import { CssBaseline } from "@mui/material";
import { AppRouter } from "./router/AppRouter.tsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <BrowserRouter>
      <GoogleOAuthProvider clientId='833746654519-bu68dd7uhn7bsgcvsjrrmnucl0nobta3.apps.googleusercontent.com'>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AppRouter />
        </ThemeProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </Provider>
);
