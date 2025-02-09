import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../utils/api";
import {
  cleanActivePromotion,
  setActivePromotion,
  setAgendas,
  setClients,
  setLoading,
  setMetrics,
  setPromotions,
  setLastUpdate,
} from "../store/dashboard/dashboardSlice";
import { toast } from "react-toastify";
import { onLogOut } from "../store/auth/authSlice";
import { useNavigateTo } from "./useNavigateTo";
import { useAuthSlice } from "./useAuthSlice";
import { log } from "console";

export const useDashboard = () => {
  const { accounts, plan } = useSelector((state) => state.auth.user);
  const { user } = useAuthSlice();
  console.log(accounts);
  const { metrics, promotions, activePromotion, agendas, clients, loading, lastUpdate, cacheExpiration } = useSelector((state) => state.dashboard);
  const { refreshAccount } = useAuthSlice();
  const dispatch = useDispatch();
  const { handleNavigate } = useNavigateTo();

  const [loadingPromotions, setLoadingPromotions] = useState(false);
  const [loadingClients, setLoadingClients] = useState(false);
  const [loadingAgendas, setLoadingAgendas] = useState(false);

  useEffect(() => {
    dispatch(setPromotions([]));
    dispatch(setClients([]));
    dispatch(setAgendas([]));
    dispatch(setMetrics(null));
    dispatch(setLastUpdate(null));
    dispatch(cleanActivePromotion());

    getPromotionsAndMetrics(true);
  }, [accounts?._id]);

  const getPromotionsAndMetrics = async (forceUpdate = false) => {
    const now = Date.now();
    if (!forceUpdate && lastUpdate && now - lastUpdate < cacheExpiration && accounts?._id) {
      return;
    }

    if (!accounts?._id) {
      console.warn("No hay cuenta activa");
      return;
    }

    try {
      setLoadingPromotions(true);
      setLoadingClients(true);
      setLoadingAgendas(true);

      try {
        const promotionsResp = await api.get("/api/promotions");
        if (promotionsResp?.data) {
          dispatch(setPromotions(promotionsResp.data.promotions));
          dispatch(setMetrics(promotionsResp.data.metrics));
        }
      } finally {
        setLoadingPromotions(false);
      }

      try {
        const clientsResp = await api.get("/api/clients/getAccountClients", {
          params: { accountId: accounts._id },
        });

        if (clientsResp?.data) {
          dispatch(setClients(clientsResp.data.clients));
        }
      } finally {
        setLoadingClients(false);
      }

      try {
        const agendasResp = await api.get(`/api/agenda/account/${accounts._id}`);
        if (agendasResp?.data) {
          dispatch(setAgendas(agendasResp.data));
        }
      } finally {
        setLoadingAgendas(false);
      }

      dispatch(setLastUpdate(now));
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response?.status === 401) {
        dispatch(onLogOut(""));
        handleNavigate("/");
      }
      throw error;
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
  const getSubscription = async () => {
    try {
      if (!user?.accounts) {
        console.warn("Esperando datos del usuario...");
        return;
      }

      // Asegurarse de que accounts sea un array o un objeto
      const accountId = Array.isArray(user.accounts) ? user.accounts[0]?._id : user.accounts._id;

      if (!accountId) {
        console.warn("ID de cuenta no disponible");
        return;
      }

      const response = await api.get(`/api/mercadopago/check_and_update_subscription/${accountId}`);
      console.log(response);
    } catch (error) {
      console.log(error);
      toast.error("Error al verificar la suscripción");
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
    getSubscription,
    loadingPromotions,
    loadingClients,
    loadingAgendas,
  };
};
