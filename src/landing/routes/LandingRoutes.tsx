import { Route, Routes } from "react-router-dom";
import { Landing } from "../pages";
import tagManager from "react-gtm-module";

const tagManagerArgs = {
  gtmId: "GTM-PHNQR39N",
};
tagManager.initialize(tagManagerArgs);

tagManager.dataLayer({
  dataLayer: {
    event: "pageview",
    pagePath: "/",
  },
});
export const LandingRoutes = () => {
  return (
    <Routes>
      <Route element={<Landing />} path={"/"} />
    </Routes>
  );
};
