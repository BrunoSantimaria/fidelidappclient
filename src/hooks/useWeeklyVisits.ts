import { useState, useEffect } from "react";
import axios from "axios";
import api from "../utils/api";

interface DailyStats {
  date: string;
  visits: number;
  uniqueClients: number;
}

interface WeeklyVisits {
  totalVisits: number;
  uniqueClients: number;
  dailyStats: DailyStats[];
}

export const useWeeklyVisits = () => {
  const [weeklyVisits, setWeeklyVisits] = useState<WeeklyVisits | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getWeeklyVisits = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get("/api/promotions/stats/weekly-visits");
      console.log("Weekly visits response:", response.data);
      setWeeklyVisits(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.error || error.message;
        console.error("Error al obtener visitas semanales:", errorMessage);
        setError(errorMessage);
      } else {
        console.error("Error al obtener visitas semanales:", error);
        setError("Error desconocido al obtener las visitas semanales");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWeeklyVisits();
  }, []);

  return { weeklyVisits, loading, error, getWeeklyVisits };
};
