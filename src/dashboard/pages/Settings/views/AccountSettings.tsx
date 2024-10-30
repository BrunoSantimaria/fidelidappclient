import { Button, Input, Tooltip } from "@mui/material";
import InfoOutlined from "@mui/icons-material/InfoOutlined";
import { motion } from "framer-motion";
import { useAuthSlice } from "../../../../hooks/useAuthSlice";
import { useState, useEffect } from "react";
import api from "../../../../utils/api";
import { toast } from "react-toastify";

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
    <motion.div
      initial='hidden'
      whileInView='visible'
      variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
      transition={{ duration: 0.5 }}
    >
      <div className='w-[95%] m-auto flex flex-col md:ml-20'>
        <h2 className='text-2xl font-bold mb-4'>Ajustes de cuenta</h2>

        <form onSubmit={handleSubmit} className='flex flex-col space-y-6'>
          <div>
            <label className='block'>Nombre de tu negocio</label>
            <Input type='text' placeholder='Nombre negocio' className='w-full border rounded p-2' value={name} onChange={(e) => setName(e.target.value)} />
          </div>

          <div>
            <div className='flex items-center space-x-1'>
              <label className='block'>Sender Email</label>
              <Tooltip
                title='Sender email: Dirección desde la cual se enviarán tus correos de marketing. Usar un correo de tu empresa, como contacto@fidelid.app, ayuda a que los destinatarios te identifiquen fácilmente.'
                arrow
              >
                <InfoOutlined fontSize='small' color='action' />
              </Tooltip>
            </div>
            <Input
              type='email'
              disabled
              placeholder='info@empresa.com'
              className='w-full border rounded p-2'
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
            />
          </div>

          <div>
            <label className='block'>Teléfono</label>
            <Input
              type='text'
              placeholder='Número de teléfono'
              className='w-full border rounded p-2'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {error && <p className='text-red-500'>{error}</p>}

          <div className='flex gap-4 mt-4'>
            <Button type='submit' variant='contained' className='bg-blue-500 text-white p-2 rounded' disabled={!isModified}>
              Guardar cambios
            </Button>
            <Button
              className='text-gray-500 p-2 rounded'
              onClick={() => {
                setName(user?.name || "");
                setSenderEmail(user?.accounts.senderEmail || "");
                setPhone(user?.phone || "");
                setError("");
              }}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};
