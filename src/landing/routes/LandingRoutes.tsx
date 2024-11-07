import { Route, Routes } from "react-router-dom";
import { Landing } from "../pages";
import { ThankYou } from "../pages/ThankYou";
import { PromotionQrLanding } from "../components/PromotionQrLanding";

export const LandingRoutes = () => {
  return (
    <Routes>
      <Route element={<Landing />} path={"/"} />
      <Route element={<ThankYou />} path={"/thankyou"} />
      <Route element={<PromotionQrLanding />} path={"/promotionqrlanding"} />
    </Routes>
  );
};
