import React from "react";
import { Route, Routes } from "react-router-dom";
import { LoginPage } from "../pages";
import { Helmet } from "react-helmet-async";

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route element={<LoginPage />} path='login' />
    </Routes>
  );
};
