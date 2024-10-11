import React from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../utils/api";
import { cleanActivePromotion, setActivePromotion, setAgendas, setMetrics, setPromotions } from "../store/dashboard/dashboardSlice";
import { toast } from "react-toastify";
import { ObjectId } from "mongodb";
export const useDashboard = () => {
  const { accounts, plan } = useSelector((state) => state.auth.user);
  const { metrics, promotions, activePromotion, agendas } = useSelector((state) => state.dashboard);
  const dispatch = useDispatch();

  const getPromotionsAndMetrics = async () => {
    try {
      const resp = await api.get("/api/promotions");
      dispatch(setPromotions(resp.data.promotions));
      dispatch(setMetrics(resp.data.metrics));
      const agendas = await api.get("/api/agenda");
      console.log(agendas);

      dispatch(setAgendas(agendas.data));
      console.log(resp.data.promotions);
    } catch (error) {
      console.log(error);
    }
  };
  const getPromotionById = async (id: string) => {
    console.log(id);

    try {
      const promotionById = await api.get(`/api/promotions/${id}`);

      dispatch(setActivePromotion(promotionById.data));
    } catch (error) {
      console.log(error);
    }
  };
  interface PromotionData {
    title: string;
    description: string;
    conditions: string;
    promotionType: string;
    promotionRecurrent: string;
    visitRequired: number;
    promotionDuration: number;
    imageFile: File;
  }
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
  };
};
