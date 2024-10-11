import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define la estructura de una promoción
interface Promotion {
  _id: string;
  userID: string;
  title: string;
  description: string;
  promotionType: string;
  promotionRecurrent: string;
  visitsRequired: number;
  promotionDuration: number;
}

// Define la estructura de las métricas
interface Metrics {
  activePromotions: number;
  registeredClients: number;
  totalVisits: number;
  redeemedGifts: number;
}

export interface DashboardState {
  promotions: Promotion[];
  metrics: Metrics | null;
  loading: boolean;
  errorMessage: string | null;
}

// Estado inicial
const initialState: DashboardState = {
  promotions: [],
  agendas: [],
  metrics: null,
  loading: false,
  activePromotion: [],
  errorMessage: null,
};

export const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    setPromotions: (state, action: PayloadAction<Promotion[]>) => {
      state.promotions = action.payload;
    },

    setMetrics: (state, action: PayloadAction<Metrics>) => {
      state.metrics = action.payload;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setErrorMessage: (state, action: PayloadAction<string | null>) => {
      state.errorMessage = action.payload;
    },
    setActivePromotion: (state, action) => {
      state.activePromotion = action.payload;
    },
    setAgendas: (state, action) => {
      state.agendas = action.payload;
    },
    cleanActivePromotion: (state) => {
      state.activePromotion = [];
    },

    cleanUser: (state, action) => {
      state.promotions = [];
      state.metrics = null;
      state.errorMessage = "";
      state.loading = false;
      state.activePromotion = [];
      state.agendas = [];
    },
  },
});

export const { setPromotions, setMetrics, setLoading, setErrorMessage, setActivePromotion, cleanActivePromotion, setAgendas } = dashboardSlice.actions;

export default dashboardSlice.reducer;
