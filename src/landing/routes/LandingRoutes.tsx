import { Route, Routes } from "react-router-dom";
import { Landing } from "../pages";
import { ThankYou } from "../pages/ThankYou";

export const LandingRoutes = () => {
  return (
    <Routes>
      <Route element={<Landing />} path={"/"} />
      <Route element={<ThankYou />} path={"/thankyou"} />
    </Routes>
  );
};
