import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDashboard } from "../../../hooks";
import {
  Backdrop,
  CircularProgress,
  Button,
  Modal,
  TextField,
  Box,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
} from "@mui/material";
import api from "../../../utils/api";
import { PromotionMetrics } from "./PromotionMetrics";
import { ClientList } from "./ClientList";
import { VisitCharts } from "./VisitCharts";
import { toast } from "react-toastify";
import { useNavigateTo } from "../../../hooks/useNavigateTo";

import { PointsChart } from "./components/PointsCharts";

export const Promotion = () => {
  const { activePromotion, getPromotionById, cleanPromotion } = useDashboard();
  console.log(activePromotion);

  const { id } = useParams();
  const [clientEmail, setClientEmail] = useState("");
  const [clientName, setClientName] = useState("");
  const { getPromotionsAndMetrics } = useDashboard();
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [promotionData, setPromotionData] = useState({
    title: "",
    description: "",
    conditions: "",
    promotionType: "",
    promotionRecurrent: "",
    visitsRequired: 0,
    promotionDuration: 0,
    image: null,
    rewards: [], // Nueva propiedad para las recompensas
  });
  const { handleNavigate } = useNavigateTo();

  // Abrir el modal de modificación
  const handleOpenModal = () => {
    setOpenModal(true);
  };

  // Cerrar el modal
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  // Cargar la promoción al montar el componente
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
        conditions: activePromotion.conditions,
        promotionType: activePromotion.promotionType,
        promotionRecurrent: activePromotion.promotionRecurrent,
        visitsRequired: activePromotion.visitsRequired,
        promotionDuration: activePromotion.promotionDuration,
        rewards: activePromotion.rewards || [], // Cargar recompensas si están disponibles
        imageUrl: activePromotion.imageUrl,
      });
      setImagePreview(activePromotion.imageUrl); // Mostrar la imagen actual
    }
  }, [activePromotion]);

  // Manejador de cambios en los campos de texto
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPromotionData({ ...promotionData, [name]: value });
  };

  // Manejador del cambio de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setPromotionData({ ...promotionData, image: file });
    setImagePreview(URL.createObjectURL(file));
  };

  // Manejador de la actualización de la promoción
  const handleSubmit = async () => {
    // Verificación básica de campos obligatorios
    if (!promotionData.title || !promotionData.description || !promotionData.conditions) {
      toast.error("Todos los campos son obligatorios.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", promotionData.title);
      formData.append("description", promotionData.description);
      formData.append("conditions", promotionData.conditions);
      formData.append("promotionType", promotionData.promotionType || "");
      formData.append("promotionRecurrent", String(promotionData.promotionRecurrent || false));
      formData.append("visitsRequired", String(promotionData.visitsRequired || 0));
      formData.append("promotionDuration", String(promotionData.promotionDuration || 0));
      formData.append("rewards", JSON.stringify(promotionData.rewards || [])); // Agregar las recompensas si existen

      // Solo añadir la imagen si el usuario seleccionó una
      if (promotionData.image) {
        formData.append("image", promotionData.image);
      }

      // Realiza la petición PUT a la API para actualizar la promoción
      await api.put(`/api/promotions/${id}`, formData);

      // Actualiza las promociones y métricas después de la modificación
      await getPromotionById(id);
      await getPromotionsAndMetrics();

      toast.success("Promoción actualizada exitosamente.");
    } catch (error) {
      console.error("Error actualizando la promoción:", error.response?.data || error);
      toast.error("Error al actualizar la promoción. Inténtalo de nuevo.");
    } finally {
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
  function getPromotionExpiryDate(createdAt, promotionDuration) {
    // Convertir la fecha de creación a un objeto Date
    const creationDate = new Date(createdAt);

    // Sumar la duración de la promoción en días
    creationDate.setDate(creationDate.getDate() + promotionDuration);

    return creationDate;
  }
  console.log(activePromotion.createdAt, activePromotion.promotionDuration);
  return (
    <main className='flex flex-col p-0 ml-2 md:p-10  md:ml-20 lg:ml-20 h-fit gap-5'>
      <main className='flex flex-col justify-center place-items-center space-y-4 w-screen md:w-[95%] h-1/3 md:h-1/3 lg:h-1/3 rounded-md p-6 bg-gradient-to-br from-gray-50 to-main/50'>
        <section className='flex flex-col md:flex-row justify-between w-screen md:w-[95%] lg:max-w-[95%] mx-0'>
          <div className='h-1/3 md:h-1/3 z-10 w-[95%] md:w-[60%] space-y-6 text-left p-4 rounded-md'>
            <h1 className='font-poppins font-bold text-2xl md:text-5xl'>{activePromotion.title}</h1>
            <p className='font-medium'>{activePromotion.description}</p>

            <div className='flex flex-col space-y-6'>
              <Button variant='contained' color='primary' onClick={handleOpenModal}>
                Modificar Promoción
              </Button>

              <Button variant='contained' color='primary' onClick={() => handleNavigate(`/promotion/${id}`)}>
                Ver Promoción
              </Button>
              {activePromotion.systemType === "points" && (
                <div className='mb-4 text-center bg-main rounded-md'>
                  <Accordion
                    sx={{
                      textAlign: "center",
                      margin: "auto",
                      backgroundColor: "primary.main",
                      color: "white",
                      borderRadius: "8px",
                      "&.MuiAccordion-root:before": {
                        display: "none",
                      },
                      boxShadow: "none",
                    }}
                  >
                    <AccordionSummary
                      aria-controls='panel1a-content'
                      id='panel1a-header'
                      sx={{
                        backgroundColor: "primary.main",
                        color: "white",
                        borderRadius: "8px",
                        "&:hover": {
                          backgroundColor: "primary.dark",
                        },
                      }}
                    >
                      <Typography variant='button' sx={{ color: "white", margin: "auto" }}>
                        Ver Recompensas
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails
                      sx={{
                        backgroundColor: "primary.light",
                        color: "white",
                        borderRadius: "8px",
                      }}
                    >
                      <div className='space-y-2'>
                        {promotionData.rewards.map((reward) => (
                          <div key={reward._id} className='flex justify-between'>
                            <Typography>{reward.description}</Typography>
                            <Typography>{reward.points} puntos</Typography>
                          </div>
                        ))}
                      </div>
                    </AccordionDetails>
                  </Accordion>
                </div>
              )}
              <div className='flex flex-row space-x-6'>
                <p className='italic'>Duración: {activePromotion.promotionDuration} días</p>
                {activePromotion.systemType === "points" && ""}
                <p>Inicio: {new Date(activePromotion.createdAt).toLocaleDateString()}</p>

                <p className='mr-2'>Expiración: {getPromotionExpiryDate(activePromotion.createdAt, activePromotion.promotionDuration).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className='relative z-10 h-[300px] md:h-[450px] w-[95%] md:w-[40%] flex justify-center'>
            <div className='w-full ml-0 p-2 rounded-md overflow-hidden shadow-md'>
              <img src={imagePreview} alt='Promotion' className='object-cover rounded-md w-full h-full' />
            </div>
          </div>
        </section>
      </main>

      <PromotionMetrics metrics={activePromotion} />

      {activePromotion.systemType === "points" ? (
        <PointsChart pointsPerDay={activePromotion?.statistics.pointsPerDay} />
      ) : (
        <VisitCharts promotions={activePromotion?.statistics.visitsPerDay} />
      )}

      <ClientList
        clients={activePromotion?.statistics.clientList}
        promotion={activePromotion}
        systemType={activePromotion.systemType} // Pasar el tipo de sistema (puntos o visitas)
      />

      {/* Modal de modificación */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box className='flex flex-col space-y-4 p-5 bg-white shadow-md rounded-md max-w-xl mx-auto mt-20'>
          <h2>Modificar Promoción</h2>
          <TextField label='Título' name='title' value={promotionData.title} onChange={handleInputChange} fullWidth />
          <TextField label='Descripción' name='description' value={promotionData.description} onChange={handleInputChange} fullWidth />
          <TextField label='Condiciones' name='conditions' value={promotionData.conditions} onChange={handleInputChange} fullWidth />
          <input type='file' accept='image/*' onChange={handleImageChange} />
          {imagePreview && <img src={imagePreview} alt='Preview' className='w-full  object-cover mt-4' />}
          <Button variant='contained' color='primary' onClick={handleSubmit}>
            Guardar cambios
          </Button>
        </Box>
      </Modal>
    </main>
  );
};
