import { Alert, Button, Input } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useSettings } from "../../../../hooks/useSettings";
import { useAuthSlice } from "../../../../hooks/useAuthSlice";
import { motion } from "framer-motion";
import { Settings, Upload, Instagram, Facebook, WhatsApp, Language } from "@mui/icons-material";

export const Customization = () => {
  const { user, refreshAccount } = useAuthSlice();
  const { handleCustomization, loading } = useSettings();
  const [logo, setLogo] = useState<File | null>(null);
  const [preview, setPreview] = useState(user?.accounts?.logo || "");
  const [instagram, setInstagram] = useState(user?.accounts?.socialMedia?.instagram || "");
  const [facebook, setFacebook] = useState(user?.accounts?.socialMedia?.facebook || "");
  const [whatsapp, setWhatsapp] = useState(user?.accounts?.socialMedia?.whatsapp || "");
  const [website, setWebsite] = useState(user?.accounts?.socialMedia?.website || "");
  const [onLoadChange, setOnLoadChange] = useState(false);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogo(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    try {
      setOnLoadChange(true);
      const settings = {
        logo,
        instagram,
        facebook,
        whatsapp,
        website,
      };

      await handleCustomization(settings);
      await refreshAccount();
    } catch (error) {
      console.error("Error al guardar los cambios:", error);
      alert("Hubo un error al guardar los cambios. Por favor, intenta de nuevo.");
    } finally {
      setOnLoadChange(false);
    }
  };

  const handleCancel = () => {
    setLogo(null);
    setPreview(user?.accounts?.logo || "");
    setInstagram(user?.accounts?.socialMedia?.instagram || "");
    setFacebook(user?.accounts?.socialMedia?.facebook || "");
    setWhatsapp(user?.accounts?.socialMedia?.whatsapp || "");
    setWebsite(user?.accounts?.socialMedia?.website || "");
  };

  return (
    <div className='w-full'>
      {/* Encabezado */}
      <div className='flex items-center gap-2 mb-4'>
        <span className='text-main'>
          <Settings />
        </span>
        <h2 className='text-lg text-gray-700'>Personalización</h2>
      </div>
      <Alert severity='info' className='text-sm text-gray-600 mb-6'>
        Personaliza la apariencia y la información de tu cuenta. <br></br>Esta información se mostrara en el pie de pagina de las campañas de email y en el
        landing page de tu negocio.
      </Alert>

      {/* Logo de la cuenta - Modificado para incluir preview */}
      <div className='mb-6'>
        <label className='block text-sm font-medium mb-2'>Logo de la cuenta</label>
        <div className='border border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-400'>
          <div className='flex flex-col items-center justify-center'>
            {preview ? <img src={preview} alt='Logo preview' className='w-32 h-32 object-contain mb-4' /> : <Upload className='text-blue-600 mb-2' />}
            <p className='text-sm text-gray-100 mb-2'>Arrastra tu logo aquí o</p>
            <label className='cursor-pointer'>
              <span className='text-sm text-blue-700'>Seleccionar archivo</span>
              <input type='file' className='hidden' onChange={handleFileChange} accept='image/*' />
            </label>
          </div>
        </div>
      </div>

      {/* Redes sociales - Modificar los inputs */}
      <div className='space-y-4'>
        <div>
          <label className='block text-sm font-medium mb-2'>Instagram</label>
          <div className='flex items-center border rounded-lg focus-within:border-main bg-white'>
            <span className='px-3 py-2'>
              <Instagram className='text-main' />
            </span>
            <input
              type='text'
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder='https://instagram.com'
              className='w-full p-2 outline-none bg-white focus:ring-0'
            />
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium mb-2'>Facebook</label>
          <div className='flex items-center border rounded-lg focus-within:border-main bg-white'>
            <span className='px-3 py-2'>
              <Facebook className='text-main' />
            </span>
            <input
              type='text'
              value={facebook}
              onChange={(e) => setFacebook(e.target.value)}
              placeholder='https://facebook.com'
              className='w-full p-2 bg-white outline-none focus:ring-0'
            />
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium mb-2'>WhatsApp</label>
          <div className='flex items-center border rounded-lg focus-within:border-main bg-white'>
            <span className='px-3 py-2'>
              <WhatsApp className='text-main' />
            </span>
            <input
              type='text'
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder='341582526'
              className='w-full p-2 bg-white outline-none focus:ring-0'
            />
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium mb-2'>Página web</label>
          <div className='flex items-center border rounded-lg focus-within:border-main bg-white'>
            <span className='px-3 py-2'>
              <Language className='text-main' />
            </span>
            <input
              type='text'
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder='https://google.com'
              className='w-full bg-white p-2 outline-none focus:ring-0'
            />
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className='flex justify-end gap-4 mt-6'>
        <button className='px-4 py-2 text-gray-600 bg-white border border-main hover:bg-gray-100 rounded' onClick={handleCancel}>
          Cancelar
        </button>
        <button disabled={onLoadChange} className='px-4 py-2 bg-main text-white rounded hover:bg-main/80' onClick={handleSubmit} disabled={loading}>
          Guardar Cambios
        </button>
      </div>
    </div>
  );
};
