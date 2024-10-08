import React from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../utils/api";
import { setMetrics, setPromotions } from "../store/dashboard/dashboardSlice";

export const useDashboard = () => {
  const { accounts, plan } = useSelector((state) => state.auth.user);
  const { metrics, promotions } = useSelector((state) => state.dashboard);
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

  const deletePromotion = async (promotionId: string) => {
    try {
      await api.delete(`/api/promotions/${promotionId}`);
    } catch (error) {
      console.log(error);
    } finally {
      getPromotionsAndMetrics();
    }
  };
  return { accounts, plan, getPromotionsAndMetrics, metrics, promotions, deletePromotion };
};
