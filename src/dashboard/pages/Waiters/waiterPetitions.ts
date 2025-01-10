import api from "@/utils/api";
import { AxiosResponse } from "axios";

interface Waiter {
  _id: string;
  name: string;
  active: boolean;
  totalPoints: number;
  averageRating: number;
  averagePointsPerDay: number;
  ratings: Array<{
    rating: number;
    comment?: string;
    date: string;
  }>;
  pointsHistory: Array<{
    points: number;
    date: string;
  }>;
}

interface WaiterCreateData {
  name: string;
  active: boolean;
}

interface WaiterUpdateData {
  name?: string;
  active?: boolean;
}

export const getWaiters = async (accountId: string): Promise<Waiter[]> => {
  const response: AxiosResponse<Waiter[]> = await api.get(`/api/waiters/accounts/${accountId}/waiters`);
  console.log(accountId);
  return response.data;
};

export const createWaiter = async (accountId: string, data: WaiterCreateData): Promise<Waiter> => {
  const response: AxiosResponse<Waiter> = await api.post(`/api/waiters/accounts/${accountId}/waiters`, data);
  return response.data;
};

export const updateWaiter = async (accountId: string, waiterId: string, data: WaiterUpdateData): Promise<Waiter> => {
  const response: AxiosResponse<Waiter> = await api.put(`/api/waiters/accounts/${accountId}/waiters/${waiterId}`, data);
  return response.data;
};

export const deleteWaiter = async (accountId: string, waiterId: string): Promise<void> => {
  await api.delete(`/api/waiters/accounts/${accountId}/waiters/${waiterId}`);
};

export const addRating = async (accountId: string, waiterId: string, rating: number, comment?: string): Promise<Waiter> => {
  const response: AxiosResponse<Waiter> = await api.post(`/api/waiters/accounts/${accountId}/waiters/${waiterId}/ratings`, {
    rating,
    comment,
  });
  return response.data;
};

export const addPoints = async (accountId: string, waiterId: string, points: number): Promise<Waiter> => {
  const response: AxiosResponse<Waiter> = await api.post(`/api/waiters/accounts/${accountId}/waiters/${waiterId}/points`, {
    points,
  });
  return response.data;
};
