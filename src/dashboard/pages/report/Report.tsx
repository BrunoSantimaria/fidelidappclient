import { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts';
import { Box, Stack, Typography, CircularProgress } from '@mui/material';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TableFooter, TablePagination } from '@mui/material';
import api from '../../../utils/api';

const ClientMetricsTable = ({ title, data, dataType }) => {
  const [page, setPage] = useState(0); // Current page
  const rowsPerPage = 10; // Number of rows per page

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <TableContainer component={Paper} sx={{ my: 2 }}>
      <Typography variant="h6" align="center" gutterBottom>{title}</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Cliente</TableCell>
            <TableCell align="right">{dataType}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.client}</TableCell>
              <TableCell align="right">{item.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[10]} // Only allow 10 rows per page
              count={data.length} // Total number of rows
              rowsPerPage={rowsPerPage} // Rows per page
              page={page} // Current page
              onPageChange={handleChangePage} // Handle page change
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export const Report = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.post('/api/promotions/getDashboardMetrics');
        setData(response.data);
      } catch (error) {
        setError('Error al cargar los datos');
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!data) return null;

  const dailyLabels = Object.keys(data.dailyData);
  const dailyVisits = dailyLabels.map(date => data.dailyData[date].visits);
  const dailyRegistrations = dailyLabels.map(date => data.dailyData[date].registrations);
  const dailyRedeems = dailyLabels.map(date => data.dailyData[date].redeems);

  const clientVisitsData = data.visitDataByClient.map(client => ({ client: client.client, value: client.visits }));
  const clientRedeemsData = data.visitDataByClient.map(client => ({ client: client.client, value: client.redeems }));

  const metrics = [
    { label: 'Clientes Totales', value: data.totalClients },
    { label: 'Puntos Acumulados', value: data.totalVisits },
    { label: 'Promociones Canjeadas', value: data.promotionsRedeemed },
    { label: 'Visitas Promedio', value: data.visitFrequency },
    { label: 'Canjes Promedio', value: data.redemptionFrequency },
  ];


  return (
    <Stack
      spacing={4}
      sx={{
        padding: "1rem",
        paddingTop: { xs: 0, md: "5rem" }, // No top padding on mobile, 2rem on md+ screens
        alignItems: "center"
      }}
    >
      
      <Stack direction="flex" justifyContent="center" flexWrap="wrap">
        {metrics.map((metric, index) => (
          <Box
            key={index}
            sx={{
              backgroundColor: 'primary.main',
              width: { xs: '100%', sm: 180 }, // 100% width on mobile, 180px on larger screens
              textAlign: 'center',
              color: 'white'
            }}
          >
            <Typography variant="body1">{metric.label}</Typography>
            <Typography variant="h6">{metric.value}</Typography>
          </Box>
        ))}
      </Stack>


      <Typography variant="h5" align="center" gutterBottom>Tus clientes en los últimos 7 días:</Typography>
      <Box sx={{ mt: 4, 
        width: { xs: '100%', sm: '82%' }, // 100% width on mobile, 180px on larger screens
       }}>

        <LineChart
          height={400}
          series={[
            { label: 'Visitas', data: dailyVisits, color:"lightgreen" },
            { label: 'Registros', data: dailyRegistrations, color:"pink" },
            { label: 'Canjes', data: dailyRedeems, color:"gold" },
          ]}
          xAxis={[{ 
            scaleType: 'band', 
            data: dailyLabels 

          }]}
        />
      </Box>
      <Box sx={{ mt: 4, width: "100%" }}>
        <Stack direction="flex" justifyContent="center" spacing={4} flexWrap="wrap">
          <Box sx={{ width: { xs: "100%", sm: "45%", md: "40%" }, p: 2 }}>
            <ClientMetricsTable title="Visitas por Cliente" data={clientVisitsData} dataType="Visitas" />
          </Box>
          <Box sx={{ width: { xs: "100%", sm: "45%", md: "40%" }, p: 2 }}>
            <ClientMetricsTable title="Canjes por Cliente" data={clientRedeemsData} dataType="Canjes" />
          </Box>
        </Stack>
      </Box>

    </Stack>
  );
};
