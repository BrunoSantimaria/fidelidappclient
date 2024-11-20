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
  value: number;
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

// Componente para las tablas de métricas de clientes
const ClientMetricsTable = ({ title, subtitle, data, dataType }: { title: string; subtitle: string; data: ClientData[]; dataType: string }) => (
  <>
    <Typography variant='h6' gutterBottom>
      {title}
    </Typography>
    <Typography variant='body2' color='text.secondary' gutterBottom>
      {subtitle}
    </Typography>
    <Box sx={{ maxHeight: 400, overflow: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left", padding: "8px" }}>Cliente</th>
            <th style={{ textAlign: "right", padding: "8px" }}>{dataType}</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td style={{ padding: "8px" }}>{item.client}</td>
              <td style={{ textAlign: "right", padding: "8px" }}>{item.value}</td>
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
    <div className='w-[80%] ml-0 md:ml-48'>
      <Stack spacing={4} sx={{ p: 2, pt: { xs: 2, md: 6 } }}>
        <Stack
          direction='row'
          spacing={2}
          sx={{
            flexWrap: "wrap",
            gap: 2,
            justifyContent: "center",
          }}
        >
          <MetricCard title='Clientes Totales' value={data.totalClients} icon={<PeopleIcon />} />
          <MetricCard title='Puntos Acumulados' value={data.totalPoints} icon={<StarsIcon />} />
          <MetricCard title='Visitas Totales' value={data.totalVisits} icon={<VisibilityIcon />} />
          <MetricCard title='Canjes Realizados' value={data.totalRedeemCount} icon={<CardGiftcardIcon />} />
          <MetricCard title='Promociones Activas' value={data.totalPromotions} icon={<CampaignIcon />} />
        </Stack>

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

        <Stack direction={{ xs: "column", md: "row" }} spacing={3} sx={{ width: "100%" }}>
          <Card sx={{ flex: 1, borderTop: 3, borderColor: "primary.main", p: 3 }}>
            <ClientMetricsTable title='Visitas por Cliente' subtitle='Registro de visitas de cada cliente' data={data.visitDataByClient} dataType='Visitas' />
          </Card>

          <Card sx={{ flex: 1, borderTop: 3, borderColor: "primary.main", p: 3 }}>
            <ClientMetricsTable title='Puntos por Cliente' subtitle='Puntos acumulados por cada cliente' data={data.pointDataByClient} dataType='Puntos' />
          </Card>
        </Stack>
      </Stack>
    </div>
  );
};
