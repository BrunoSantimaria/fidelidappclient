import React from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Button, Snackbar, Tooltip } from "@mui/material";
import { Delete, Share } from "@mui/icons-material";
import { useDashboard } from "../../hooks";
import { useState } from "react";
import { useNavigateTo } from "../../hooks/useNavigateTo";

export const TablePromotions = () => {
  const { metrics, plan, promotions, deletePromotion } = useDashboard();
  const { handleNavigate } = useNavigateTo();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleShare = (promotionId: string) => {
    const promotionLink = `${window.location.origin}/promotions/${promotionId}`;
    navigator.clipboard.writeText(promotionLink);
    setSnackbarMessage("Enlace de promoción copiado al portapapeles.");
    setSnackbarOpen(true);
  };

  const handleDelete = (promotionId: string) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar esta promoción?")) {
      deletePromotion(promotionId);
      setSnackbarMessage("Promoción eliminada.");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    setSnackbarMessage("");
  };

  return (
    <>
      <span className='text-2xl font-bold'>Aquí puedes crear y gestionar tus programas de fidelización.</span>
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
                <TableCell>{promotion.title}</TableCell>
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
                    <IconButton color='primary' onClick={() => handleShare(promotion._id, promotion.userID)}>
                      <Share />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button variant='contained' disabled={metrics?.activePromotions === plan?.promotionLimit} onClick={() => handleNavigate("/dashboard/promotions/create")}>
        Crear nuevo programa de fidelización.
      </Button>

      {/* Snackbar para mostrar mensajes */}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleCloseSnackbar} message={snackbarMessage} />
    </>
  );
};
