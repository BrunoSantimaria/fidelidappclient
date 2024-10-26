import { Button, Input } from "@mui/material";
import React, { useState, useEffect } from "react";
import { useSettings } from "../../../../hooks/useSettings";

export const Customization = () => {
  const { handleCustomization } = useSettings();
  const initialLogo = null;
  const initialInstagram = "";
  const initialFacebook = "";
  const initialWhatsapp = "";

  const [logo, setLogo] = useState(initialLogo);
  const [instagram, setInstagram] = useState(initialInstagram);
  const [facebook, setFacebook] = useState(initialFacebook);
  const [whatsapp, setWhatsapp] = useState(initialWhatsapp);
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  // Función para manejar la carga de imagen
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result); // Guardar el logo en base64
      };
      reader.readAsDataURL(file);
    } else {
      setLogo(null);
    }
  };

  // Función para limpiar todos los campos
  const handleCancel = () => {
    setLogo(initialLogo);
    setInstagram(initialInstagram);
    setFacebook(initialFacebook);
    setWhatsapp(initialWhatsapp);
  };
  const handleSubmit = () => {
    const settings = {
      logo,
      instagram,
      facebook,
      whatsapp,
    };
    handleCustomization(settings);
  };
  // Efecto para verificar si los valores han cambiado
  useEffect(() => {
    const isSame = logo === initialLogo && instagram === initialInstagram && facebook === initialFacebook && whatsapp === initialWhatsapp;

    setIsSaveDisabled(isSame);
  }, [logo, instagram, facebook, whatsapp]);

  return (
    <div>
      <h2 className='text-2xl font-bold mb-4'>Personalización</h2>

      {/* Input para el logo */}
      <div className='mb-4'>
        <label className='block mb-2'>Logo de la cuenta</label>
        <Input type='file' className='w-full border rounded p-2' accept='image/*' onChange={handleLogoChange} />
        {/* Vista previa del logo */}
        {logo && <img src={logo} alt='Logo preview' className='mt-4 w-32 h-32 object-cover' />}
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
          disabled={isSaveDisabled}
          onClick={handleSubmit}
        >
          Guardar Cambios
        </Button>
        <Button variant='outlined' className='text-gray-500 p-2 rounded' onClick={handleCancel}>
          Cancelar
        </Button>
      </div>
    </div>
  );
};
