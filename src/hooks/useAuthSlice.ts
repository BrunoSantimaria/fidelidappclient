// hooks/useAuth.ts
import { useDispatch, useSelector } from "react-redux";
import { onLogin, onLogOut, refreshAccountAndPlan } from "../store/auth/authSlice";
import api from "../utils/api";
import Cookies from "js-cookie";
import { useNavigateTo } from "./useNavigateTo";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

export const useAuthSlice = () => {
  const dispatch = useDispatch();

  const { handleNavigate } = useNavigateTo();
  const { user, status } = useSelector((state) => state.auth);

  const startLogin = async (formData) => {
    let token;
    try {
      const modifiedFormData = {
        ...formData,
        email: formData.email.toLowerCase(),
      };

      const response = await api.post("/auth/signin", modifiedFormData);
      token = response.data.token;

      localStorage.setItem("token", token);

      const user = decodeToken(token);
      dispatch(onLogin(user));

      handleNavigate("/dashboard");
      toast.success("Login exitoso, serás redireccionado al dashboard.");
    } catch (error) {
      if (error.message === "Request failed with status code 401") {
        console.log(error);
        return toast.error("Credenciales inválidas.");
      }
      console.error("Error signing in:", error);
      toast.error("No se ha podido iniciar sesión");
    } finally {
      try {
        const currentUserResponse = await api.get("/auth/current");
        console.log(currentUserResponse);
        const { accounts, plan } = currentUserResponse.data;

        localStorage.setItem("accounts", JSON.stringify(accounts));
        localStorage.setItem("plan", JSON.stringify(plan));

        const user = decodeToken(token);
        console.log(plan);
        const userWithAccountAndPlan = {
          ...user,
          accounts: accounts,
          plan: plan,
        };

        dispatch(onLogin(userWithAccountAndPlan));
      } catch (error) {
        console.error("Error fetching current user details:", error);
      }
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

  const startRegister = async (formData) => {
    try {
      const modifiedFormData = {
        ...formData,
        email: formData.email.toLowerCase(),
      };

      const response = await api.post("/auth/signup", modifiedFormData);
      return { success: true, data: response.data };
    } catch (error) {
      console.log(error);
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
    console.log("click");

    try {
      const currentUserResponse = await api.get("/auth/current");
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
