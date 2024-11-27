"use client";

import { useState, useEffect } from "react";
import { Box, Card, CardContent, Typography, Button, Chip, Collapse, Divider, Tab, Tabs, Pagination, LinearProgress, CircularProgress } from "@mui/material";
import { Email, CalendarToday, ExpandMore, Send as SendIcon, OpenInBrowser, Mouse, ErrorOutline } from "@mui/icons-material";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement } from "chart.js";
import api from "../../../utils/api";
import { useDashboard } from "../../../hooks";
import { useNavigateTo } from "../../../hooks/useNavigateTo";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement);

interface Metrics {
  blocked: number;
  bounces: number;
  clicks: number;
  deferred: number;
  delivered: number;
  opens: number;
  processed: number;
  spam: number;
  totalSent: number;
  unsubscribes: number;
}

interface ActiveCampaign {
  id: string;
  name: string;
  status: string;
  metrics: Metrics;
  startDate: string;
  template: string;
  recipientsCount: number;
}

interface ScheduledCampaign {
  id: string;
  name: string;
  status: string;
  scheduledFor: string;
  createdAt: string;
  template: string;
  recipientsCount: number;
}

type Campaign = ActiveCampaign | ScheduledCampaign;

interface CampaignsData {
  active: Campaign[];
  scheduled: Campaign[];
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusChip = (status: string) => {
  switch (status) {
    case "completed":
      return <Chip label='Completada' color='primary' />;
    case "pending":
      return <Chip label='Programada' variant='outlined' />;
    case "in_progress":
      return <Chip label='En progreso' color='secondary' />;
    default:
      return <Chip label='En proceso' color='secondary' />;
  }
};

const getDisplayDate = (campaign: Campaign) => {
  if ("startDate" in campaign) {
    return formatDate(campaign.startDate);
  } else {
    return formatDate(campaign.scheduledFor);
  }
};

const renderMetricsSummary = (campaign: ActiveCampaign) => {
  const totalSent = campaign.metrics.totalSent || 0;
  const metrics = [
    {
      icon: <SendIcon sx={{ fontSize: 20 }} className='text-[#5b7898]' />,
      label: "Enviados",
      value: totalSent,
      percentage: 100,
    },
    {
      icon: <OpenInBrowser sx={{ fontSize: 20 }} className='text-[#4CAF50]' />,
      label: "Abiertos",
      value: campaign.metrics.opens || 0,
      percentage: totalSent ? Math.round(((campaign.metrics.opens || 0) / totalSent) * 100) : 0,
    },
    {
      icon: <Mouse sx={{ fontSize: 20 }} className='text-[#FFC107]' />,
      label: "Clicks",
      value: campaign.metrics.clicks || 0,
      percentage: campaign.metrics.opens ? Math.round(((campaign.metrics.clicks || 0) / campaign.metrics.opens) * 100) : 0,
    },
    {
      icon: <ErrorOutline sx={{ fontSize: 20 }} className='text-[#F44336]' />,
      label: "Rebotados",
      value: campaign.metrics.bounces || 0,
      percentage: totalSent ? Math.round(((campaign.metrics.bounces || 0) / totalSent) * 100) : 0,
    },
  ];

  return (
    <Box className='space-y-4 '>
      {metrics.map((metric, index) => (
        <Box key={index} className='flex items-center gap-3'>
          {metric.icon}
          <Box className='flex-grow'>
            <Box className='flex justify-between items-center mb-1'>
              <Typography variant='body2' color='text.secondary'>
                {metric.label}
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {metric.value} ({metric.percentage}%)
              </Typography>
            </Box>
            <LinearProgress
              variant='determinate'
              value={metric.percentage}
              sx={{
                height: 6,
                borderRadius: 3,
                backgroundColor: "rgba(0,0,0,0.05)",
                "& .MuiLinearProgress-bar": {
                  borderRadius: 3,
                },
              }}
            />
          </Box>
        </Box>
      ))}
    </Box>
  );
};

const renderMetricsChart = (campaign: ActiveCampaign) => {
  const chartData = {
    labels: ["Enviados", "Abiertos", "Clicks", "Rebotados"],
    datasets: [
      {
        label: "Cantidad",
        data: [campaign.metrics.totalSent || 0, campaign.metrics.opens || 0, campaign.metrics.clicks || 0, campaign.metrics.bounces || 0],
        backgroundColor: [
          "#5b7898", // Enviados - azul principal
          "#4CAF50", // Abiertos - verde
          "#FFC107", // Clicks - amarillo
          "#F44336", // Rebotados - rojo
        ],
        borderRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const value = context.raw;
            const total = campaign.metrics.totalSent;
            const percentage = ((value / total) * 100).toFixed(1);
            return `${value} (${percentage}%)`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0,0,0,0.05)",
        },
        suggestedMin: 0,
        suggestedMax: Math.max(campaign.metrics.totalSent * 0.4, campaign.metrics.clicks * 3),
        ticks: {
          stepSize: Math.ceil(campaign.metrics.totalSent / 10),
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <Box className='h-[300px]'>
      <Bar data={chartData} options={options} />
    </Box>
  );
};

// Agregar esta función auxiliar después de las otras funciones auxiliares

export const EmailCampaign = () => {
  const [openCampaign, setOpenCampaign] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [campaignsData, setCampaignsData] = useState<CampaignsData>({ active: [], scheduled: [] });
  const { accounts } = useDashboard();
  const [activePage, setActivePage] = useState(1);
  const campaignsPerPage = 4;
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);

  const fetchCampaigns = async (isInitial = false) => {
    try {
      if (isInitial) setInitialLoading(true);
      const response = await api.get("/api/campaigns/all", {
        params: {
          accountId: accounts._id,
        },
      });

      const sortedActiveCampaigns = response.data.active.sort((a: ActiveCampaign, b: ActiveCampaign) => {
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      });

      const sortedScheduledCampaigns = response.data.scheduled.sort((a: ScheduledCampaign, b: ScheduledCampaign) => {
        return new Date(b.scheduledFor).getTime() - new Date(a.scheduledFor).getTime();
      });

      setCampaignsData({
        active: sortedActiveCampaigns,
        scheduled: sortedScheduledCampaigns,
      });
    } catch (error) {
      console.error("Error al actualizar campañas:", error);
    } finally {
      if (isInitial) setInitialLoading(false);
    }
  };

  useEffect(() => {
    if (accounts._id) {
      fetchCampaigns(true);
      const interval = setInterval(() => fetchCampaigns(false), 20000);

      return () => clearInterval(interval);
    }
  }, [accounts]);

  const renderCampaignSections = () => {
    if (initialLoading) {
      return (
        <Box className='flex justify-center items-center py-20'>
          <CircularProgress className='text-[#5b7898]' />
        </Box>
      );
    }

    if (campaignsData.active.length === 0 && campaignsData.scheduled.length === 0) {
      return (
        <Box className='flex flex-col items-center justify-center py-20 space-y-4'>
          <Email sx={{ fontSize: 60 }} className='text-[#5b7898] opacity-50' />
          <Typography variant='h6' className='text-center text-gray-600'>
            No hay campañas activas ni programadas
          </Typography>
          <Typography variant='body1' color='text.secondary' className='text-center'>
            Comienza creando tu primera campaña de email marketing
          </Typography>
          <Button variant='contained' startIcon={<SendIcon />} className='bg-[#5b7898] hover:bg-[#4a6277] mt-4'>
            Crear Primera Campaña
          </Button>
        </Box>
      );
    }

    const startIndex = (activePage - 1) * campaignsPerPage;
    const paginatedActiveCampaigns = campaignsData.active.slice(startIndex, startIndex + campaignsPerPage);

    return (
      <Box className='space-y-12'>
        <Box className='space-y-6'>
          <Typography variant='h6' className='font-semibold text-[#5b7898]'>
            Campañas Activas
          </Typography>
          {paginatedActiveCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} isActive={true} />
          ))}
          {campaignsData.active.length > campaignsPerPage && (
            <Box className='flex justify-center mt-8'>
              <Pagination
                count={Math.ceil(campaignsData.active.length / campaignsPerPage)}
                page={activePage}
                onChange={(_, page) => setActivePage(page)}
                size='large'
              />
            </Box>
          )}
        </Box>

        {campaignsData.scheduled.length > 0 && (
          <Box className='space-y-6'>
            <Typography variant='h6' className='font-semibold text-[#5b7898]'>
              Campañas Programadas
            </Typography>
            {campaignsData.scheduled.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} isActive={false} />
            ))}
          </Box>
        )}
      </Box>
    );
  };
  const { handleNavigate } = useNavigateTo();
  return (
    <Box className='mx-auto p-4 md:p-8 space-y-8 w-full md:w-[90%]'>
      <Card className='border-t-4 border-t-[#5b7898]'>
        <CardContent>
          <Box className='flex flex-col sm:flex-row justify-between items-start gap-4 mb-6'>
            <Box>
              <Typography variant='h5' className='text-[#5b7898] text-xl md:text-2xl'>
                Campañas de Email
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                Gestiona y analiza tus campañas de email marketing
              </Typography>
            </Box>
            {(campaignsData.active.length > 0 || campaignsData.scheduled.length > 0) && (
              <Button
                variant='contained'
                onClick={() => handleNavigate("/dashboard/email-sender")}
                startIcon={<SendIcon />}
                className='bg-[#5b7898] hover:bg-[#4a6277] w-full sm:w-auto'
              >
                Nueva Campaña
              </Button>
            )}
          </Box>

          {renderCampaignSections()}
        </CardContent>
      </Card>
    </Box>
  );
};

const CampaignCard = ({ campaign, isActive }: { campaign: Campaign; isActive: boolean }) => {
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    // TODO: Implementar lógica de eliminación
    console.log("Eliminar campaña:", campaign.id);
  };

  const handleReschedule = () => {
    // TODO: Implementar lógica de reprogramación
    console.log("Reprogramar campaña:", campaign.id);
  };

  return (
    <Card className='mb-8 hover:shadow-lg transition-shadow duration-300'>
      <CardContent className='p-4 md:p-8'>
        <Box onClick={() => setOpen(!open)} className='cursor-pointer mb-4'>
          <Box className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
            <Box className='flex items-center gap-4 w-full sm:w-auto'>
              <Email className='text-[#5b7898] hidden sm:block' />
              <Box className='w-full sm:w-auto'>
                <Typography variant='h6' className='text-base md:text-lg'>
                  {campaign.name}
                </Typography>
                <Box className='flex items-center gap-2 mt-1'>
                  <CalendarToday fontSize='small' />
                  <Typography variant='body2' color='text.secondary'>
                    {getDisplayDate(campaign)}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box className='flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto justify-end'>
              {getStatusChip(campaign.status)}
              {!isActive && campaign.status === "pending" && (
                <Box className='flex gap-2 w-full sm:w-auto'>
                  <Button
                    variant='outlined'
                    color='primary'
                    size='small'
                    fullWidth
                    className='sm:w-auto'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReschedule();
                    }}
                  >
                    Reprogramar
                  </Button>
                  <Button
                    variant='outlined'
                    color='error'
                    size='small'
                    fullWidth
                    className='sm:w-auto'
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete();
                    }}
                  >
                    Eliminar
                  </Button>
                </Box>
              )}
              <ExpandMore className={`transform transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
            </Box>
          </Box>
        </Box>

        <Collapse in={open}>
          <Divider className='my-4 md:my-8' />
          {isActive ? (
            <Box className='grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16'>
              <Box className='w-full'>
                <Typography variant='h6' className='my-4 p-4 md:p-6 text-main text-base md:text-lg'>
                  Métricas Principales
                </Typography>
                {renderMetricsSummary(campaign as ActiveCampaign)}
                <Typography variant='caption' color='text.secondary' className='block mt-4 md:mt-6 pt-4 md:pt-6 italic'>
                  Las métricas se actualizan automáticamente cada 20 segundos
                </Typography>
              </Box>
              <Box className='w-full'>
                <Typography variant='h6' className='mb-4 text-gray-700 text-base md:text-lg'>
                  Métricas de la Campaña
                </Typography>
                {renderMetricsChart(campaign as ActiveCampaign)}
              </Box>
            </Box>
          ) : (
            <Box className='space-y-6'>
              <Typography variant='h6' className='mb-4'>
                Detalles de la campaña programada
              </Typography>

              <Box className='space-y-3'>
                <Box className='flex gap-2'>
                  <Typography variant='subtitle1' fontWeight='bold'>
                    Fecha de envío:
                  </Typography>
                  <Typography>{new Date(campaign.scheduledFor).toLocaleDateString()}</Typography>
                </Box>

                <Box className='flex gap-2'>
                  <Typography variant='subtitle1' fontWeight='bold'>
                    Hora programada:
                  </Typography>
                  <Typography>{new Date(campaign.scheduledFor).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Typography>
                </Box>

                <Box className='flex gap-2'>
                  <Typography variant='subtitle1' fontWeight='bold'>
                    Destinatarios:
                  </Typography>
                  <Typography>{campaign.recipientsCount}</Typography>
                </Box>

                <Box className='mt-6'>
                  <Typography variant='subtitle1' fontWeight='bold' className='mb-2'>
                    Vista Previa
                  </Typography>
                  <Box className='rounded-lg border p-4 bg-gray-50'>
                    <div className='max-h-[500px] overflow-auto' dangerouslySetInnerHTML={{ __html: campaign.template }} />
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </Collapse>
      </CardContent>
    </Card>
  );
};
