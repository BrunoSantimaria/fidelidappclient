import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../utils/api";
import { cleanActivePromotion, setActivePromotion, setAgendas, setClients, setLoading, setMetrics, setPromotions } from "../store/dashboard/dashboardSlice";
import { toast } from "react-toastify";
import { onLogOut } from "../store/auth/authSlice";
import { useNavigateTo } from "./useNavigateTo";
import { useAuthSlice } from "./useAuthSlice";
import { log } from "console";

export const useDashboard = () => {
  const { accounts, plan } = useSelector((state) => state.auth.user);
  const { metrics, promotions, activePromotion, agendas, clients, loading } = useSelector((state) => state.dashboard);
  const { refreshAccount } = useAuthSlice();
  const dispatch = useDispatch();
  const { handleNavigate } = useNavigateTo();

  const getPromotionsAndMetrics = async () => {
    try {
      const resp = await api.get("/api/promotions");
      console.log(resp.data);
      dispatch(setLoading(true));
      dispatch(setPromotions(resp.data.promotions));
      dispatch(setMetrics(resp.data.metrics));

      const agendas = await api.get("/api/agenda");
      dispatch(setAgendas(agendas.data));
      console.log(accounts);

      const clients = await api.get("/api/clients/getAccountClients", {
        params: { accountId: accounts._id },
      });

      dispatch(setClients(clients.data.clients));
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401) {
        // Maneja el logout desde aquí
        dispatch(onLogOut(""));
        handleNavigate("/");
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  const getPromotionById = async (id: string) => {
    try {
      const promotionById = await api.get(`/api/promotions/${id}`);
      dispatch(setActivePromotion(promotionById.data.promotion));
    } catch (error) {
      console.log(error);
    }
  };

  const modifyPromotion = async (id: string, promotionData: PromotionData): Promise<void> => {
    try {
      await api.put(`/api/promotions/${id}`, promotionData);
      toast.info("Promoción modificada.");
    } catch (error) {
      console.error("Error modifying promotion:", error);
      toast.error("Error al modificar promoción.");
    }
  };

  const cleanPromotion = () => {
    dispatch(cleanActivePromotion());
  };

  const deletePromotion = async (promotionId: string) => {
    try {
      await api.delete(`/api/promotions/${promotionId}`);
    } catch (error) {
      console.log(error);
    } finally {
      getPromotionsAndMetrics();
    }
  };

  const deleteAgenda = async (id) => {
    try {
      await api.delete(`/api/agenda/${id}`);
      toast.info("Agenda eliminada.");
    } catch (error) {
      console.log(error);
      toast.error("Hubo un problema al eliminar la agenda.");
    } finally {
      getPromotionsAndMetrics();
    }
  };
  const regenerateQr = async (accountId: string) => {
    console.log(accountId, "clicked");

    try {
      await api.post(`/accounts/refresh`, { accountId });
      //await refreshAccount();
      toast.info("QR regenerado.");
    } catch (error) {
      console.log(error);
      toast.error("Hubo un problema al regenerar el QR.");
    }
  };
  return {
    accounts,
    plan,
    getPromotionsAndMetrics,
    metrics,
    promotions,
    deletePromotion,
    getPromotionById,
    activePromotion,
    cleanPromotion,
    agendas,
    deleteAgenda,
    modifyPromotion,
    clients,
    regenerateQr,
    loading,
  };
};
