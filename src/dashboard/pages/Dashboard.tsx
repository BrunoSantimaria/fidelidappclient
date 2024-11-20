import { useEffect, useState, useMemo } from "react";
import { useDashboard } from "../../hooks/useDashboard";
import { Package2, Users, PieChart, Calendar, Mail, CheckCircle2, Plus } from "lucide-react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { useNavigateTo } from "../../hooks/useNavigateTo";
import { MetricCard } from "../components/MetricCard";
import { QuickActions } from "../components/QuickActions";
import { RecentPromotions } from "../components/RecentPromotions";
import { useWeeklyVisits } from "../../hooks/useWeeklyVisits";
import moment from "moment";
import "moment/locale/es";
import { useAuthSlice } from "../../hooks/useAuthSlice";

// Configurar moment para usar español
moment.locale("es");

// Hook personalizado para manejar los datos del dashboard
const useDashboardData = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { metrics, plan, promotions, getPromotionsAndMetrics, clients } = useDashboard();

  const loadData = async () => {
    try {
      setIsLoading(true);
      await getPromotionsAndMetrics();
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Revalidación periódica cada 30 segundos
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  return {
    isLoading,
    error,
    metrics,
    plan,
    promotions,
    clients,
    refetch: loadData,
  };
};

export const Dashboard = () => {
  const { isLoading, error, metrics, plan, promotions, clients } = useDashboardData();
  const { user } = useAuthSlice();
  const { handleNavigate } = useNavigateTo();
  const [currentPage, setCurrentPage] = useState(1);
  const { weeklyVisits, loading: loadingVisits } = useWeeklyVisits();
  const clientsPerPage = 3;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const sortedClients = useMemo(() => {
    if (!clients || !promotions) return [];

    return [...clients]
      .filter(
        (client) =>
          client.addedpromotions &&
          client.addedpromotions.length > 0 &&
          client.addedpromotions.some((promo) => promotions.some((myPromo) => myPromo._id === promo.promotion))
      )
      .sort((a, b) => {
        const dateA = new Date(a.addedpromotions[0].addedDate);
        const dateB = new Date(b.addedpromotions[0].addedDate);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, 20);
  }, [clients, promotions]);

  const visitData = useMemo(() => {
    if (!weeklyVisits) return [];
    moment.locale("es");
    // ... resto del código del visitData
    return weeklyVisits;
  }, [weeklyVisits]);

  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = sortedClients.slice(indexOfFirstClient, indexOfLastClient);
  const totalPages = Math.ceil(sortedClients.length / clientsPerPage);

  if (isLoading) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#5b7898]'></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='flex items-center justify-center min-h-screen'>
        <p className='text-red-500'>Error al cargar los datos. Por favor, intenta de nuevo.</p>
      </div>
    );
  }

  const onboardingTasks = [
    { id: 1, title: "Crear tu primera promoción", completed: metrics?.activePromotions > 0 },
    { id: 2, title: "Añadir tu primer cliente", completed: clients?.length > 0 },
    { id: 3, title: "Enviar tu primera campaña de email", completed: user.accounts?.firstEmailMarketingCompleted || false },
  ];

  const progress = (onboardingTasks.filter((task) => task.completed).length / onboardingTasks.length) * 100;

  return (
    <div className='flex-1 p-8 bg-slate-50'>
      <div className='w-[95%] ml-0 md:ml-16 mx-auto space-y-8'>
        {/* Tarjeta de Bienvenida */}
        <div className='bg-white rounded-lg border border-black/20 border-t-4 border-t-[#5b7898] p-6'>
          <h1 className='text-2xl font-bold text-[#5b7898]'>¡Bienvenido a FidelidApp!</h1>
          <p className='text-gray-600 mt-2'>
            Aquí encontrarás herramientas diseñadas para mejorar la fidelidad de tus clientes y maximizar el rendimiento de tus programas de fidelización.
          </p>
        </div>

        {/* Grid de Métricas */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
          <MetricCard
            title='Programas activos'
            value={`${metrics?.activePromotions || 0}/${plan?.promotionLimit || 0}`}
            icon={<Package2 className='w-4 h-4 text-[#5b7898]' />}
          />
          <MetricCard
            title='Clientes Registrados'
            value={`${metrics?.registeredClients || 0} /${plan?.clientLimit || " Ilimitado"}`}
            icon={<Users className='w-4 h-4 text-[#5b7898]' />}
          />
          <MetricCard title='Visitas Totales' value={metrics?.totalVisits || 0} icon={<PieChart className='w-4 h-4 text-[#5b7898]' />} />
          <MetricCard title='Promociones Canjeadas' value={metrics?.redeemedPromotions || 0} icon={<Package2 className='w-4 h-4 text-[#5b7898]' />} />
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Mostrar Primeros Pasos solo si no está completado */}
          {progress !== 100 && (
            <div className='bg-white rounded-lg border border-t-4 border-black/20 border-t-[#5b7898] p-6 relative'>
              <h2 className={`text-xl font-bold ${progress === 100 ? "text-white" : "text-[#5b7898]"}`}>Primeros Pasos</h2>
              <p className={`text-sm mt-1 ${progress === 100 ? "text-slate-300" : "text-gray-600"}`}>Completa estas tareas para comenzar</p>

              <div className='mt-4 space-y-4'>
                <div className='space-y-2'>
                  <div className='flex justify-between text-sm'>
                    <span>Progreso</span>
                    <span>{progress.toFixed(0)}%</span>
                  </div>
                  <div className='w-full bg-slate-200 rounded-full h-2'>
                    <div className='bg-[#5b7898] h-2 rounded-full transition-all' style={{ width: `${progress}%` }} />
                  </div>
                </div>

                <div className='space-y-4 mt-4'>
                  {onboardingTasks.map((task) => (
                    <div
                      key={task.id}
                      className='flex items-start gap-4 cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors'
                      onClick={() => {
                        if (!task.completed) {
                          switch (task.id) {
                            case 1:
                              handleNavigate("/dashboard/promotions/create");
                              break;
                            case 2:
                              handleNavigate("/dashboard/clients/list");
                              break;
                            case 3:
                              handleNavigate("/dashboard/email-sender");
                              break;
                          }
                        }
                      }}
                    >
                      <CheckCircle2 className={`w-5 h-5 ${task.completed ? (progress === 100 ? "text-white" : "text-[#5b7898]") : "text-slate-300"}`} />
                      <div>
                        <span className={`text-sm ${progress === 100 ? "text-white" : ""}`}>{task.title}</span>
                        <p className={`text-xs mt-1 ${progress === 100 ? "text-slate-300" : "text-gray-500"}`}>
                          {task.id === 1 && "Crea tu primera promoción para atraer clientes"}
                          {task.id === 2 && "Registra tu primer cliente en el sistema"}
                          {task.id === 3 && "Envía tu primera campaña de email marketing"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {progress === 100 && <div className='absolute bottom-4 left-0 right-0 text-center text-white'>¡Completado! 👑</div>}
            </div>
          )}

          {/* Acciones Rápidas y Actividad Reciente */}
          <div className={`${progress === 100 ? "lg:col-span-3" : "lg:col-span-2"} space-y-8`}>
            <QuickActions handleNavigate={handleNavigate} />
            <RecentPromotions promotions={promotions} />
          </div>
        </div>

        {/* Clientes Recientes */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='bg-white rounded-lg border border-t-4 border-black/20 border-t-[#5b7898] p-6 flex flex-col h-full'>
            <h2 className='text-xl font-bold text-[#5b7898]'>Clientes Recientes</h2>
            <p className='text-gray-600 text-sm mt-1'>Últimos clientes registrados</p>

            <div className='mt-4 flex-1 flex flex-col justify-between'>
              {clients.length === 0 ? (
                <div className='flex items-center justify-center h-full'>
                  <span className='text-gray-500'>No hay clientes registrados</span>
                </div>
              ) : !sortedClients ? (
                <div className='flex items-center justify-center h-full'>
                  <span className='text-gray-500'>Cargando clientes...</span>
                </div>
              ) : (
                <>
                  <div className='space-y-4'>
                    <div className='grid grid-cols-3 text-sm text-gray-500 pb-2'>
                      <span className='font-medium'>Nombre</span>
                      <span className='font-medium text-center'>Email</span>
                      <span className='font-medium text-center'>Teléfono</span>
                    </div>
                    <div className='space-y-4'>
                      {currentClients.map((client) => (
                        <div key={client._id} className='flex items-center gap-3'>
                          <div className='w-8 h-8 rounded-full bg-[#5b7898] text-white flex items-center justify-center text-sm'>
                            {client.name ? getInitials(client.name) : <Users className='w-4 h-4' />}
                          </div>
                          <div className='grid grid-cols-3 flex-1 text-sm items-center'>
                            <span>{client.name || "-"}</span>
                            <span className='text-gray-500 truncate text-center'>{client.email}</span>
                            <span className='text-gray-500 text-center'>{client.phoneNumber || "-"}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Paginación */}
                  <div className='flex justify-center gap-2 pt-4 mt-auto border-t'>
                    <button
                      onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className='px-2 py-1 text-sm rounded bg-slate-100 disabled:opacity-50'
                    >
                      Anterior
                    </button>
                    <span className='px-2 py-1 text-sm'>
                      Página {currentPage} de {totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className='px-2 py-1 text-sm rounded bg-slate-100 disabled:opacity-50'
                    >
                      Siguiente
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
