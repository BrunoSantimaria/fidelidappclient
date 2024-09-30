import { Route, Routes } from "react-router-dom";
import { Home } from "../pages";

export const LandingRoutes = () => {
  return (
    <Routes>
      <Route element={<Home />} path={"/"} />
    </Routes>
  );
};
