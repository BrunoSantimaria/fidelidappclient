import { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts";
import { Box, Stack, Typography, Card, CircularProgress } from "@mui/material";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';
import Grid from '@mui/material/Grid2';
import {
  People as PeopleIcon,
  Stars as StarsIcon,
  Visibility as VisibilityIcon,
  CardGiftcard as CardGiftcardIcon,
  Campaign as CampaignIcon,
  Star as StarIcon,
  Group as GroupIcon,
} from "@mui/icons-material";
import LinearProgress from "@mui/material/LinearProgress";
import api from "../../../utils/api";

// Interfaces
interface DailyData {
  date: string;
  visits: number;
  registrations: number;
  points: number;
  emailSent: number;
  emailOpened: number;
  emailClicked: number;
}

interface ClientData {
  client: string;
  visits: number;
  points: number;
  redeemCount: number;
}

interface campaignsData {
  id: string;
  name: string;
  status: string;
  totalSent: number;
  totalOpens: number;
  totalClicks: number;
}

interface contactMetrics {
  totalWithEmail: number;
  totalWithPhone: number;
  totalClients: number;
}

interface ReportData {
  findex: number;
  contactMetrics: contactMetrics;
  accountClients: number;
  totalClients: number;
  totalCampaigns: number;
  totalPoints: number;
  totalVisits: number;
  totalRedeemCount: number;
  totalPromotions: number;
  totalEmailsSent: number;
  totalEmailOpens: number;
  totalEmailClicks: number;
  campaigns: campaignsData[];
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
  <Card sx={{ p: 2, minWidth: 250, maxWidth: 250, maxHeight: 100, display: "flex", alignItems: "center", gap: 2 }}>
    {icon}
    <Box>
      <Typography variant='h6'>{value}{title === "Índice Fidelidad" ? "%" : ""}</Typography>
      <Typography variant='body2' color='text.secondary'>
        {title}
      </Typography>
    </Box>
  </Card>
);

const FIndexCard = ({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) => (
  <Card sx={{ p: 2, minWidth: 250, maxWidth: 250, minHeight: 275, display: "flex", alignItems: "center", gap: 3, backgroundColor: "primary.main", color: "white" }}>
    {/* Change icon color dependent on value */}
    {value >= 80 && <StarsIcon sx={{ fontSize: 40, color: "#4ade80" }} />}
    {value >= 50 && value < 80 && <StarsIcon sx={{ fontSize: 40, color: "#ffcc00" }} />}
    {value < 50 && <StarsIcon sx={{ fontSize: 40, color: "#ff9999" }} />}
    <Box>
      <Typography variant='h6'>{value} %</Typography>
      <Typography variant='body2' color='white'>
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
            <th style={{ textAlign: "center", padding: "8px", position: "sticky", top: 0, background: "white" }}>
              {dataType === "visits" ? "Visitas" : "Puntos"}
            </th>
            <th style={{ textAlign: "center", padding: "8px", position: "sticky", top: 0, background: "white" }}>Canjes</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td style={{ padding: "8px" }}>{item.client}</td>
              <td style={{ textAlign: "center", padding: "8px" }}>{dataType === "visits" ? item.visits : item.points}</td>
              <td style={{ textAlign: "center", padding: "8px" }}>{item.redeemCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  </>
);


const CampaingMetricsTable = ({ title, subtitle, data, dataType }: { title: string; subtitle: string; data: campaignsData[]; dataType: "campaings" }) => (
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
            <th style={{ textAlign: "left", padding: "8px", position: "sticky", top: 0, background: "white" }}>Nombre</th>
            <th style={{ textAlign: "center", padding: "8px", position: "sticky", top: 0, background: "white" }}>Estado</th>
            <th style={{ textAlign: "center", padding: "8px", position: "sticky", top: 0, background: "white" }}>Enviados</th>
            <th style={{ textAlign: "center", padding: "8px", position: "sticky", top: 0, background: "white" }}>Abiertos</th>
            <th style={{ textAlign: "center", padding: "8px", position: "sticky", top: 0, background: "white" }}>Clickeados</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td style={{ padding: "8px" }}>{item.name}</td>
              <td style={{ textAlign: "center", padding: "8px" }}>{item.status}</td>
              <td style={{ textAlign: "center", padding: "8px" }}>{item.totalSent}</td>
              <td style={{ textAlign: "center", padding: "8px" }}>{item.totalOpens}</td>
              <td style={{ textAlign: "center", padding: "8px" }}>{item.totalClicks}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  </>
);

// const ContactPieChart = ({ metrics }: { metrics: contactMetrics }) => {
//   console.log('metrics:', metrics);

//   // Prepare data for the pie chart
//   const data = [
//     { name: 'With Email', value: metrics[0].totalWithEmail },
//     { name: 'With Phone', value: metrics[0].totalWithPhone },
//   ];

//   const COLORS = ['#8884d8', '#82ca9d', '#ff8c00']; // Colors for the segments

//   return (
//     <ResponsiveContainer width="100%" height={250}>
//       <PieChart>
//         <Pie
//           data={data}
//           dataKey="value"
//           nameKey="name"
//           cx="50%"
//           cy="50%"
//           outerRadius={80}
//           label
//         >
//           {data.map((entry, index) => (
//             <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//           ))}
//         </Pie>
//         <Tooltip />
//         <Legend />
//       </PieChart>
//     </ResponsiveContainer>
//   );
// };


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
        }, 50);

        const response = await api.post(
          "/api/promotions/getDashboardMetrics",
          {},
          {
            signal: controller.signal,
          }
        );
        //console.log(response.data);
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
  const dailyEmailsSent = data.dailyData.map((entry) => entry.emailSent);
  const dailyEmailOpens = data.dailyData.map((entry) => entry.emailOpened);
  const dailyEmailClicks = data.dailyData.map((entry) => entry.emailClicked);

  // Verifica si los datos están vacíos
  if (dailyLabels.length === 0 || dailyVisits.length === 0 || dailyRegistrations.length === 0 || dailyPoints.length === 0) {
    return <Typography color='error'>No hay datos disponibles para mostrar en el gráfico.</Typography>;
  }


  return (
    <Box className='w-full px-4 md:w-[90%] md:ml-32'>
      <Stack spacing={4} sx={{ py: { xs: 2, md: 6 } }}>
        <Typography variant='h6' gutterBottom>
          Así ha evolucinado la fideldidad de tus clientes {data.Name ? "en " + data.Name : ""}
        </Typography>

        <Grid
          container
          spacing={2}
          sx={{ justifyContent: { xs: 'space-around', md: 'space-around' } }}
        >

          <Grid xs={3} md={3} rowSpacing={2}>
            <FIndexCard
              title='Índice Fidelidad'
              value={data.findex}
              icon={<StarIcon />}
            />
          </Grid>

          <Grid xs={12} md={6} container direction="column" spacing={2}>
            <Grid>
              <MetricCard
                title='Total Clientes'
                value={data.accountClients}
                icon={<GroupIcon />}
              />
            </Grid>

            <Grid>
              <MetricCard
                title='Clientes en Promociones'
                value={data.totalClients}
                icon={<PeopleIcon />}
              />
            </Grid>

            <Grid>
              <MetricCard
                title='Promociones Activas'
                value={data.totalPromotions}
                icon={<CampaignIcon />}
              />
            </Grid>
          </Grid>

          <Grid xs={12} md={2} container direction="column" spacing={2}>
            <Grid>
              <MetricCard
                title='Puntos Acumulados'
                value={data.totalPoints}
                icon={<StarsIcon />}
              />
            </Grid>
            <Grid>
              <MetricCard
                title='Visitas Totales'
                value={data.totalVisits}
                icon={<VisibilityIcon />}
              />
            </Grid>
            <Grid>
              <MetricCard
                title='Canjes Realizados'
                value={data.totalRedeemCount}
                icon={<CardGiftcardIcon />}
              />
            </Grid>
          </Grid>



        </Grid>

        {/* <Card sx={{ p: { xs: 2, md: 3 }, borderTop: 3, borderColor: "primary.main" }}>
          <ContactPieChart metrics={data.contactMetrics} />
        </Card> */}


        <Card sx={{ p: { xs: 2, md: 3 }, borderTop: 3, borderColor: "primary.main" }}>
          <Typography variant='h6' gutterBottom>
            Tus clientes
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



        <Typography variant='h6' gutterBottom>
          Tus campañas de email
        </Typography>

        <Grid
          container
          spacing={2}
          sx={{ justifyContent: { xs: 'space-around', md: 'space-around' } }}
        >
          <Grid>
            <MetricCard title='Campañas Email' value={data.totalCampaigns} icon={<CampaignIcon />} />
          </Grid>
          <Grid>
            <MetricCard title='Emails Enviados' value={data.totalEmailsSent} icon={<PeopleIcon />} />
          </Grid>
          <Grid>
            <MetricCard title='Emails Abiertos' value={data.totalEmailOpens} icon={<StarsIcon />} />
          </Grid>
          <Grid>
            <MetricCard title='Clicks en Emails' value={data.totalEmailClicks} icon={<VisibilityIcon />} />

          </Grid>
        </Grid>

        <Card sx={{ flex: 1, borderTop: 3, borderColor: "primary.main", p: { xs: 2, md: 3 } }}>
          <CampaingMetricsTable
            title='Campañas de Email Marketing'
            subtitle='Emails enviados, abiertos y clieckeados'
            data={data.campaigns}
            dataType='campaings'
          />
        </Card>

        <Card sx={{ p: { xs: 2, md: 3 }, borderTop: 3, borderColor: "primary.main" }}>
          <Typography variant='h6' gutterBottom>
            Tus campañas de email
          </Typography>
          <Typography variant='body2' color='text.secondary' gutterBottom>
            Análisis de emails enviados, abiertos y clieckeados
          </Typography>
          <Box sx={{ height: { xs: 300, md: 400 }, mt: 2 }}>
            <LineChart
              series={[
                { data: dailyEmailsSent, label: "Enviados", color: "#4ade80" },
                { data: dailyEmailOpens, label: "Abiertos", color: "#ff9999" },
                { data: dailyEmailClicks, label: "Clicks", color: "#ffcc00" },
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
