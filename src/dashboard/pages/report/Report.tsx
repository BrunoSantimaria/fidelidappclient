import { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts";
import { Box, Stack, Typography, Card, CircularProgress } from "@mui/material";
import {
  People as PeopleIcon,
  Stars as StarsIcon,
  Visibility as VisibilityIcon,
  CardGiftcard as CardGiftcardIcon,
  Campaign as CampaignIcon,
} from "@mui/icons-material";
import LinearProgress from "@mui/material/LinearProgress";
import api from "../../../utils/api";

// Interfaces
interface DailyData {
  date: string;
  visits: number;
  registrations: number;
  points: number;
}

interface ClientData {
  client: string;
  visits: number;
  points: number;
  redeemCount: number;
}

interface ReportData {
  totalClients: number;
  totalPoints: number;
  totalVisits: number;
  totalRedeemCount: number;
  totalPromotions: number;
  dailyData: DailyData[];
  visitDataByClient: ClientData[];
  pointDataByClient: ClientData[];
  registeredClients: number;
}

// Componente para mostrar durante la carga
const LoadingReport = ({ progress }: { progress: number }) => (
  <Box sx={{ width: "80%", ml: { xs: 0, md: "12rem" }, p: 4 }}>
    <Stack spacing={2} alignItems='center'>
      <CircularProgress />
      <Typography>Cargando datos del reporte...</Typography>
      <LinearProgress variant='determinate' value={progress} sx={{ width: "100%" }} />
    </Stack>
  </Box>
);

// Componente para las métricas
const MetricCard = ({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) => (
  <Card sx={{ p: 2, minWidth: 200, display: "flex", alignItems: "center", gap: 2 }}>
    {icon}
    <Box>
      <Typography variant='h6'>{value}</Typography>
      <Typography variant='body2' color='text.secondary'>
        {title}
      </Typography>
    </Box>
  </Card>
);

// Componente actualizado para las tablas de métricas
const ClientMetricsTable = ({ title, subtitle, data, dataType }: { title: string; subtitle: string; data: ClientData[]; dataType: "visits" | "points" }) => (
  <>
    <Typography variant='h6' gutterBottom>
      {title}
    </Typography>
    <Typography variant='body2' color='text.secondary' gutterBottom>
      {subtitle}
    </Typography>
    <Box sx={{ maxHeight: { xs: 300, md: 400 }, overflow: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "8px", position: "sticky", top: 0, background: "white" }}>Cliente</th>
            <th style={{ textAlign: "right", padding: "8px", position: "sticky", top: 0, background: "white" }}>
              {dataType === "visits" ? "Visitas" : "Puntos"}
            </th>
            <th style={{ textAlign: "right", padding: "8px", position: "sticky", top: 0, background: "white" }}>Canjes</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td style={{ padding: "8px" }}>{item.client}</td>
              <td style={{ textAlign: "right", padding: "8px" }}>{dataType === "visits" ? item.visits : item.points}</td>
              <td style={{ textAlign: "right", padding: "8px" }}>{item.redeemCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  </>
);

export const Report = () => {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let progressTimer: NodeJS.Timeout;

    const fetchData = async () => {
      try {
        progressTimer = setInterval(() => {
          setProgress((prev) => Math.min(prev + 10, 90));
        }, 500);

        const response = await api.post(
          "/api/promotions/getDashboardMetrics",
          {},
          {
            signal: controller.signal,
          }
        );
        console.log(response.data);
        setData(response.data);
        setProgress(100);
      } catch (error) {
        if (!controller.signal.aborted) {
          setError("Error al cargar los datos");
          console.error("Error:", error);
        }
      } finally {
        clearInterval(progressTimer);
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      controller.abort();
      if (progressTimer) clearInterval(progressTimer);
    };
  }, []);

  if (loading) return <LoadingReport progress={progress} />;
  if (error) return <Typography color='error'>{error}</Typography>;
  if (!data) return null;

  const dailyLabels = data.dailyData.map((entry) => entry.date);
  const dailyVisits = data.dailyData.map((entry) => entry.visits);
  const dailyRegistrations = data.dailyData.map((entry) => entry.registrations);
  const dailyPoints = data.dailyData.map((entry) => entry.points);

  return (
    <Box className='w-full px-4 md:w-[80%] md:ml-48'>
      <Stack spacing={4} sx={{ py: { xs: 2, md: 6 } }}>
        <Stack
          direction='row'
          spacing={2}
          sx={{
            flexWrap: "wrap",
            gap: 2,
            justifyContent: { xs: "space-around", md: "center" },
          }}
        >
          <MetricCard title='Clientes Registrados' value={data.registeredClients} icon={<PeopleIcon />} />
          <MetricCard title='Puntos Acumulados' value={data.totalPoints} icon={<StarsIcon />} />
          <MetricCard title='Visitas Totales' value={data.totalVisits} icon={<VisibilityIcon />} />
          <MetricCard title='Canjes Realizados' value={data.totalRedeemCount} icon={<CardGiftcardIcon />} />
          <MetricCard title='Promociones Activas' value={data.totalPromotions} icon={<CampaignIcon />} />
        </Stack>

        <Card sx={{ p: { xs: 2, md: 3 }, borderTop: 3, borderColor: "primary.main" }}>
          <Typography variant='h6' gutterBottom>
            Tus clientes en los últimos 7 días
          </Typography>
          <Typography variant='body2' color='text.secondary' gutterBottom>
            Análisis de visitas, registros y puntos acumulados
          </Typography>
          <Box sx={{ height: { xs: 300, md: 400 }, mt: 2 }}>
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
              margin={{ left: 50, right: 20, top: 20, bottom: 30 }}
            />
          </Box>
        </Card>

        <Stack direction={{ xs: "column", md: "row" }} spacing={3} sx={{ width: "100%" }}>
          <Card sx={{ flex: 1, borderTop: 3, borderColor: "primary.main", p: { xs: 2, md: 3 } }}>
            <ClientMetricsTable
              title='Visitas por Cliente'
              subtitle='Registro de visitas y canjes de cada cliente'
              data={data.visitDataByClient}
              dataType='visits'
            />
          </Card>

          <Card sx={{ flex: 1, borderTop: 3, borderColor: "primary.main", p: { xs: 2, md: 3 } }}>
            <ClientMetricsTable
              title='Puntos por Cliente'
              subtitle='Puntos acumulados y canjes por cada cliente'
              data={data.pointDataByClient}
              dataType='points'
            />
          </Card>
        </Stack>
      </Stack>
    </Box>
  );
};
