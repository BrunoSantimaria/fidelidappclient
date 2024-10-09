import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDashboard } from "../../../hooks";
import { Backdrop, CircularProgress, Button, Modal, TextField, Snackbar, Box, Divider } from "@mui/material";
import api from "../../../utils/api";
import { PromotionMetrics } from "./PromotionMetrics";
import { ClientList } from "./ClientList";
import { VisitCharts } from "./VisitCharts";

export const Promotion = () => {
  const { activePromotion, getPromotionById, cleanPromotion } = useDashboard();
  const { id } = useParams();
  const { getPromotionsAndMetrics } = useDashboard();
  const [loading, setLoading] = useState(true); // Estado para controlar la carga
  const [openModal, setOpenModal] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [promotionData, setPromotionData] = useState({
    title: "",
    description: "",
    conditions: "",
  });

  useEffect(() => {
    const fetchPromotion = async () => {
      await getPromotionById(id);
      setLoading(false);
    };

    fetchPromotion();

    return () => {
      cleanPromotion();
    };
  }, [id]);

  useEffect(() => {
    if (activePromotion) {
      setPromotionData({
        title: activePromotion.title,
        description: activePromotion.description,
        promotionType: activePromotion.promotionType,
        promotionRecurrent: activePromotion.promotionRecurrent,
        visitsRequired: activePromotion.visitsRequired,
        benefitDescription: activePromotion.benefitDescription,
        promotionDuration: activePromotion.promotionDuration,
        conditions: activePromotion.conditions,
        imageUrl: activePromotion.imageUrl,
      });
    }
  }, [activePromotion]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPromotionData({ ...promotionData, [name]: value });
  };
  console.log(activePromotion);

  const handleSubmit = async () => {
    try {
      // Realiza la petición PUT a la API para actualizar la promoción
      await api.put(`/api/promotions/${id}`, promotionData);
      await getPromotionById(id);
      await getPromotionsAndMetrics();
      setSnackbarMessage("Promoción actualizada exitosamente.");
    } catch (error) {
      console.error("Error actualizando la promoción:", error);
      setSnackbarMessage("Error al actualizar la promoción. Inténtalo de nuevo.");
    } finally {
      setSnackbarOpen(true);
      handleCloseModal(); // Cierra el modal después de la operación
    }
  };

  // Mostrar el backdrop mientras se carga
  if (loading) {
    return (
      <Backdrop open>
        <CircularProgress color='inherit' />
      </Backdrop>
    );
  }

  // Mostrar mensaje si no hay promoción
  if (!activePromotion || Object.keys(activePromotion).length === 0) {
    return <div className='flex flex-col p-10 ml-0 md:ml-20 lg:ml-20 w-full gap-5'>Esta promoción no existe.</div>;
  }

  return (
    <main className='flex flex-col p-10 ml-0 md:ml-20 lg:ml-20 w-full gap-5'>
      <section className='flex flex-col   shadow-md shadow-neutral-200 bg-gradient-to-br from-gray-100 to-main/30 space-y-4 p-6 rounded-md m-0 text-left  w-[95%] '>
        <p className='text-3xl font-bold'>{activePromotion.title}</p>
        <p>{activePromotion.description}</p>
        <p>Duración: {activePromotion.promotionDuration} días</p>
        <p>Recurrente: {activePromotion.promotionRecurrent === "True" ? "Sí" : "No"}</p>
        <p>Tipo: {activePromotion.promotionType}</p>
        <p>Visitas requeridas: {activePromotion.visitsRequired}</p>
        <p>Condiciones: {activePromotion.conditions}</p>
        <Button variant='contained' onClick={handleOpenModal}>
          Modificar
        </Button>

        <Modal
          open={openModal}
          onClose={handleCloseModal}
          sx={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              width: "50%",
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
            }}
          >
            <h2>Modificar Promoción</h2>
            <TextField label='Título' name='title' value={promotionData.title} onChange={handleInputChange} margin='normal' fullWidth />
            <TextField label='Descripción' name='description' value={promotionData.description} onChange={handleInputChange} margin='normal' fullWidth />
            <TextField label='Condiciones' name='conditions' value={promotionData.conditions} onChange={handleInputChange} margin='normal' fullWidth />
            <Button variant='contained' onClick={handleSubmit}>
              Guardar Cambios
            </Button>
          </Box>
        </Modal>
        {/* Snackbar para mostrar mensajes */}
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          message={snackbarMessage}
        />
      </section>
      <Divider />
      <PromotionMetrics metrics={activePromotion} />
      <VisitCharts />
      <ClientList clients={activePromotion?.statistics.clientList} />
    </main>
  );
};
