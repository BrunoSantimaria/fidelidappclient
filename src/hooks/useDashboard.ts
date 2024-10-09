import React from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../utils/api";
import { cleanActivePromotion, setActivePromotion, setMetrics, setPromotions } from "../store/dashboard/dashboardSlice";

export const useDashboard = () => {
  const { accounts, plan } = useSelector((state) => state.auth.user);
  const { metrics, promotions, activePromotion } = useSelector((state) => state.dashboard);
  const dispatch = useDispatch();

  const getPromotionsAndMetrics = async () => {
    try {
      const resp = await api.get("/api/promotions");
      dispatch(setPromotions(resp.data.promotions));
      dispatch(setMetrics(resp.data.metrics));
      console.log(resp.data.promotions);
    } catch (error) {
      console.log(error);
    }
  };
  const getPromotionById = async (id: string) => {
    console.log(id);

    try {
      const promotionById = await api.get(`/api/promotions/${id}`);
      console.log(promotionById);

      dispatch(setActivePromotion(promotionById.data));
    } catch (error) {
      console.log(error);
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
  return { accounts, plan, getPromotionsAndMetrics, metrics, promotions, deletePromotion, getPromotionById, activePromotion, cleanPromotion };
};
