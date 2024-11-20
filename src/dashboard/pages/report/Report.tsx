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

// Componente para las métricas superiores
const MetricCard = ({ title, value, icon }) => (
  <Card
    sx={{
      p: 2,
      minWidth: { xs: "100%", sm: 180 },
      bgcolor: "white",
      color: "primary.main",
      borderTop: 3,
      borderColor: "primary.main",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: 1,
    }}
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {icon}
      <Typography variant='body2'>{title}</Typography>
    </Box>
    <Typography variant='h5' fontWeight='bold'>
      {value}
    </Typography>
  </Card>
);

const ClientMetricsTable = ({ title, subtitle, data, dataType }) => {
  const [page, setPage] = useState(0);
  const rowsPerPage = 10;

  return (
    <>
      <Typography variant='h6' gutterBottom>
        {title}
      </Typography>
      <Typography variant='body2' color='text.secondary' gutterBottom>
        {subtitle}
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Cliente</TableCell>
            <TableCell align='right'>{dataType}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.client}</TableCell>
              <TableCell align='right'>{item.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[10]}
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </>
  );
};

// Componente de Loading
const LoadingReport = ({ progress }) => (
  <Card
    sx={{
      maxWidth: 600,
      mx: "auto",
      mt: 4,
      p: 3,
      borderTop: 3,
      borderColor: "primary.main",
    }}
  >
    <Stack spacing={3}>
      {/* Título */}
      <Stack direction='row' spacing={1} alignItems='center'>
        <FileTextIcon />
        <Typography variant='h6' color='primary'>
          Generando tu Reporte
        </Typography>
      </Stack>

      <Typography variant='body2' color='text.secondary'>
        Estamos procesando tus datos para crear un informe detallado. Esto puede tomar unos momentos.
      </Typography>

      {/* Progreso */}
      <Stack spacing={2} alignItems='center'>
        <CircularProgress />
        <LinearProgress sx={{ width: "100%" }} variant='determinate' value={progress} />
        <Typography variant='body2' color='text.secondary'>
          Progreso: {progress}%
        </Typography>
      </Stack>

      {/* Tips */}
      <Box
        sx={{
          bgcolor: "white",
          color: "primary.main",
          p: 2,
          borderRadius: 1,
        }}
      >
        <Stack direction='row' spacing={1} alignItems='center' mb={1}>
          <InfoIcon fontSize='small' />
          <Typography variant='subtitle2'>Mientras esperas</Typography>
        </Stack>
        <Typography variant='body2' mb={1}>
          Aquí tienes algunos consejos sobre el uso de informes:
        </Typography>
        <ul style={{ paddingLeft: "1.5rem", fontSize: "0.875rem" }}>
          <li>- Los informes detallados pueden ayudarte a identificar tendencias en el comportamiento de tus clientes.</li>
          <li>- Utiliza los datos de los informes para personalizar tus promociones y aumentar la fidelización.</li>
          <li>- Compara los informes mes a mes para medir el crecimiento de tu programa de fidelización.</li>
          <li>- Los datos de canjes pueden indicarte qué recompensas son más populares entre tus clientes.</li>
        </ul>
      </Box>

      {/* Botones */}
    </Stack>
  </Card>
);

export const Report = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let progressTimer;
    const fetchData = async () => {
      try {
        // Iniciar el timer de progreso
        progressTimer = setInterval(() => {
          setProgress((prev) => (prev >= 90 ? 90 : prev + 10));
        }, 500);

        const response = await api.post("/api/promotions/getDashboardMetrics");
        setData(response.data);
        setProgress(100); // Completar el progreso
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

  // Extract the labels (dates) from dailyData
  const dailyLabels = data.dailyData.map((entry) => entry.date);

  // Extract values for visits, registrations, and points
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
