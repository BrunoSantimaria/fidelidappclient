import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Checkbox,
  FormControlLabel,
  Rating,
  Chip,
  ButtonGroup,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Person as PersonIcon, Delete as DeleteIcon, Edit as EditIcon, Star as StarIcon, Refresh as RefreshIcon } from "@mui/icons-material";
import { createWaiter, deleteWaiter, getWaiters, updateWaiter } from "./waiterPetitions";

import { toast } from "react-toastify";
import { useAuthSlice } from "@/hooks/useAuthSlice";

interface Waiter {
  _id: string;
  name: string;
  active: boolean;
  totalPoints: number;
  averageRating: number;
  averagePointsPerDay: number;
  ratings: Array<{
    rating: number;
    comment?: string;
    createdAt: string;
    client?: {
      name: string;
      email?: string;
    };
  }>;
  pointsHistory: Array<{
    points: number;
    date: string;
  }>;
}

const WaitersPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const [waiters, setWaiters] = useState<Waiter[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isRatingsModalVisible, setIsRatingsModalVisible] = useState(false);
  const [selectedRatings, setSelectedRatings] = useState<Waiter["ratings"]>([]);
  const [formData, setFormData] = useState({
    name: "",
    active: true,
  });
  const [selectedWaiter, setSelectedWaiter] = useState<Waiter | null>(null);
  const { user } = useAuthSlice();
  const [orderBy, setOrderBy] = useState<keyof Waiter>("name");
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("asc");
  const [ratingFilter, setRatingFilter] = useState<"7" | "15" | "30" | "all">("all");

  const columns = [
    { id: "name" as keyof Waiter, label: "Nombre", sortable: true },
    { id: "active" as keyof Waiter, label: "Estado", sortable: true },
    { id: "totalPoints" as keyof Waiter, label: "Puntos Totales", sortable: true },
    { id: "averageRating" as keyof Waiter, label: "Valoración Promedio", sortable: true },

    { id: "actions", label: "Acciones", sortable: false },
  ];

  const handleSort = (property: keyof Waiter) => {
    const isAsc = orderBy === property && orderDirection === "asc";
    setOrderDirection(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const filterRatings = (ratings: Waiter["ratings"]) => {
    const today = new Date();
    const filterDays = {
      "7": 7,
      "15": 15,
      "30": 30,
      all: Infinity,
    };

    return ratings.filter((rating) => {
      const ratingDate = new Date(rating.createdAt);
      const diffTime = Math.abs(today.getTime() - ratingDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays <= filterDays[ratingFilter];
    });
  };

  const getFilteredAverageRating = (waiter: Waiter) => {
    const filteredRatings = filterRatings(waiter.ratings);
    if (filteredRatings.length === 0) return 0;
    const sum = filteredRatings.reduce((acc, curr) => acc + curr.rating, 0);
    return sum / filteredRatings.length;
  };

  const sortedWaiters = [...waiters].sort((a, b) => {
    switch (orderBy) {
      case "averageRating":
        const aRating = getFilteredAverageRating(a);
        const bRating = getFilteredAverageRating(b);
        return orderDirection === "asc" ? aRating - bRating : bRating - aRating;

      case "active":
        return orderDirection === "asc" ? (a.active === b.active ? 0 : a.active ? 1 : -1) : a.active === b.active ? 0 : a.active ? -1 : 1;

      case "totalPoints":
      case "averagePointsPerDay":
        const aValue = a[orderBy] || 0;
        const bValue = b[orderBy] || 0;
        return orderDirection === "asc" ? aValue - bValue : bValue - aValue;

      case "name":
        return orderDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);

      default:
        return 0;
    }
  });

  const fetchWaiters = async () => {
    try {
      const waitersList = await getWaiters(user?.accounts._id);
      setWaiters(waitersList);
    } catch (error) {
      console.error("Error al obtener meseros:", error);
      toast.error("Error al cargar los meseros");
    }
  };

  useEffect(() => {
    fetchWaiters();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const normalizedNewName = formData.name.toLowerCase().trim();

      // Verificar si existe un mesero con el mismo nombre (ignorando mayúsculas/minúsculas y espacios)
      const existingWaiter = waiters.find(
        (waiter) => waiter.name.toLowerCase().trim() === normalizedNewName && (!selectedWaiter || waiter._id !== selectedWaiter._id)
      );

      if (existingWaiter) {
        toast.error("Ya existe un mesero con este nombre");
        return;
      }

      if (selectedWaiter) {
        await updateWaiter(user?.accounts._id, selectedWaiter._id, formData);
      } else {
        await createWaiter(user?.accounts._id, formData);
      }
      setIsModalVisible(false);
      setFormData({ name: "", active: true });
      setWaiters(await getWaiters(user?.accounts._id));
      toast.success(selectedWaiter ? "Mesero actualizado con éxito" : "Mesero creado con éxito");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Ocurrió un error al procesar la solicitud");
    }
  };

  const handleEdit = (waiter: Waiter) => {
    setSelectedWaiter(waiter);
    setFormData({
      name: waiter.name,
      active: waiter.active,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (waiterId: string) => {
    toast.warning(
      <>
        ¿Estás seguro de eliminar este mesero?
        <div className='mt-2'>
          <Button
            onClick={async () => {
              try {
                await deleteWaiter(user?.accounts._id, waiterId);
                await fetchWaiters();
                toast.success("Mesero eliminado con éxito");
              } catch (error) {
                console.error("Error:", error);
                toast.error("Error al eliminar el mesero");
              }
            }}
            color='error'
            variant='contained'
            size='small'
          >
            Sí, eliminar
          </Button>
        </div>
      </>,
      {
        position: "top-center",
        autoClose: 5000,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: false,
      }
    );
  };

  const showRatings = (waiter: Waiter) => {
    setSelectedRatings(waiter.ratings);
    setIsRatingsModalVisible(true);
  };

  const handleRefresh = async () => {
    try {
      await fetchWaiters();
      toast.success("Datos actualizados correctamente");
    } catch (error) {
      toast.error("Error al actualizar los datos");
    }
  };

  const renderFilterButtons = () => (
    <div className='mb-4 overflow-x-auto'>
      <ButtonGroup variant='outlined' size={isMobile ? "small" : "medium"} className='flex flex-wrap sm:flex-nowrap'>
        <Button onClick={() => setRatingFilter("7")} variant={ratingFilter === "7" ? "contained" : "outlined"} className='whitespace-nowrap'>
          7 días
        </Button>
        <Button onClick={() => setRatingFilter("15")} variant={ratingFilter === "15" ? "contained" : "outlined"} className='whitespace-nowrap'>
          15 días
        </Button>
        <Button onClick={() => setRatingFilter("30")} variant={ratingFilter === "30" ? "contained" : "outlined"} className='whitespace-nowrap'>
          30 días
        </Button>
        <Button onClick={() => setRatingFilter("all")} variant={ratingFilter === "all" ? "contained" : "outlined"} className='whitespace-nowrap'>
          Todos
        </Button>
      </ButtonGroup>
    </div>
  );

  return (
    <div className='p-2 sm:p-4 md:p-6 w-full md:w-[95%] lg:w-[90%] mx-auto'>
      <Card>
        <CardHeader
          title='Gestión de Meseros'
          titleTypographyProps={{ className: "text-xl md:text-2xl" }}
          action={
            <div className={`flex ${isMobile ? "flex-col" : "flex-row"} gap-2`}>
              <Button variant='outlined' startIcon={<RefreshIcon />} onClick={handleRefresh} fullWidth={isMobile} size={isMobile ? "small" : "medium"}>
                Actualizar
              </Button>
              <Button
                variant='contained'
                startIcon={<PersonIcon />}
                onClick={() => {
                  setSelectedWaiter(null);
                  setFormData({ name: "", active: true });
                  setIsModalVisible(true);
                }}
                fullWidth={isMobile}
                size={isMobile ? "small" : "medium"}
              >
                Añadir Mesero
              </Button>
            </div>
          }
        />
        <CardContent>
          <div className='overflow-x-auto'>
            {renderFilterButtons()}
            {waiters.length > 0 ? (
              <TableContainer component={Paper}>
                <Table size={isTablet ? "small" : "medium"}>
                  <TableHead>
                    <TableRow>
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          onClick={() => column.sortable && handleSort(column.id as keyof Waiter)}
                          style={{
                            cursor: column.sortable ? "pointer" : "default",
                            padding: isTablet ? "8px 4px" : "16px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          <div className='flex items-center'>
                            {column.label}
                            {column.sortable && orderBy === column.id && <span className='ml-1'>{orderDirection === "asc" ? "↑" : "↓"}</span>}
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedWaiters.map((waiter) => (
                      <TableRow key={waiter._id}>
                        <TableCell style={{ padding: isTablet ? "8px 4px" : "16px" }}>{waiter.name}</TableCell>
                        <TableCell style={{ padding: isTablet ? "8px 4px" : "16px" }}>
                          <Chip
                            label={waiter.active ? "Activo" : "Inactivo"}
                            color={waiter.active ? "success" : "error"}
                            size={isTablet ? "small" : "medium"}
                          />
                        </TableCell>
                        <TableCell style={{ padding: isTablet ? "8px 4px" : "16px" }}>{waiter.totalPoints}</TableCell>
                        <TableCell style={{ padding: isTablet ? "8px 4px" : "16px" }}>
                          <div className='flex items-center gap-2'>
                            <Rating value={getFilteredAverageRating(waiter)} readOnly precision={0.5} size={isTablet ? "small" : "medium"} />
                            <span className='text-sm'>({getFilteredAverageRating(waiter).toFixed(1)})</span>
                            <span className='text-xs text-gray-500 ml-1'>{filterRatings(waiter.ratings).length} valoraciones</span>
                          </div>
                        </TableCell>

                        <TableCell style={{ padding: isTablet ? "8px 4px" : "16px" }}>
                          <div className='flex flex-wrap gap-1'>
                            <Button size='small' startIcon={<EditIcon />} onClick={() => handleEdit(waiter)} />
                            <Button size='small' startIcon={<DeleteIcon />} color='error' onClick={() => handleDelete(waiter._id)} />
                            <Button size='small' startIcon={<StarIcon />} onClick={() => showRatings(waiter)} />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <div className='text-center py-4 sm:py-8'>
                <p className='text-gray-600 mb-4'>No hay meseros registrados aún</p>
                <Button
                  variant='contained'
                  startIcon={<PersonIcon />}
                  onClick={() => {
                    setSelectedWaiter(null);
                    setFormData({ name: "", active: true });
                    setIsModalVisible(true);
                  }}
                  size={isMobile ? "small" : "medium"}
                >
                  Agregar primer mesero
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isModalVisible} onClose={() => setIsModalVisible(false)} fullScreen={isMobile} maxWidth='sm' fullWidth>
        <DialogTitle>{selectedWaiter ? "Editar Mesero" : "Nuevo Mesero"}</DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label='Nombre'
              margin='normal'
              required
              name='name'
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <FormControlLabel
              control={<Checkbox checked={formData.active} onChange={(e) => setFormData({ ...formData, active: e.target.checked })} />}
              label='Activo'
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsModalVisible(false)}>Cancelar</Button>
          <Button variant='contained' onClick={handleSubmit}>
            {selectedWaiter ? "Actualizar" : "Crear"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={isRatingsModalVisible} onClose={() => setIsRatingsModalVisible(false)} fullScreen={isMobile} maxWidth='sm' fullWidth>
        <DialogTitle>Historial de Valoraciones</DialogTitle>
        <DialogContent>
          {selectedRatings.length > 0 ? (
            selectedRatings.map((rating, index) => (
              <div key={index} className='mb-4 p-3 border rounded'>
                <div className='flex flex-col gap-2'>
                  <div className='flex justify-between items-center'>
                    <Rating value={rating.rating} readOnly />
                    <small className='text-gray-500'>
                      {rating.createdAt
                        ? new Date(rating.createdAt).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "Fecha no disponible"}
                    </small>
                  </div>
                  {rating.client && (
                    <div className='text-sm text-gray-600'>
                      <p>
                        <strong>Cliente:</strong> {rating.client.name}
                      </p>
                      {rating.client.email && (
                        <p>
                          <strong>Email:</strong> {rating.client.email}
                        </p>
                      )}
                    </div>
                  )}
                  {rating.comment && (
                    <div className='mt-2'>
                      <p className='text-sm font-semibold text-gray-700'>Comentario:</p>
                      <p className='text-gray-700 bg-gray-50 p-2 rounded'>{rating.comment}</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className='text-center text-gray-500'>No hay valoraciones disponibles</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsRatingsModalVisible(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default WaitersPage;
