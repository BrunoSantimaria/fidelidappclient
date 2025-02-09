import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Button,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Card,
  CardContent,
  Typography,
  Box,
  Menu,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import { Delete, Share, Edit, MoreVert } from "@mui/icons-material";
import { useDashboard } from "../../hooks";
import { useNavigateTo } from "../../hooks/useNavigateTo";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useTheme } from "@mui/material/styles";
import { useAuthSlice } from "@/hooks/useAuthSlice";
const getSystemType = (type: string | undefined) => {
  if (!type) return "-";
  switch (type) {
    case "points":
      return "Puntos";
    case "visits":
      return "Visitas";
    default:
      return "-";
  }
};

const calculateEndDate = (promotion) => {
  if (promotion.systemType === "points") {
    const startDate = promotion.startDate ? new Date(promotion.startDate) : new Date(promotion.createdAt);
    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + parseInt(promotion.promotionDuration));
    return endDate.toLocaleDateString();
  }
  return promotion.endDate ? new Date(promotion.endDate).toLocaleDateString() : promotion.promotionDuration;
};

const isPromotionExpired = (promotion) => {
  const endDate =
    promotion.systemType === "points"
      ? new Date(new Date(promotion.startDate || promotion.createdAt).getTime() + parseInt(promotion.promotionDuration) * 24 * 60 * 60 * 1000)
      : new Date(promotion.endDate);

  return endDate < new Date();
};

export const TablePromotions = ({ onDelete, statsCards }) => {
  const { metrics, plan, promotions, deletePromotion } = useDashboard();
  console.log(promotions);
  const { handleNavigate } = useNavigateTo();

  const [dialogOpen, setDialogOpen] = useState(false);

  const [promotionToDelete, setPromotionToDelete] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPromotionId, setSelectedPromotionId] = useState<string | null>(null);

  // Estado local para las promociones
  const [localPromotions, setLocalPromotions] = useState(promotions || []);

  useEffect(() => {
    setLocalPromotions(promotions || []);
  }, [promotions]);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, promotionId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedPromotionId(promotionId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedPromotionId(null);
  };

  const handleShare = () => {
    if (selectedPromotionId) {
      const baseUrl = window.location.origin;
      const promotionLink = `${baseUrl}/promotion/${selectedPromotionId}`;
      navigator.clipboard.writeText(promotionLink);
      toast.info("Enlace de promoción copiado al portapapeles");
      handleMenuClose();
    }
  };

  const handleEdit = () => {
    if (selectedPromotionId) {
      handleNavigate(`/dashboard/promotion/${selectedPromotionId}/edit`);
      handleMenuClose();
    }
  };

  const handleDelete = (promotionId: string) => {
    setPromotionToDelete(promotionId);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDeleteConfirmed = async () => {
    if (promotionToDelete) {
      // Eliminar la promoción del servidor
      await deletePromotion(promotionToDelete);
      toast.info("Promoción eliminada.");

      // Eliminar la promoción localmente para actualizar el estado
      setLocalPromotions((prevPromotions) => prevPromotions.filter((promotion) => promotion._id !== promotionToDelete));

      setDialogOpen(false);
      onDelete();
    }
  };

  return (
    <Card sx={{ borderTop: 4, borderColor: "#5b7898" }}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Box>
            <Typography variant='h5' sx={{ color: "#5b7898" }}>
              Programas de Fidelización
            </Typography>
            <Typography variant='body2' color='text.secondary'>
              Gestiona tus programas de fidelización y sus configuraciones
            </Typography>

            {statsCards.map((card) => (
              <Card key={card.title} sx={{ borderTop: 4, borderColor: "#5b7898", width: "100%", marginTop: 2 }}>
                <CardContent>
                  <Typography variant='h6' sx={{ color: "#5b7898" }}>
                    {card.title}
                  </Typography>
                  <Typography variant='body2' color='text.secondary'>
                    {card.value}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Box>
          <Button
            variant='contained'
            sx={{
              bgcolor: "#5b7898",
              "&:hover": { bgcolor: "#4a6277" },
            }}
            disabled={metrics?.activePromotions === plan?.promotionLimit}
            onClick={() => handleNavigate("/dashboard/promotions/create")}
          >
            Crear Nuevo Programa
          </Button>
        </Box>

        <CardContent>
          {localPromotions.length ? (
            <TableContainer sx={{ overflowX: "auto" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Título</TableCell>
                    <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>Descripción</TableCell>
                    <TableCell align='center' sx={{ display: { xs: "none", sm: "table-cell" } }}>
                      Fecha Inicio
                    </TableCell>
                    <TableCell align='center' sx={{ display: { xs: "none", sm: "table-cell" } }}>
                      Fecha Fin
                    </TableCell>
                    <TableCell align='center' sx={{ display: { xs: "none", sm: "table-cell" } }}>
                      Status
                    </TableCell>
                    <TableCell align='center'>Tipo</TableCell>
                    <TableCell align='right'>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {localPromotions.map((promotion) => (
                    <TableRow key={promotion._id}>
                      <TableCell>
                        <Link to={`/dashboard/promotion/${promotion._id}`} style={{ textDecoration: "none", color: "#5b7898", fontWeight: 500 }}>
                          {promotion.title}
                        </Link>
                      </TableCell>
                      <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>{promotion.description.slice(0, 100)}...</TableCell>
                      <TableCell align='center' sx={{ display: { xs: "none", sm: "table-cell" } }}>
                        {promotion.startDate ? new Date(promotion.startDate).toLocaleDateString() : promotion.createdAt.split("T")[0]}
                      </TableCell>
                      <TableCell align='center' sx={{ display: { xs: "none", sm: "table-cell" } }}>
                        {calculateEndDate(promotion)}
                      </TableCell>
                      <TableCell align='center' sx={{ display: { xs: "none", sm: "table-cell" } }}>
                        <Box
                          sx={{
                            bgcolor: isPromotionExpired(promotion) ? "grey.500" : promotion.status === "active" ? "#5b7898" : "grey.300",
                            color: "white",
                            px: 2,
                            py: 0.5,
                            borderRadius: 2,
                            display: "inline-block",
                            fontSize: "0.875rem",
                          }}
                        >
                          {isPromotionExpired(promotion) ? "Expirada" : promotion.status === "active" ? "Activa" : "Inactiva"}
                        </Box>
                      </TableCell>
                      <TableCell align='center'>{getSystemType(promotion.systemType)}</TableCell>
                      <TableCell align='right'>
                        <IconButton size='small' onClick={(e) => handleMenuOpen(e, promotion._id)} sx={{ color: "grey.500" }}>
                          <MoreVert />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ textAlign: "center", py: 4 }}>
              <Typography variant='body1' color='text.secondary'>
                No hay promociones disponibles, empieza creando una con el botón superior.
              </Typography>
            </Box>
          )}
        </CardContent>
      </Box>

      {/* Dialog de confirmación */}
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Eliminar Promoción</DialogTitle>
        <DialogContent>
          <DialogContentText>¿Estás seguro de que deseas eliminar esta promoción? Esta acción no se puede deshacer.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} variant='outlined'>
            Cancelar
          </Button>
          <Button onClick={handleDeleteConfirmed} className='bg-red-600 hover:bg-red-700 text-white'>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Menú de acciones */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
          },
        }}
      >
        <MenuItem onClick={handleShare}>
          <ListItemIcon>
            <Share fontSize='small' />
          </ListItemIcon>
          Copiar enlace
        </MenuItem>

        <MenuItem
          onClick={() => {
            if (selectedPromotionId) handleDelete(selectedPromotionId);
            handleMenuClose();
          }}
          sx={{ color: "error.main" }}
        >
          <ListItemIcon>
            <Delete fontSize='small' sx={{ color: "error.main" }} />
          </ListItemIcon>
          Eliminar
        </MenuItem>
      </Menu>
    </Card>
  );
};
