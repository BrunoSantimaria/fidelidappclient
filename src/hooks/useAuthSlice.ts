// hooks/useAuth.ts
import { useDispatch, useSelector } from "react-redux";
import { onLogin, onLogOut, refreshAccountAndPlan } from "../store/auth/authSlice";
import api from "../utils/api";
import { useNavigateTo } from "./useNavigateTo";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";
import axios from "axios";

export const useAuthSlice = () => {
  const dispatch = useDispatch();

  const { handleNavigate } = useNavigateTo();
  const { user, status } = useSelector((state) => state.auth);

  const startLogin = async (formData) => {
    try {
      const modifiedFormData = {
        ...formData,
        email: formData.email.toLowerCase(),
      };

      const response = await api.post("/auth/signin", modifiedFormData);

      if (response.data.needsVerification) {
        toast.error("Por favor verifica tu correo electrónico antes de iniciar sesión");
        return;
      }

      const token = response.data.token;
      localStorage.setItem("token", token);

      // Obtener los datos del usuario actual incluyendo accounts y plan
      const currentUserResponse = await api.get("/auth/current");
      const { accounts, plan } = currentUserResponse.data;

      localStorage.setItem("accounts", JSON.stringify(accounts));
      localStorage.setItem("plan", JSON.stringify(plan));

      const user = decodeToken(token);
      const userWithAccountAndPlan = {
        ...user,
        accounts: accounts,
        plan: plan,
      };

      dispatch(onLogin(userWithAccountAndPlan));
      handleNavigate("/dashboard");
      toast.success("Login exitoso, serás redireccionado al dashboard.");
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Credenciales inválidas");
      } else if (error.response?.status === 403) {
        toast.error("Por favor verifica tu correo electrónico antes de iniciar sesión");
      } else {
        toast.error("Error al iniciar sesión");
      }
      throw error;
    }
  };

  const startGoogleSignIn = async (response) => {
    const userData = {
      googleIdToken: response.credential,
    };

    try {
      const apiResponse = await api.post("/auth/google-signin", userData);
      const { token } = apiResponse.data;

      localStorage.setItem("token", token);
      const user = decodeToken(token);

      const currentUserResponse = await api.get("/auth/current");
      const { accounts, plan } = currentUserResponse.data;

      localStorage.setItem("accounts", JSON.stringify(accounts));
      localStorage.setItem("plan", JSON.stringify(plan));

      const userWithAccountAndPlan = {
        ...user,
        accounts: accounts,
        plan: plan,
      };

      dispatch(onLogin(userWithAccountAndPlan));

      toast.success("Login exitoso, serás redireccionado al dashboard.");

      setTimeout(() => {
        handleNavigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error signing in with Google:", error);
      if (error.response.status === 409) return toast.error("El email ya está registrado");
      toast.error("No se ha podido iniciar sesión");
    }
  };

  const startRegister = async ({ email, password, name, phone, recaptchaToken }) => {
    try {
      const { data } = await api.post("/auth/signup", {
        email,
        password,
        name,
        phone,
        recaptchaToken,
      });

      if (data.success) {
        toast.success("Registro exitoso. Te hemos enviado un email de verificación.");
        return data;
      }
    } catch (error) {
      console.error("Error en registro:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          toast.error("Este email ya está registrado");
        } else if (error.response?.data?.message) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Error en el registro");
        }
      }
      throw error;
    }
  };

  const decodeToken = (token: string) => {
    return jwtDecode(token);
  };

  const startLoggingOut = () => {
    localStorage.clear();

    dispatch(onLogOut(""));
  };
  const refreshAccount = async () => {
    try {
      const currentUserResponse = await api.get("/auth/current");
      console.log("🚀 ~ refreshAccount ~ currentUserResponse:", currentUserResponse);
      const { accounts, plan } = currentUserResponse.data;

      localStorage.setItem("accounts", JSON.stringify(accounts));
      localStorage.setItem("plan", JSON.stringify(plan));

      const accountAndPlan = {
        accounts: accounts,
        plan: plan,
      };

      dispatch(refreshAccountAndPlan(accountAndPlan));
    } catch (error) {
      console.error("Error fetching current user details:", error);
      toast.error("No se han podido obtener las cuentas y el plan.");
    }
  };

  return {
    startLogin,
    startGoogleSignIn,
    startRegister,
    user,
    startLoggingOut,
    status,
    refreshAccount,
  };
};
