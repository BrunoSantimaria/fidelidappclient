import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie"; // Asegúrate de que has instalado js-cookie

export interface User {
  id: string;
  email: string;
  name: string;
  accounts?: {
    _id: string;
    owner: string;
    userEmails: string[];
    planStatus: string;
    activeQr: boolean;
    createdAt: string;
  };
  plan?: {
    _id: string;
    planStatus: string;
    promotionLimit: number;
    emailLimit: number;
    clientLimit: number;
    sendEmail: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

export interface AuthState {
  status: "checking" | "authenticated" | "non-authenticated" | "not-authenticated";
  user: User | null;
  errorMessage: string | null;
  errorRegisterMessage: string | null;
  loading: boolean;
}

interface DecodedToken {
  id: string;
  email: string;
  name: string;
}

const token = localStorage.getItem("token");

let initialUser = null;

if (token) {
  try {
    const decodedToken = jwtDecode<DecodedToken>(token);
    const accounts = JSON.parse(localStorage.getItem("accounts") || "{}"); // Obteniendo cuentas desde las cookies
    const plan = JSON.parse(localStorage.getItem("plan") || "{}"); // Obteniendo plan desde las cookies
    initialUser = {
      id: decodedToken.id,
      email: decodedToken.email,
      name: decodedToken.name,
      accounts: accounts, // Incluyendo cuentas
      plan: plan, // Incluyendo plan
    };
  } catch (error) {
    console.error("Error decoding token:", error);
  }
}

const initialState: AuthState = {
  status: token ? "authenticated" : "non-authenticated",
  user: initialUser,
  errorMessage: null,
  errorRegisterMessage: null,
  loading: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    onChecking: (state) => {
      state.status = "checking";
      state.user = null;
      state.errorMessage = null;
      state.loading = true;
    },
    onLogin: (state, action: PayloadAction<User>) => {
      state.status = "authenticated";
      state.user = action.payload;
      state.errorMessage = null;
      state.loading = false;
    },
    onLogOut: (state, action: PayloadAction<string | null>) => {
      state.status = "non-authenticated";
      state.user = null;
      state.errorMessage = action.payload;
      state.loading = false;
    },
    onLogOutRegister: (state, action: PayloadAction<string | null>) => {
      state.status = "not-authenticated";
      state.user = null;
      state.errorMessage = null;
      state.errorRegisterMessage = action.payload || null;
    },
    refreshAccountAndPlan: (state, action) => {
      state.user = {
        ...state.user,
        accounts: action.payload.accounts,
        plan: action.payload.plan,
      };
    },
    clearErrorMessage: (state) => {
      state.errorMessage = null;
      state.errorRegisterMessage = null;
    },
  },
});

export const { onChecking, onLogin, onLogOut, clearErrorMessage, onLogOutRegister, refreshAccountAndPlan } = authSlice.actions;

export default authSlice.reducer;
