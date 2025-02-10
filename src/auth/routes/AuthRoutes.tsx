import React from "react";
import { Route, Routes } from "react-router-dom";
import { LoginPage } from "../pages";
import { VerifyEmailPage } from "../pages/VerifiyEmailPage";
import { Helmet } from "react-helmet-async";

export const AuthRoutes = () => {
  return (
    <Routes>
      <Route path='login' element={<LoginPage />} />
      <Route path='verify-email/:token' element={<VerifyEmailPage />} />
    </Routes>
  );
};
