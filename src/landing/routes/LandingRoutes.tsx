import { Route, Routes } from "react-router-dom";
import { Landing } from "../pages";

export const LandingRoutes = () => {
  return (
    <Routes>
      <Route element={<Landing />} path={"/"} />
    </Routes>
  );
};
