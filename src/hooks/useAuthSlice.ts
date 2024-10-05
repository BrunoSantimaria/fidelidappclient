// hooks/useAuth.ts
import { useDispatch, useSelector } from "react-redux";
import { onLogin, onLogOut } from "../store/auth/authSlice";
import api from "../utils/api"; // Ajusta la ruta según la estructura de tu proyecto
import Cookies from "js-cookie";
// Asegúrate de que esta ruta sea correcta
import { useNavigateTo } from "./useNavigateTo"; // Asegúrate de que esta ruta sea correcta
import { jwtDecode } from "jwt-decode"; // Asegúrate de importar correctamente la función
import { useSnackbar } from "./useSnackBar";

export const useAuthSlice = () => {
  const dispatch = useDispatch();
  const { openSnackbar } = useSnackbar();
  const { handleNavigate } = useNavigateTo();
  const { user, status } = useSelector((state) => state.auth);

  const startLogin = async (formData) => {
    try {
      const response = await api.post("/auth/signin", formData);
      const token = response.data.token;

      Cookies.set("token", token, { expires: 7 });

      const user = decodeToken(token);

      dispatch(onLogin(user));
      handleNavigate("/dashboard");
      openSnackbar("Usuario loggeado correctamente, serás redireccionado al home.", "success");
    } catch (error) {
      console.error("Error signing in:", error);
      openSnackbar("No se ha podido iniciar sesión", "error");
    }
  };

  const startGoogleSignIn = async (response) => {
    const userData = {
      googleIdToken: response.credential,
    };

    try {
      const apiResponse = await api.post("/auth/google-signin", userData);
      const token = apiResponse.data.token;

      Cookies.set("token", token, { expires: 7 });

      const user = decodeToken(token);
      dispatch(onLogin(user));

      openSnackbar("Usuario logueado correctamente, serás redireccionado al home.", "success");

      setTimeout(() => {
        handleNavigate("/dashboard");
      }, 2000);
    } catch (error) {
      console.error("Error signing in with Google:", error);
      openSnackbar("No se ha podido iniciar sesión", "error");
    }
  };

  const startRegister = async (formData) => {
    try {
      await api.post("/auth/signup", formData);
      openSnackbar("Usuario creado correctamente", "success");
      handleNavigate("/auth/login");
    } catch (error) {
      console.error("Error signing up:", error);
      openSnackbar("No se ha podido crear el usuario", "error");
    }
  };

  const decodeToken = (token: string) => {
    return jwtDecode(token);
  };

  const startLoggingOut = () => {
    Cookies.remove("authToken");
    Cookies.remove("token");

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
