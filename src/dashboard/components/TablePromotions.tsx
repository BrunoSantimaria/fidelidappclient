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
  Snackbar,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Delete, Share } from "@mui/icons-material";
import { useDashboard } from "../../hooks";
import { useNavigateTo } from "../../hooks/useNavigateTo";
import { Link } from "react-router-dom";

export const TablePromotions = () => {
  const { metrics, plan, promotions, deletePromotion } = useDashboard();
  const { handleNavigate } = useNavigateTo();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // Estado para controlar el diálogo
  const [dialogOpen, setDialogOpen] = useState(false);
  const [promotionToDelete, setPromotionToDelete] = useState<string | null>(null);

  const handleShare = (promotionId: string) => {
    const promotionLink = `${window.location.origin}/promotion/${promotionId}`;
    navigator.clipboard.writeText(promotionLink);
    setSnackbarMessage("Enlace de promoción copiado al portapapeles.");
    setSnackbarOpen(true);
  };

  const handleDelete = (promotionId: string) => {
    setPromotionToDelete(promotionId);
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    setSnackbarMessage("");
  };

  const handleDeleteConfirmed = async () => {
    if (promotionToDelete) {
      await deletePromotion(promotionToDelete);
      setSnackbarMessage("Promoción eliminada.");
      setSnackbarOpen(true);
      setDialogOpen(false);
    }
  };

  return (
    <>
      <span className='text-2xl font-bold'>Aquí puedes crear y gestionar tus programas de fidelización.</span>

      {promotions.length ? (
        <>
          <TableContainer component={Paper} className='shadow-md rounded-lg'>
            <Table>
              <TableHead className='bg-gradient-to-br from-gray-50 to-main/30'>
                <TableRow>
                  <TableCell>Título</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Duración (días)</TableCell>
                  <TableCell>Recurrente</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Visitas Requeridas</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {promotions?.map((promotion) => (
                  <TableRow key={promotion._id} className='odd:bg-white even:bg-gray-100'>
                    <TableCell>
                      <Link to={`/dashboard/promotion/${promotion._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                        {promotion.title}
                      </Link>
                    </TableCell>
                    <TableCell>{promotion.description}</TableCell>
                    <TableCell>{promotion.promotionDuration}</TableCell>
                    <TableCell>{promotion.promotionRecurrent === "True" ? "Sí" : "No"}</TableCell>
                    <TableCell>{promotion.promotionType}</TableCell>
                    <TableCell>{promotion.visitsRequired}</TableCell>
                    <TableCell>
                      <Tooltip title='Eliminar'>
                        <IconButton color='error' onClick={() => handleDelete(promotion._id)}>
                          <Delete />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title='Compartir'>
                        <IconButton color='primary' onClick={() => handleShare(promotion._id)}>
                          <Share />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Button
            variant='contained'
            disabled={metrics?.activePromotions === plan?.promotionLimit}
            onClick={() => handleNavigate("/dashboard/promotions/create")}
          >
            Crear nuevo programa de fidelización.
          </Button>

          {/* Dialog de confirmación */}
          <Dialog open={dialogOpen} onClose={handleDialogClose}>
            <DialogTitle>Eliminar Promoción</DialogTitle>
            <DialogContent>
              <DialogContentText>¿Estás seguro de que deseas eliminar esta promoción? Esta acción no se puede deshacer.</DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose} color='primary'>
                Cancelar
              </Button>
              <Button onClick={handleDeleteConfirmed} color='error'>
                Eliminar
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <section className='shadow-md shadow-neutral-200 bg-gradient-to-br from-gray-100 to-main/30 p-6 rounded-md'>
          <div className='flex flex-col space-y-6'>
            <span className='text-center text-lg text-black/60'>No hay promociones disponibles, empieza creando una en el botón de abajo.</span>
            <Button
              variant='contained'
              disabled={metrics?.activePromotions === plan?.promotionLimit}
              onClick={() => handleNavigate("/dashboard/promotions/create")}
            >
              Crear nuevo programa de fidelización.
            </Button>
          </div>
        </section>
      )}

      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        message={snackbarMessage}
      />
    </>
  );
};
