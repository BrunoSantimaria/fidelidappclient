import { Route, Routes } from "react-router-dom";
import { LandingPage } from "./LandingPage";
import FideliCard from "./FideliCard";

export const LandingClientRoutes = () => {
  return (
    <Routes>
      {/* Landing page for a specific account/restaurant */}
      <Route index element={<LandingPage />} />

      {/* FideliCard route AFTER the index route */}
      <Route path='fidelicard/:clientId?' element={<FideliCard />} />
    </Routes>
  );
};
