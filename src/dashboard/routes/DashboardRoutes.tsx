import { Route, Routes } from "react-router";
import { Dashboard } from "../pages";
import { AppProvider, DashboardLayout } from "@toolpad/core";
import logo from "../../assets/LogoAzulSinFondo.png";
export const DashboardRoutes = () => {
  return (
    <AppProvider
      branding={{
        logo: <img src={logo} height={150} alt='FidelidApp Logo' />,
        title: "",
      }}
    >
      {" "}
      <DashboardLayout>
        <Routes>
          <Route element={<Dashboard />} path='/' />
        </Routes>
      </DashboardLayout>
    </AppProvider>
  );
};
