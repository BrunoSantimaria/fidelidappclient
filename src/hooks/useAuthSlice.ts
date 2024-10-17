// hooks/useAuth.ts
import { useDispatch, useSelector } from "react-redux";
import { onLogin, onLogOut } from "../store/auth/authSlice";
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
    try {
      const response = await api.post("/auth/signin", formData);
      const { token } = response.data;

      Cookies.set("authToken", token, { expires: 7, secure: true, sameSite: "None" });

      const user = decodeToken(token);

      const currentUserResponse = await api.get("/auth/current");
      const { accounts, plan } = currentUserResponse.data;

      Cookies.set("accounts", JSON.stringify(accounts), { expires: 7, secure: true, sameSite: "None" });
      Cookies.set("plan", JSON.stringify(plan), { expires: 7, secure: true, sameSite: "None" });
      const userWithAccountAndPlan = {
        ...user,
        accounts: accounts,
        plan: plan,
      };

      dispatch(onLogin(userWithAccountAndPlan));

      handleNavigate("/dashboard");
      toast.success("Login exitoso, serás redireccionado al dashboard.");
    } catch (error) {
      if (error.message === "Request failed with status code 401") {
        return toast.error("Credenciales invalidas.");
      }
      console.error("Error signing in:", error);
      toast.error("No se ha podido iniciar sesión");
    }
  };

  const startGoogleSignIn = async (response) => {
    const userData = {
      googleIdToken: response.credential,
    };

    try {
      const apiResponse = await api.post("/auth/google-signin", userData);
      const { token } = apiResponse.data;

      Cookies.set("authToken", token, { expires: 7 });

      const user = decodeToken(token);

      const currentUserResponse = await api.get("/auth/current");
      const { accounts, plan } = currentUserResponse.data;

      Cookies.set("accounts", JSON.stringify(accounts), { expires: 7 });
      Cookies.set("plan", JSON.stringify(plan), { expires: 7 });

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
      toast.error("No se ha podido iniciar sesión");
    }
  };

  const startRegister = async (formData) => {
    try {
      await api.post("/auth/signup", formData);
      toast.success("Usuario creado correctamente");
      handleNavigate("/auth/login#");
    } catch (error) {
      toast.error("No se ha podido crear el usuario");
    }
  };

  const decodeToken = (token: string) => {
    return jwtDecode(token);
  };

  const startLoggingOut = () => {
    Cookies.remove("authToken");
    Cookies.remove("token");
    Cookies.remove("accounts");
    Cookies.remove("plan");

    dispatch(onLogOut(""));
  };

  return {
    startLogin,
    startGoogleSignIn,
    startRegister,
    user,
    startLoggingOut,
    status,
  };
};
