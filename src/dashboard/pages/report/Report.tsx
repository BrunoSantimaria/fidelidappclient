import { useEffect, useState } from "react";
import { LineChart } from "@mui/x-charts";
import { Box, Stack, Typography, Card, CircularProgress } from "@mui/material";
import { PieChart, Pie, Cell, Legend as RechartsLegend, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import Grid from "@mui/material/Grid2";
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
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip as ChartTooltip, Legend as ChartLegend } from "chart.js";
import ReactApexChart from "react-apexcharts";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, ChartTooltip, ChartLegend);

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
  date: string;
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

// Componente MetricCard actualizado
const MetricCard = ({
  title,
  value,
  icon,
  trend = null,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend?: { value: number; isPositive: boolean } | null;
}) => (
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
      {/*   {trend && (
        <span className={`text-sm font-medium ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
          {trend.isPositive ? "↑" : "↓"} {trend.value}%
        </span>
      )} */}
    </div>
    <h3 className={`mt-4 text-3xl font-bold ${title === "Índice Fidelidad" ? "text-white" : "text-gray-800"}`}>
      {value.toLocaleString()}
      {title === "Índice Fidelidad" && "%"}
    </h3>
    <p className={`mt-1 text-sm ${title === "Índice Fidelidad" ? "text-white" : "text-gray-500"}`}>{title}</p>
  </motion.div>
);

// LoadingReport con skeleton loader
const LoadingReport = ({ progress }: { progress: number }) => (
  <div className='w-full md:w-[80%] md:ml-48 p-4'>
    <div className='space-y-4'>
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className='h-24 bg-gray-200 rounded-xl'
        />
      ))}
    </div>
  </div>
);

// Ejemplo de gráfico de línea mejorado
const EnhancedLineChart = ({ labels, datasets }: { labels: string[]; datasets: any[] }) => {
  const options = {
    responsive: true,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const data = {
    labels,
    datasets: datasets.map((dataset) => ({
      ...dataset,
      tension: 0.4,
      borderWidth: 2,
      pointRadius: 3,
      pointHoverRadius: 6,
    })),
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='w-full h-[400px]'>
      <Line options={options} data={data} />
    </motion.div>
  );
};

const FIndexCard = ({ title, value, icon }: { title: string; value: number; icon: React.ReactNode }) => (
  <Card
    sx={{ p: 2, minWidth: 250, maxWidth: 250, minHeight: 275, display: "flex", alignItems: "center", gap: 3, backgroundColor: "primary.main", color: "white" }}
  >
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
  <motion.div className='bg-white p-6 rounded-2xl shadow-md shadow-black/20 hover:shadow-lg transition-all duration-300'>
    <Typography variant='h6' gutterBottom>
      {title}
    </Typography>
    <Typography variant='body2' color='text.secondary' gutterBottom>
      {subtitle}
    </Typography>
    <div className='overflow-x-auto max-h-[400px]'>
      <table className='w-full'>
        <thead>
          <tr className='bg-gray-50'>
            <th className='sticky top-0 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Cliente</th>
            <th className='sticky top-0 bg-gray-50 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>
              {dataType === "visits" ? "Visitas" : "Puntos"}
            </th>
            <th className='sticky top-0 bg-gray-50 px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>Canjes</th>
          </tr>
        </thead>
        <tbody className='bg-white divide-y divide-gray-200'>
          {data.map((item, index) => (
            <motion.tr
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className='hover:bg-gray-50'
            >
              <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>{item.client}</td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500'>{dataType === "visits" ? item.visits : item.points}</td>
              <td className='px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500'>{item.redeemCount}</td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  </motion.div>
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

const LineChart = ({ data, categories }: { data: any[]; categories: string[] }) => {
  const options = {
    chart: {
      type: "area" as const,
      toolbar: {
        show: false,
      },
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 800,
      },
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.7,
        opacityTo: 0.2,
        stops: [0, 90, 100],
      },
    },
    dataLabels: {
      enabled: false,
    },
    grid: {
      borderColor: "#f1f1f1",
      strokeDashArray: 4,
    },
    xaxis: {
      categories,
      labels: {
        style: {
          colors: "#9ca3af",
          fontSize: "12px",
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          colors: "#9ca3af",
          fontSize: "12px",
        },
      },
    },
    tooltip: {
      theme: "dark",
      x: {
        show: false,
      },
    },
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className='w-full h-full'>
      <ReactApexChart options={options} series={data} type='area' height={350} />
    </motion.div>
  );
};

const EmailCampaignsTable = ({ data }: { data: campaignsData[] }) => (
  <div className='overflow-x-auto'>
    <table className='w-full'>
      <thead>
        <tr className='bg-gray-50'>
          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Campaña</th>
          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Fecha</th>
          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Estado</th>
          <th className='px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider'>Métricas</th>
        </tr>
      </thead>
      <tbody className='bg-white divide-y divide-gray-200'>
        {data.map((campaign, index) => (
          <motion.tr
            key={campaign.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className='hover:bg-gray-50'
          >
            <td className='px-6 py-4'>
              <div className='text-sm font-medium text-gray-900'>{campaign.name}</div>
            </td>
            <td className='px-6 py-4'>
              <div className='text-sm font-medium text-gray-900'>{new Date(campaign.date).toLocaleDateString()}</div>
            </td>
            <td className='px-6 py-4'>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  campaign.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : campaign.status === "failed"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {campaign.status === "completed" ? "Completado" : campaign.status === "failed" ? "Fallido" : "Pendiente"}
              </span>
            </td>

            <td className='px-6 py-4'>
              <div className='flex justify-center space-x-4'>
                <div className='text-center'>
                  <div className='text-sm font-medium text-gray-900'>{campaign.totalSent}</div>
                  <div className='text-xs text-gray-500'>Enviados</div>
                </div>
                <div className='text-center'>
                  <div className='text-sm font-medium text-gray-900'>{campaign.totalOpens}</div>
                  <div className='text-xs text-gray-500'>Abiertos</div>
                </div>
                <div className='text-center'>
                  <div className='text-sm font-medium text-gray-900'>{campaign.totalClicks}</div>
                  <div className='text-xs text-gray-500'>Clicks</div>
                </div>
              </div>
            </td>
          </motion.tr>
        ))}
      </tbody>
    </table>
  </div>
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
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='min-h-screen bg-gray-50 p-6'>
      <div className='max-w-7xl mx-auto space-y-6'>
        {/* Header Section */}
        <div className='flex flex-col md:flex-row justify-between items-start md:items-center'>
          <h1 className='text-2xl font-bold text-gray-800'>Dashboard de Fidelización</h1>
          <div className='mt-4 md:mt-0'>
            <span className='text-sm text-gray-500'>Última actualización: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Métricas Principales */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          <MetricCard title='Índice Fidelidad' value={data.findex} icon={<StarIcon className='text-primary-600' />} trend={{ value: 12, isPositive: true }} />
          <MetricCard
            title='Total Clientes'
            value={data.totalClients}
            icon={<PeopleIcon className='text-primary-600' />}
            trend={{ value: 8, isPositive: true }}
          />
          <MetricCard title='Puntos Acumulados' value={data.totalPoints} icon={<StarsIcon className='text-primary-600' />} />
          <MetricCard title='Canjes Realizados' value={data.totalRedeemCount} icon={<CardGiftcardIcon className='text-primary-600' />} />
        </div>

        {/* Gráficos */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <motion.div whileHover={{ scale: 1.01 }} className='bg-white p-6 rounded-2xl shadow-md shadow-black/20 hover:shadow-lg transition-all duration-300'>
            <h2 className='text-lg font-semibold mb-4'>Actividad de Clientes</h2>
            <LineChart
              categories={dailyLabels}
              data={[
                {
                  name: "Visitas",
                  data: dailyVisits,
                },
                {
                  name: "Registros",
                  data: dailyRegistrations,
                },
              ]}
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.01 }} className='bg-white p-6 rounded-2xl shadow-md shadow-black/20 hover:shadow-lg transition-all duration-300'>
            <h2 className='text-lg font-semibold mb-4'>Métricas de Email</h2>
            <LineChart
              categories={dailyLabels}
              data={[
                {
                  name: "Enviados",
                  data: dailyEmailsSent,
                },
                {
                  name: "Abiertos",
                  data: dailyEmailOpens,
                },
              ]}
            />
          </motion.div>
        </div>

        {/* Tablas de Métricas de Clientes */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
          <ClientMetricsTable
            title='Top Clientes por Visitas'
            subtitle='Listado de clientes ordenados por número de visitas'
            data={data.visitDataByClient}
            dataType='visits'
          />
          <ClientMetricsTable
            title='Top Clientes por Puntos'
            subtitle='Listado de clientes ordenados por puntos acumulados'
            data={data.pointDataByClient}
            dataType='points'
          />
        </div>

        {/* Tabla de Campañas con scroll */}
        <motion.div className='bg-white p-6 rounded-2xl shadow-md shadow-black/20 hover:shadow-lg transition-all duration-300'>
          <h2 className='text-lg font-semibold mb-4'>Campañas de Email Marketing</h2>
          <div className='overflow-x-auto max-h-[400px]'>
            <EmailCampaignsTable data={data.campaigns.reverse()} />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
