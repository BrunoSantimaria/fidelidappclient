import { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts";
import { Box, Stack, Typography, CircularProgress, Card, Button } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableFooter, TablePagination } from "@mui/material";
import api from "../../../utils/api";
import {
  People as PeopleIcon,
  Stars as StarsIcon,
  Visibility as VisibilityIcon,
  CardGiftcard as CardGiftcardIcon,
  Campaign as CampaignIcon,
  Description as FileTextIcon,
  Info as InfoIcon,
} from "@mui/icons-material";
import LinearProgress from "@mui/material/LinearProgress";

// [Los componentes MetricCard, ClientMetricsTable y LoadingReport se mantienen igual]

export const Report = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let progressTimer;
    const fetchData = async () => {
      try {
        progressTimer = setInterval(() => {
          setProgress((prev) => (prev >= 90 ? 90 : prev + 10));
        }, 500);

        const response = await api.post("/api/promotions/getDashboardMetrics");
        setData(response.data);
        setProgress(100);
      } catch (error) {
        setError("Error al cargar los datos");
        console.error("Error:", error);
      } finally {
        clearInterval(progressTimer);
        setLoading(false);
      }
    };
    fetchData();

    return () => {
      if (progressTimer) clearInterval(progressTimer);
    };
  }, []);

  if (loading) {
    return <LoadingReport progress={progress} />;
  }

  if (error) return <Typography color='error'>{error}</Typography>;
  if (!data) return null;

  const dailyLabels = data.dailyData.map((entry) => entry.date);
  const dailyVisits = data.dailyData.map((entry) => entry.visits);
  const dailyRegistrations = data.dailyData.map((entry) => entry.registrations);
  const dailyPoints = data.dailyData.map((entry) => entry.points);

  const clientVisitsData = data.visitDataByClient?.map((client) => ({ client: client.client, value: client.visits })) || [];
  const clientPointsData = data.pointDataByClient?.map((client) => ({ client: client.client, value: client.points })) || [];

  return (
    <div className='w-[80%] ml-0 md:ml-48'>
      <Stack spacing={4} sx={{ p: 2, pt: { xs: 2, md: 6 } }}>
        {/* Métricas superiores */}
        <Stack
          direction='row'
          spacing={2}
          sx={{
            flexWrap: "wrap",
            gap: 2,
            justifyContent: "center",
          }}
        >
          <MetricCard title='Clientes Totales' value={data?.totalClients} icon={<PeopleIcon />} />
          <MetricCard title='Puntos Acumulados' value={data?.totalPoints} icon={<StarsIcon />} />
          <MetricCard title='Visitas Totales' value={data?.totalVisits} icon={<VisibilityIcon />} />
          <MetricCard title='Canjes Realizados' value={data?.totalRedeemCount} icon={<CardGiftcardIcon />} />
          <MetricCard title='Promociones Activas' value={data?.totalPromotions} icon={<CampaignIcon />} />
        </Stack>

        {/* Gráfico */}
        <Card sx={{ p: 3, borderTop: 3, borderColor: "primary.main" }}>
          <Typography variant='h6' gutterBottom>
            Tus clientes en los últimos 7 días
          </Typography>
          <Typography variant='body2' color='text.secondary' gutterBottom>
            Análisis de visitas, registros y puntos acumulados
          </Typography>
          <Box sx={{ height: 400, mt: 2 }}>
            <LineChart
              series={[
                { data: dailyVisits, label: "Visitas", color: "#4ade80" },
                { data: dailyRegistrations, label: "Registros", color: "#ff9999" },
                { data: dailyPoints, label: "Puntos", color: "#ffcc00" },
              ]}
              xAxis={[
                {
                  scaleType: "band",
                  data: dailyLabels,
                  tickLabelStyle: { fontSize: 12 },
                },
              ]}
            />
          </Box>
        </Card>

        {/* Tablas */}
        <Stack direction={{ xs: "column", md: "row" }} spacing={3} sx={{ width: "100%" }}>
          <Card
            sx={{
              flex: 1,
              borderTop: 3,
              borderColor: "primary.main",
              p: 3,
            }}
          >
            <ClientMetricsTable title='Visitas por Cliente' subtitle='Registro de visitas de cada cliente' data={clientVisitsData} dataType='Visitas' />
          </Card>

          <Card
            sx={{
              flex: 1,
              borderTop: 3,
              borderColor: "primary.main",
              p: 3,
            }}
          >
            <ClientMetricsTable title='Puntos por Cliente' subtitle='Puntos acumulados por cada cliente' data={clientPointsData} dataType='Canjes' />
          </Card>
        </Stack>
      </Stack>
    </div>
  );
};