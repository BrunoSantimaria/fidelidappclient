import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";

export interface User {
  id: string;
  email: string;
  name: string;
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

const getTokenFromCookies = () => {
  return (
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1] || null
  );
};

const token = getTokenFromCookies();
let initialUser = null;

if (token) {
  try {
    const decodedToken = jwtDecode<DecodedToken>(token);
    initialUser = { id: decodedToken.id, email: decodedToken.email, name: decodedToken.name };
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
    clearErrorMessage: (state) => {
      state.errorMessage = null;
      state.errorRegisterMessage = null;
    },
  },
});

export const { onChecking, onLogin, onLogOut, clearErrorMessage, onLogOutRegister } = authSlice.actions;

export default authSlice.reducer;
