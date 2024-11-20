import React, { useState } from "react";
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

export const TablePromotions = () => {
  const { metrics, plan, promotions, deletePromotion } = useDashboard();
  const { handleNavigate } = useNavigateTo();

  // Estado para controlar el diálogo
  const [dialogOpen, setDialogOpen] = useState(false);
  const [promotionToDelete, setPromotionToDelete] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedPromotionId, setSelectedPromotionId] = useState<string | null>(null);

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
      await deletePromotion(promotionToDelete);
      toast.info("Promoción eliminada.");
      setDialogOpen(false);
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
          {promotions?.length ? (
            <TableContainer sx={{ overflowX: "auto" }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Título</TableCell>
                    <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>Descripción</TableCell>
                    <TableCell align='center' sx={{ display: { xs: "none", sm: "table-cell" } }}>
                      Duración
                    </TableCell>
                    <TableCell align='center' sx={{ display: { xs: "none", sm: "table-cell" } }}>
                      Recurrente
                    </TableCell>
                    <TableCell align='center'>Tipo</TableCell>
                    <TableCell align='center' sx={{ display: { xs: "none", sm: "table-cell" } }}>
                      Visitas
                    </TableCell>
                    <TableCell align='right'>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {promotions?.map((promotion) => (
                    <TableRow key={promotion._id}>
                      <TableCell>
                        <Link to={`/dashboard/promotion/${promotion._id}`} style={{ textDecoration: "none", color: "#5b7898", fontWeight: 500 }}>
                          {promotion.title}
                        </Link>
                      </TableCell>
                      <TableCell sx={{ display: { xs: "none", md: "table-cell" } }}>{promotion.description.slice(0, 100)}...</TableCell>
                      <TableCell align='center' sx={{ display: { xs: "none", sm: "table-cell" } }}>
                        {promotion.promotionDuration}
                      </TableCell>
                      <TableCell align='center' sx={{ display: { xs: "none", sm: "table-cell" } }}>
                        <Box
                          sx={{
                            bgcolor: promotion.promotionRecurrent === "True" ? "#5b7898" : "grey.300",
                            color: "white",
                            px: 2,
                            py: 0.5,
                            borderRadius: 2,
                            display: "inline-block",
                            fontSize: "0.875rem",
                          }}
                        >
                          {promotion.promotionRecurrent === "True" ? "Sí" : "No"}
                        </Box>
                      </TableCell>
                      <TableCell align='center'>{getSystemType(promotion.systemType)}</TableCell>
                      <TableCell align='center' sx={{ display: { xs: "none", sm: "table-cell" } }}>
                        {promotion.visitsRequired || "-"}
                      </TableCell>
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
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <Edit fontSize='small' />
          </ListItemIcon>
          Editar
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
