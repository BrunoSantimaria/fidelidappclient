import { Button, Input } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useSettings } from "../../../../hooks/useSettings";
import { useAuthSlice } from "../../../../hooks/useAuthSlice";
import { motion } from "framer-motion";

export const Customization = () => {
  const { user, refreshAccount } = useAuthSlice();
  const { handleCustomization, loading } = useSettings();

  // Asegúrate de que user y user.accounts estén definidos
  if (!user || !user.accounts) {
    return <div>Cargando...</div>; // Representación de carga
  }

  const initialLogo = user.accounts.logo || "";
  console.log();

  const socialMedia = user.accounts.socialMedia || {}; // Cambia aquí
  const initialInstagram = socialMedia.instagram || "";
  const initialFacebook = socialMedia.facebook || "";
  const initialWhatsapp = socialMedia.whatsapp || "";

  const [logo, setLogo] = useState(initialLogo);
  const [logoPreview, setLogoPreview] = useState(initialLogo);
  const [instagram, setInstagram] = useState(initialInstagram);
  const [facebook, setFacebook] = useState(initialFacebook);
  const [whatsapp, setWhatsapp] = useState(initialWhatsapp);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    } else {
      setLogo(null);
      setLogoPreview(null);
    }
  };

  const handleCancel = () => {
    setLogo(initialLogo);
    setLogoPreview(null);
    setInstagram(initialInstagram);
    setFacebook(initialFacebook);
    setWhatsapp(initialWhatsapp);
  };

  const handleSubmit = async () => {
    const settings = {
      logo,
      instagram,
      facebook,
      whatsapp,
    };
    handleCustomization(settings);
    await refreshAccount();
  };

  useEffect(() => {
    const isSame = logo === initialLogo && instagram === initialInstagram && facebook === initialFacebook && whatsapp === initialWhatsapp;
    setIsSaveDisabled(isSame);
  }, [logo, instagram, facebook, whatsapp]);
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };
  return (
    <motion.div initial='hidden' whileInView='visible' variants={fadeIn} transition={{ duration: 0.5 }}>
      <div className='w-[95%] m-auto flex flex-col md:ml-20 h-screen'>
        <h2 className='text-2xl font-bold mb-4'>Personalización</h2>

        {/* Input para el logo */}
        <div className='mb-4'>
          <label className='block mb-2'>Logo de la cuenta</label>
          <Input type='file' className='w-full border rounded p-2' accept='image/*' onChange={handleLogoChange} />
          {logoPreview && <img src={logoPreview} alt='Logo preview' className='mt-4 w-32 h-32 object-cover' />}
        </div>

        {/* Redes sociales */}
        <div className='mb-4'>
          <label className='block mb-2'>Instagram</label>
          <Input
            type='text'
            className='w-full border rounded p-2'
            placeholder='URL de tu cuenta de Instagram'
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
          />
        </div>

        <div className='mb-4'>
          <label className='block mb-2'>Facebook</label>
          <Input
            type='text'
            className='w-full border rounded p-2'
            placeholder='URL de tu cuenta de Facebook'
            value={facebook}
            onChange={(e) => setFacebook(e.target.value)}
          />
        </div>

        <div className='mb-4'>
          <label className='block mb-2'>WhatsApp</label>
          <Input
            type='text'
            className='w-full border rounded p-2'
            placeholder='Número de WhatsApp'
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
          />
        </div>

        {/* Botones de guardar y cancelar */}
        <div className='flex gap-4 mt-4'>
          <Button
            variant='contained'
            className={`bg-blue-500 text-white p-2 rounded ${isSaveDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isSaveDisabled || loading}
            onClick={handleSubmit}
          >
            Guardar Cambios
          </Button>
          <Button variant='outlined' className='text-gray-500 p-2 rounded' onClick={handleCancel}>
            Cancelar
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
