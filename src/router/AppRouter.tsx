import { LandingRoutes } from "../landing/routes/LandingRoutes";
import { Route, Routes, Navigate } from "react-router-dom";
import { AuthRoutes } from "../auth/routes/AuthRoutes";
import { NavBar } from "../layaout";
import { NavLink } from "../interfaces/types";
import Footer from "../layaout/Footer";

const navLinks: NavLink[] = [
  {
    title: "Home",
    path: "/",
    icon: "<IoMdHome />",
  },
  {
    title: "Cómo Funciona",
    path: "/",
    icon: "",
  },
];
export const AppRouter = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <NavBar />

      {/* Aquí utilizamos flex-grow para que el contenido principal empuje el footer hacia abajo */}
      <div style={{ flexGrow: 1 }}>
        <Routes>
          {/* Rutas para usuarios no autenticados */}
          <Route path='/' element={<LandingRoutes />} />
          <Route path='/auth/*' element={<AuthRoutes />} />
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </div>

      <Footer />
    </div>
  );
};
