import React, { useState, useEffect } from "react";
import { Box, Typography, Card, CardContent, Button, CircularProgress } from "@mui/material";
import CampaignTable from "./components/CampaignTable";
import CampaignForm from "./components/CampaignForm";
import api from "../../../utils/api";
import { motion } from "framer-motion";
import { Star as StarIcon } from "@mui/icons-material";
import { People as PeopleIcon, Campaign as CampaignIcon, Visibility as VisibilityIcon, Stars as StarsIcon } from "@mui/icons-material";

// Componente MetricCard reutilizado
const MetricCard = ({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`rounded-2xl p-6 shadow-md shadow-black/20 hover:shadow-lg transition-all duration-300 ${title === "Índice Fidelidad" ? "bg-main" : "bg-white"}`}
  >
    <div className='flex items-center justify-between'>
      <div className={`p-2 rounded-lg ${title === "Índice Fidelidad" ? "bg-main/20" : "bg-primary-50"}`}>
        {title === "Índice Fidelidad" ? <StarIcon sx={{ color: "#FFD700" }} /> : icon}
      </div>
    </div>
    <h3 className={`mt-4 text-3xl font-bold ${title === "Índice Fidelidad" ? "text-white" : "text-gray-800"}`}>{value?.toLocaleString()}</h3>
    <p className={`mt-1 text-sm ${title === "Índice Fidelidad" ? "text-white" : "text-gray-500"}`}>{title}</p>
  </motion.div>
);

export const SmsCampaignManager = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(null);
  const [smsLimit, setSmsLimit] = useState([]);
  const [sentSms, setSentSms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetchCampaigns();
    //fetchCustomers();
  }, []);

  const fetchCampaigns = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/sms/campaigns");
      setCampaigns(response.data.data || []);
      setTotalCustomers(response.data.totalContactsWithPhoneNumber);
      setSmsLimit(response.data.SmsLimit);
      setSentSms(response.data.SmsSentCount);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      setError("Failed to load campaign data");
    }
    setLoading(false);
  };

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/api/sms/getCustomers");
      setTotalCustomers(response.data.data.length);
    } catch (error) {
      console.error("Error fetching customers:", error);
      setError("Failed to load customer data");
    }
    setLoading(false);
  };

  const handleFormClose = () => setIsFormOpen(false);
  const handleFormOpen = () => setIsFormOpen(true);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-7xl mx-auto space-y-6'>
        <Typography variant='h4' gutterBottom sx={{ mt: 2 }}>
          Gestiona Campañas en SMS
        </Typography>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          <MetricCard title='Clientes con Número' value={totalCustomers} icon={<PeopleIcon />} />
          <MetricCard title='Campañas Sms Creadas' value={campaigns.length} icon={<CampaignIcon />} />
          <MetricCard title='SMS Enviados este Mes' value={sentSms} icon={<VisibilityIcon />} />
          <MetricCard title='SMS Restantes este Mes' value={smsLimit - sentSms} icon={<StarsIcon />} />
        </div>

        <Button onClick={handleFormOpen} variant='contained' sx={{ mb: 2 }} fullWidth color='primary' disabled={smsLimit - sentSms <= 0}>
          Crear Nueva Campaña
        </Button>

        <CampaignForm open={isFormOpen} onClose={handleFormClose} onCampaignCreated={fetchCampaigns} totalCustomers={totalCustomers} />

        <CampaignTable campaigns={campaigns} />
      </div>
    </motion.div>
  );
};
