import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

export const PromotionDetails = ({ promotionDetails, setPromotionDetails, currentStep, steps }) => {
  const [error, setError] = useState({
    title: "",
    description: "",
    image: "",
    conditions: "",
  });
  const [imagePreview, setImagePreview] = useState(promotionDetails.image ? URL.createObjectURL(promotionDetails.image) : "");
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    validateFields();
  }, [promotionDetails]);

  // Manejar los cambios en los campos de texto
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPromotionDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Manejar la carga de la imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        setError((prev) => ({
          ...prev,
          image: "El archivo seleccionado no es una imagen válida.",
        }));
        setImagePreview("");
        return;
      }

      setError((prev) => ({
        ...prev,
        image: "",
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setPromotionDetails((prev) => ({
          ...prev,
          image: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Validar los campos antes de proceder
  const validateFields = () => {
    let isValid = true;
    const newError = { title: "", description: "", image: "", conditions: "" };

    if (!promotionDetails.title?.trim()) {
      newError.title = "El título es obligatorio.";
      isValid = false;
    }

    if (!promotionDetails.description?.trim()) {
      newError.description = "La descripción es obligatoria.";
      isValid = false;
    }

    if (!promotionDetails.image) {
      newError.image = "Debes cargar una imagen para la promoción.";
      isValid = false;
    }

    if (!promotionDetails.conditions?.trim()) {
      newError.conditions = "Las condiciones son obligatorias.";
      isValid = false;
    }

    setError(newError);
    setIsValid(isValid);
  };
  const pageTransition = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };
  return (
    <motion.div initial='hidden' animate='visible' exit='hidden' variants={pageTransition}>
      <div>
        <label htmlFor='title'>Título de la promoción</label>
        <input
          id='title'
          name='title'
          type='text'
          value={promotionDetails.title || ""}
          onChange={handleChange}
          className='w-full p-2 border  bg-white border-main rounded-md'
          placeholder='Escribe el título'
        />
        {/* {error.title && <p className='text-red-500 text-sm'>{error.title}</p>} */}
      </div>

      <div className='mt-4'>
        <label htmlFor='description'>Descripción</label>
        <textarea
          id='description'
          name='description'
          value={promotionDetails.description || ""}
          onChange={handleChange}
          className='w-full p-2 border  bg-white border-main rounded-md'
          placeholder='Describe tu promoción'
        />
        {/* {error.description && <p className='text-red-500 text-sm'>{error.description}</p>} */}
      </div>

      <div className='mt-4'>
        <label htmlFor='conditions'>Condiciones de la promoción</label>
        <textarea
          id='conditions'
          name='conditions'
          value={promotionDetails.conditions || ""}
          onChange={handleChange}
          className='w-full p-2 border  bg-white border-main rounded-md'
          placeholder='Escribe las condiciones de la promoción'
        />
        {/* {error.conditions && <p className='text-red-500 text-sm'>{error.conditions}</p>} */}
      </div>

      <div className='mt-4'>
        <label htmlFor='image'>Imagen de la promoción</label>
        <input id='image' name='image' type='file' accept='image/*' onChange={handleImageChange} className='w-full p-2 border rounded' />
        {/* {error.image && <p className='text-red-500 text-sm'>{error.image}</p>} */}
      </div>

      {imagePreview && (
        <div className='mt-4'>
          <img src={imagePreview} alt='Vista previa' className='w-32 h-32 object-cover' />
        </div>
      )}
    </motion.div>
  );
};
