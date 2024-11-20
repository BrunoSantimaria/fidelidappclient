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
  const { metrics, promotions, activePromotion, agendas, clients, loading, lastUpdate, cacheExpiration } = useSelector((state) => state.dashboard);
  const { refreshAccount } = useAuthSlice();
  const dispatch = useDispatch();
  const { handleNavigate } = useNavigateTo();

  const getPromotionsAndMetrics = async (forceUpdate = false) => {
    // Si no ha pasado el tiempo de caché y no es una actualización forzada, no actualizar
    if (!forceUpdate && lastUpdate && Date.now() - lastUpdate < cacheExpiration) {
      return;
    }

    try {
      dispatch(setLoading(true));
      const [promotionsResp, clientsResp, agendasResp] = await Promise.all([
        api.get("/api/promotions"),
        api.get("/api/clients/getAccountClients", {
          params: { accountId: accounts._id },
        }),
        api.get("/api/agenda"),
      ]);

      dispatch(setPromotions(promotionsResp.data.promotions));
      dispatch(setClients(clientsResp.data.clients));
      dispatch(setMetrics(promotionsResp.data.metrics));
      dispatch(setAgendas(agendasResp.data));
      dispatch(setLastUpdate(Date.now()));
    } catch (error) {
      console.log(error);
      if (error.response?.status === 401) {
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
  const getSubscription = async () => {
    console.log("plan", accounts);
    try {
      const response = await api.get(`/api/mercadopago/check_and_update_subscription/${accounts._id}`);
      console.log(response);
    } catch (error) {
      console.log(error);
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
  };
};
