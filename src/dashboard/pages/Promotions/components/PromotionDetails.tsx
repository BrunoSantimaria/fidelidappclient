import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDropzone } from "react-dropzone";

export const PromotionDetails = ({ promotionDetails, setPromotionDetails, selectedSystem, currentStep, steps }) => {
  const [error, setError] = useState({
    title: "",
    description: "",
    image: "",
    conditions: "",
  });
  const [imagePreview, setImagePreview] = useState(promotionDetails.image ? URL.createObjectURL(promotionDetails.image) : "");
  const [isValid, setIsValid] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  // Manejar los cambios en los campos de texto
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPromotionDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onDrop = React.useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
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
    },
    [setPromotionDetails]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/jpg": [],
    },
    maxFiles: 1,
    onDropRejected: () => {
      setError((prev) => ({
        ...prev,
        image: "El archivo debe ser una imagen en formato JPG, JPEG o PNG.",
      }));
    },
  });

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
    setShowErrors(true);
    return isValid;
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
      <h2 className='text-2xl font-bold text-main mb-4'>Detalles de la promoción</h2>

      <div className='mt-4 space-y-2'>
        <label htmlFor='title' className='font-bold'>
          Título de la promoción
        </label>
        <p className='italic text-gray-500 pb-2 text-xs'>Ej. Tu negocio de premia por unirte a nuestra comunidad.</p>
        <input
          id='title'
          name='title'
          type='text'
          value={promotionDetails.title || ""}
          onChange={handleChange}
          className='w-full p-4 h-14 border  bg-white border-main rounded-md'
          placeholder='Escribe el título'
        />
        {showErrors && error.title && <p className='text-red-500 text-sm'>{error.title}</p>}
      </div>

      <div className='mt-4 space-y-2'>
        <label htmlFor='description'>Descripción</label>
        <p className='italic text-gray-500 pb-2 text-xs'>
           {selectedSystem === "points" ? "Ej. Por cada compra de $10.000 consigues 1 punto" : "Obtén un 15% de descuento en tu primer pedido"}.
        </p>{" "}
        <textarea
          id='description'
          name='description'
          value={promotionDetails.description || ""}
          onChange={handleChange}
          className='w-full p-4 h-16 border  bg-white border-main rounded-md'
          placeholder='Describe tu promoción'
        />
        {showErrors && error.description && <p className='text-red-500 text-sm'>{error.description}</p>}
      </div>

      <div className='mt-4 space-y-2'>
        <label htmlFor='conditions'>Condiciones de la promoción</label>
        <p className='italic text-gray-500 pb-2 text-xs'>Ej. Cuando expira la promocion o si aplica a ciertos productos.</p>{" "}
        <textarea
          id='conditions'
          name='conditions'
          value={promotionDetails.conditions || ""}
          onChange={handleChange}
          className='w-full p-4 h-24 border  bg-white border-main rounded-md'
          placeholder='Escribe las condiciones de la promoción'
        />
        {showErrors && error.conditions && <p className='text-red-500 text-sm'>{error.conditions}</p>}
      </div>

      <div className='mt-4 space-y-2'>
        <label>Imagen de la promoción</label>
        <div {...getRootProps()} className='border-2 border-dashed border-main rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50 transition-colors'>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Suelta la imagen aquí...</p>
          ) : (
            <div>
              <p>Arrastra y suelta una imagen aquí, o haz clic para seleccionar</p>
              <p className='text-sm text-gray-500 mt-2'>Solo archivos JPG, JPEG o PNG</p>
            </div>
          )}
        </div>
        {showErrors && error.image && <p className='text-red-500 text-sm'>{error.image}</p>}
        {imagePreview && (
          <div className='mt-4'>
            <img src={imagePreview} alt='Vista previa' className='w-32 h-32 object-cover text-center m-auto' />
          </div>
        )}
      </div>
    </motion.div>
  );
};
