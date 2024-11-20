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
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";
import api from "../../../utils/api";
import { PromotionMetrics } from "./PromotionMetrics";
import { ClientList } from "./ClientList";
import { VisitCharts } from "./VisitCharts";
import { toast } from "react-toastify";
import { useNavigateTo } from "../../../hooks/useNavigateTo";

import { PointsChart } from "./components/PointsCharts";
import { Instagram, Facebook, WhatsApp } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import { CardDescription } from "@/components/ui/card";
import CloseIcon from "@mui/icons-material/Close";

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
    <div className='min-h-screen bg-gradient-to-b  from-slate-50 to-slate-100 p-4 md:p-8'>
      <div className='w-full md:w-[90%] mx-auto'>
        <Card className='border p-2 border-t-4 border-black/20 border-t-[#5b7898] shadow-lg'>
          <CardContent className='p-6 md:p-8'>
            <div className='grid lg:grid-cols-2 gap-8 items-center'>
              <div className='space-y-6'>
                <div className='space-y-2'>
                  <h1 className='text-4xl font-bold tracking-tight text-[#5b7898]'>{activePromotion.title}</h1>
                  <CardContent className='text-lg'>{activePromotion.description}</CardContent>
                </div>

                <div className='space-y-4'>
                  <Button variant='contained' className='w-full bg-[#5b7898] hover:bg-[#4a6277] text-lg py-6' onClick={handleOpenModal}>
                    Modificar Promoción
                  </Button>

                  <Button
                    variant='contained'
                    className='w-full bg-[#5b7898] hover:bg-[#4a6277] text-lg py-6'
                    onClick={() => handleNavigate(`/promotion/${id}`)}
                  >
                    Ver Promoción
                  </Button>

                  {/* Accordion de recompensas con nuevo estilo */}
                  {activePromotion.systemType === "points" && (
                    <Accordion className='border-[#5b7898] shadow-md'>
                      <AccordionSummary className='bg-[#5b7898] text-white'>
                        <Typography className='text-lg font-medium'>Ver Recompensas</Typography>
                      </AccordionSummary>
                      <AccordionDetails className='bg-white'>
                        <div className='space-y-2'>
                          {promotionData.rewards.map((reward) => (
                            <div key={reward._id} className='flex justify-between p-2 border-b'>
                              <Typography>{reward.description}</Typography>
                              <Typography className='font-bold'>{reward.points} puntos</Typography>
                            </div>
                          ))}
                        </div>
                      </AccordionDetails>
                    </Accordion>
                  )}

                  <div className='grid grid-cols-3 gap-4 text-sm text-gray-600'>
                    <div>
                      <p className='font-medium'>Duración</p>
                      <p>{activePromotion.promotionDuration} días</p>
                    </div>
                    <div>
                      <p className='font-medium'>Inicio</p>
                      <p>{new Date(activePromotion.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className='font-medium'>Expiración</p>
                      <p>{getPromotionExpiryDate(activePromotion.createdAt, activePromotion.promotionDuration).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className='relative h-[400px] w-full max-w-[500px] rounded-2xl overflow-hidden shadow-xl mx-auto'>
                <img src={imagePreview} alt='Promotion' className='object-cover w-full h-full' />
              </div>
            </div>
          </CardContent>

          <PromotionMetrics metrics={activePromotion} />

          {activePromotion.systemType === "points"
            ? activePromotion?.statistics.pointsPerDay?.length > 0 && <PointsChart pointsPerDay={activePromotion.statistics.pointsPerDay} />
            : activePromotion?.statistics.visitsPerDay?.length > 0 && <VisitCharts promotions={activePromotion.statistics.visitsPerDay} />}

          <ClientList
            clients={activePromotion?.statistics.clientList}
            promotion={activePromotion}
            systemType={activePromotion.systemType} // Pasar el tipo de sistema (puntos o visitas)
          />

          {/* Modal modificado con nueva estética */}
          <Modal open={openModal} onClose={handleCloseModal}>
            <Box className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95%] md:w-[80%] lg:w-[60%] max-h-[90vh] overflow-y-auto'>
              <Card className='bg-white rounded-lg shadow-xl'>
                <div className='p-6 space-y-6'>
                  <div className='flex justify-between items-center border-b border-gray-200 pb-4'>
                    <Typography variant='h5' className='font-bold text-[#5b7898]'>
                      Modificar Promoción
                    </Typography>
                    <IconButton onClick={handleCloseModal} size='small'>
                      <CloseIcon />
                    </IconButton>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div className='space-y-4'>
                      <TextField
                        label='Título'
                        name='title'
                        value={promotionData.title}
                        onChange={handleInputChange}
                        fullWidth
                        variant='outlined'
                        className='bg-white'
                      />
                      <TextField
                        label='Descripción'
                        name='description'
                        value={promotionData.description}
                        onChange={handleInputChange}
                        fullWidth
                        multiline
                        rows={4}
                        variant='outlined'
                        className='bg-white'
                      />
                      <TextField
                        label='Condiciones'
                        name='conditions'
                        value={promotionData.conditions}
                        onChange={handleInputChange}
                        fullWidth
                        multiline
                        rows={4}
                        variant='outlined'
                        className='bg-white'
                      />
                    </div>

                    <div className='space-y-4'>
                      <div className='border-2 border-dashed border-gray-300 rounded-lg p-4 text-center'>
                        <input type='file' accept='image/*' onChange={handleImageChange} className='hidden' id='image-upload' />
                        <label
                          htmlFor='image-upload'
                          className='cursor-pointer inline-flex items-center justify-center px-4 py-2 bg-[#5b7898] text-white rounded-md hover:bg-[#4a6277] transition-colors'
                        >
                          Seleccionar Imagen
                        </label>
                        {imagePreview && (
                          <div className='mt-4'>
                            <img src={imagePreview} alt='Preview' className='max-h-[200px] mx-auto object-contain rounded-lg' />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className='flex justify-end gap-4 pt-4 border-t border-gray-200'>
                    <Button variant='outlined' onClick={handleCloseModal} className='text-[#5b7898] border-[#5b7898] hover:border-[#4a6277]'>
                      Cancelar
                    </Button>
                    <Button variant='contained' onClick={handleSubmit} className='bg-[#5b7898] hover:bg-[#4a6277]'>
                      Guardar cambios
                    </Button>
                  </div>
                </div>
              </Card>
            </Box>
          </Modal>
        </Card>
      </div>
    </div>
  );
};
