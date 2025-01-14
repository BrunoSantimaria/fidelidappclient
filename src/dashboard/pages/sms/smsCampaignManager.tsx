import React, { useState, useEffect } from "react";
import { Box, Typography, Card, CardContent, Button, CircularProgress } from "@mui/material";
import CampaignTable from "./components/CampaignTable";
import CampaignForm from "./components/CampaignForm";
import api from "../../../utils/api";

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
    <Box className='w-full px-4 md:w-[90%] md:ml-32'>
      <Typography variant="h4" gutterBottom sx={{ mt: 2 }}>
        Gestiona Campañas en SMS
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" }, // Stack on mobile, row on larger screens
          justifyContent: { xs: "flex-start", sm: "space-between" }, // Space-between for large screens
          alignItems: "stretch", // Ensures cards align properly in height
          mb: 2,
          flexWrap: "wrap", // Wrap items if space is constrained
        }}
      >
        {[
          {
            title: "Clientes con Número",
            value: totalCustomers,
          },
          {
            title: "Campañas Sms Creadas",
            value: campaigns.length,
          },
          {
            title: "SMS Enviados este Mes",
            value: sentSms,
          },
          {
            title: "SMS Restantes este Mes",
            value: smsLimit - sentSms,
          },
        ].map((item, index) => (
          <Card
            key={index}
            sx={{
              flex: "1 1 auto", // Allow cards to grow and fill available space
              textAlign: "center",
              boxShadow: 2,
              borderRadius: 2,
              mb: { xs: 2, sm: 1 }, // Space between rows on mobile, none on large screens
              mx: { xs: 1, sm: 1 }, // Margin on horizontal axis for spacing

            }}
          >
            <CardContent>
              {loading ? (
                <CircularProgress />
              ) : error ? (
                <Typography color="error">{error}</Typography>
              ) : (
                <>
                  <Typography variant="h6">{item.title}</Typography>
                  <Typography variant="h4">{item.value}</Typography>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>


      <Button
        onClick={handleFormOpen}
        variant="contained"
        sx={{ mb: 2 }}
        fullWidth
        color="primary"
        disabled={smsLimit - sentSms <= 0} // Disable the button if there are no remaining SMS
      >
        Crear Nueva Campaña
      </Button>

      <CampaignForm open={isFormOpen} onClose={handleFormClose} onCampaignCreated={fetchCampaigns} totalCustomers={totalCustomers} />

      <CampaignTable campaigns={campaigns} />
    </Box>
  );
};
