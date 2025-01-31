import { Route, Routes } from "react-router-dom";

import { NavBar } from "../../layaout/NavBar";

import LandingMain from "../pages/Main";
import { Helmet } from "react-helmet-async";
import FidelidApp from "../pages/FidelidApp";
import Services from "../pages/Services/components/Services";

export const LandingRoutes = ({ refs }) => {
  console.log(refs);
  return (
    <>
      <Helmet>
        <title>Fidelidapp - Aumenta tus ventas y fideliza a tus clientes</title>
        <meta name='description' content='Fidelidapp es una aplicación que te permite aumentar tus ventas y fidelizar a tus clientes.' />
        <meta
          name='keywords'
          content='Fidelidapp, fidelización de clientes, ventas a clientes,aumentar clientes, aumentar ventas,progama de beneficios, email marketing, diseño web chile, community manager chile, fidelidapp, fidelidapp.cl, '
        />
      </Helmet>

      <Routes>
        <Route element={<LandingMain refs={refs} />} path={"/"} />
        <Route element={<FidelidApp />} path={"/features"} />
        <Route element={<Services />} path={"/services"} />
      </Routes>
    </>
  );
};
