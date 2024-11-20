import { Button, Input, Tooltip } from "@mui/material";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import { motion } from "framer-motion";
import { useAuthSlice } from "../../../../hooks/useAuthSlice";
import { useState, useEffect } from "react";
import api from "../../../../utils/api";
import { toast } from "react-toastify";
import { Settings } from "@mui/icons-material";

export const AccountSettings = () => {
  const { user, refreshAccount } = useAuthSlice();
  const [name, setName] = useState(user?.accounts.name || "");
  const [senderEmail, setSenderEmail] = useState(user?.accounts.senderEmail || "");
  const [phone, setPhone] = useState(user?.accounts.phone || "");
  const [error, setError] = useState("");
  const [isModified, setIsModified] = useState(false);

  // Efecto para verificar cambios en los campos de entrada
  useEffect(() => {
    setIsModified(name !== user?.accounts.name || senderEmail !== user?.accounts.senderEmail || phone !== user?.accounts.phone);
  }, [name, senderEmail, phone, user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validación: Nombre no vacío y senderEmail no vaciar si tenía un valor inicial
    if (!name.trim()) {
      setError("El nombre de usuario no puede estar vacío.");
      return;
    }
    if (!senderEmail.trim() && user?.accounts.senderEmail) {
      setError("El sender email no puede dejarse vacío.");
      return;
    }

    // Crear el objeto `settings` con solo los campos modificados
    const settings: Partial<typeof user.accounts> = {};
    if (name !== user?.accounts.name) settings.name = name;
    if (senderEmail !== user?.accounts.senderEmail) settings.senderEmail = senderEmail;
    if (phone !== user?.accounts.phone) settings.phone = phone;

    try {
      await api.put("/accounts/settings/account", { accountId: user?.accounts._id, settings });
      setError(""); // Limpiar errores después de una actualización exitosa
      toast.info("Ajustes actualizados correctamente.");
      await refreshAccount();
    } catch (error) {
      console.error("Error guardando ajustes:", error);
      setError("Hubo un problema al guardar los ajustes.");
    }
  };

  return (
    <div className='w-full'>
      {/* Encabezado */}
      <div className='flex items-center gap-2 mb-4'>
        <span className='text-main'>
          <Settings />
        </span>
        <h2 className='text-lg text-gray-700'>Configuración de la Cuenta</h2>
      </div>
      <p className='text-sm text-gray-600 mb-6'>Administra la configuración de tu cuenta y preferencias</p>

      {/* Campos del formulario */}
      <div className='space-y-4'>
        <div>
          <label className='block text-sm font-medium mb-2'>Nombre de tu negocio</label>
          <div className='flex items-center border rounded-lg focus-within:border-main bg-white'>
            <input
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              className='w-full p-2 outline-none bg-white focus:ring-0'
              placeholder='Nombre negocio'
            />
          </div>
        </div>

        <div>
          <div className='flex items-center gap-1 mb-2'>
            <label className='block text-sm font-medium'>Sender Email</label>
            <Tooltip
              title='Sender email: Dirección desde la cual se enviarán tus correos de marketing. Usar un correo de tu empresa, como contacto@fidelid.app, ayuda a que los destinatarios te identifiquen fácilmente.'
              arrow
            >
              <InfoOutlined fontSize='small' color='action' />
            </Tooltip>
          </div>
          <div className='flex items-center border rounded-lg focus-within:border-main bg-white'>
            <input
              type='email'
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              className='w-full p-2 outline-none bg-white focus:ring-0'
              placeholder='info@empresa.com'
            />
          </div>
        </div>

        <div>
          <label className='block text-sm font-medium mb-2'>Teléfono</label>
          <div className='flex items-center border rounded-lg focus-within:border-main bg-white'>
            <input
              type='text'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className='w-full p-2 outline-none bg-white focus:ring-0'
              placeholder='Número de teléfono'
            />
          </div>
        </div>

        {error && <p className='text-red-500'>{error}</p>}

        <div className='flex justify-end gap-4 mt-6'>
          <button
            className='px-4 py-2 text-gray-600 bg-white border border-main hover:bg-gray-100 rounded'
            onClick={() => {
              setName(user?.name || "");
              setSenderEmail(user?.accounts.senderEmail || "");
              setPhone(user?.phone || "");
              setError("");
            }}
          >
            Cancelar
          </button>
          <button className='px-4 py-2 bg-main text-white rounded hover:bg-main/80' onClick={handleSubmit} disabled={!isModified}>
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
};
