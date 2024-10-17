import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDashboard } from "../../../hooks";
import { Backdrop, CircularProgress, Button, Modal, TextField, Box, Divider } from "@mui/material";
import api from "../../../utils/api";
import { PromotionMetrics } from "./PromotionMetrics";
import { ClientList } from "./ClientList";
import { VisitCharts } from "./VisitCharts";
import { toast } from "react-toastify";
import { useNavigateTo } from "../../../hooks/useNavigateTo";

export const Promotion = () => {
  const { activePromotion, getPromotionById, cleanPromotion } = useDashboard();
  console.log(activePromotion);

  const { id } = useParams();
  const [clientEmail, setClientEmail] = useState("");
  const [clientName, setClientName] = useState("");
  const { getPromotionsAndMetrics } = useDashboard();
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(""); // Para previsualizar la imagen
  const [promotionData, setPromotionData] = useState({
    title: "",
    description: "",
    conditions: "",
    promotionType: "",
    promotionRecurrent: "",
    visitsRequired: 0,
    promotionDuration: 0,
    image: null, // Para manejar el archivo de imagen
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
        imageUrl: activePromotion.imageUrl, // La imagen será manejada por el selector
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

  return (
    <main className='flex flex-col p-10 ml-0 md:ml-20 lg:ml-20  w-full gap-5'>
      <main className='relative flex flex-col justify-center place-items-center space-y-6 w-full md:w-[95%] h-full md:h-[30%] rounded-md p-6 bg-gradient-to-br from-gray-50 to-main/50'>
        <section className='flex flex-col md:flex-row justify-between w-full md:w-[95%] lg:max-w-[95%] mx-auto'>
          <div className='relative z-10 w-[95%] md:w-[60%] space-y-6 text-left p-6 rounded-md'>
            <h1 className='font-poppins font-bold text-2xl md:text-5xl'>{activePromotion.title}</h1>
            <p className='font-medium'>{activePromotion.description}</p>
            <div>
              <p className='italic'>Duración: {activePromotion.promotionDuration} días</p>
              <p className='italic'>Visitas requeridas: {activePromotion.visitsRequired}</p>
            </div>

            <div className='flex flex-col space-y-6'>
              <Button variant='contained' color='primary' onClick={handleOpenModal}>
                Modificar Promoción
              </Button>
              <Button variant='contained' color='primary' onClick={() => handleNavigate(`/promotion/${id}`)}>
                Ver Promoción
              </Button>
              <Button variant='contained' color='primary' disabled>
                ENVIAR PROMOCÍON.
              </Button>
            </div>
          </div>

          <div className='relative z-10 w-[95%] md:w-[40%] flex justify-center'>
            <div className='w-full h-120 ml-6 rounded-md overflow-hidden bg-gray-200 shadow-md'>
              <img src={imagePreview} alt='Promotion' className='object-cover w-full h-full' />
            </div>
          </div>
        </section>
      </main>
      <Divider />
      <PromotionMetrics metrics={activePromotion} />
      <VisitCharts />
      <ClientList clients={activePromotion?.statistics.clientList} />

      {/* Modal de modificación */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box className='flex flex-col space-y-4 p-5 bg-white shadow-md rounded-md max-w-xl mx-auto mt-20'>
          <h2>Modificar Promoción</h2>
          <TextField label='Título' name='title' value={promotionData.title} onChange={handleInputChange} fullWidth />
          <TextField label='Descripción' name='description' value={promotionData.description} onChange={handleInputChange} fullWidth />
          <TextField label='Condiciones' name='conditions' value={promotionData.conditions} onChange={handleInputChange} fullWidth />
          <input type='file' accept='image/*' onChange={handleImageChange} />
          {imagePreview && <img src={imagePreview} alt='Preview' className='w-full h-40 object-cover mt-4' />}
          <Button variant='contained' color='primary' onClick={handleSubmit}>
            Guardar cambios
          </Button>
        </Box>
      </Modal>
    </main>
  );
};
