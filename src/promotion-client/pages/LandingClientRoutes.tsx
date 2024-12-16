import { Route, Routes } from "react-router-dom";
import { LandingPage } from "./LandingPage";
import FideliCard from "./FideliCard";

export const LandingClientRoutes = () => {
  return (
    <Routes>
      <Route index element={<LandingPage />} />

      <Route path='fidelicard/:clientId?' element={<FideliCard />} />
    </Routes>
  );
};
