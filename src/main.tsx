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
import { HelmetProvider } from "react-helmet-async";
import ReactGA from "react-ga4";
import { StrictMode } from "react";
import { AuthProvider } from "./promotion-client/utils/AuthContext.tsx";

ReactGA.initialize("G-Q91RG51PRW");

const rootElement = document.getElementById("root")!;
createRoot(rootElement).render(
  <Provider store={store}>
    <BrowserRouter>
      <AuthProvider>
        <HelmetProvider>
          <GoogleOAuthProvider clientId='833746654519-bu68dd7uhn7bsgcvsjrrmnucl0nobta3.apps.googleusercontent.com'>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <AppRouter />
            </ThemeProvider>
          </GoogleOAuthProvider>
        </HelmetProvider>
      </AuthProvider>
    </BrowserRouter>
  </Provider>
);

const sendPageView = (location: any) => {
  ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
};

window.addEventListener("popstate", () => {
  sendPageView(window.location);
});
