import { Route, Routes } from "react-router-dom";
import { Landing } from "../pages";
import { Box } from "@mui/material";

export const LandingRoutes = () => {
  return (
    <Routes>
      <Route element={<Landing />} path={"/"} />
    </Routes>
  );
};
