"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import api from "@/utils/api";
import { useAuth } from "./AuthContext";
import { Toaster } from "@/components/ui/toaster";
import { motion } from "framer-motion";
import { toast as toastify } from "../../utils/toast";
import { useNavigate } from "react-router-dom";
import { useNavigateTo } from "@/hooks/useNavigateTo";

interface AuthProps {
  accountId: string;
  onAuthSuccess: () => void;
  selectedPalette: any;
  slug: string;
}

const countryPrefixes = [
  { country: "Chile", prefix: "+56", emoji: "🇨🇱", code: "CL" },
  { country: "Argentina", prefix: "+54", emoji: "🇦🇷", code: "AR" },
  { country: "Perú", prefix: "+51", emoji: "🇵🇪", code: "PE" },
  { country: "Colombia", prefix: "+57", emoji: "🇨🇴", code: "CO" },
  { country: "México", prefix: "+52", emoji: "🇲🇽", code: "MX" },
  { country: "Brasil", prefix: "+55", emoji: "🇧🇷", code: "BR" },
  { country: "Uruguay", prefix: "+598", emoji: "🇺🇾", code: "UY" },
  { country: "Paraguay", prefix: "+595", emoji: "🇵🇾", code: "PY" },
  { country: "Bolivia", prefix: "+591", emoji: "🇧🇴", code: "BO" },
  { country: "Ecuador", prefix: "+593", emoji: "🇪🇨", code: "EC" },
  { country: "Venezuela", prefix: "+58", emoji: "🇻🇪", code: "VE" },
];

export function AuthDialog({ accountId, onAuthSuccess, selectedPalette, slug }: AuthProps) {
  const [isRegistering, setIsRegistering] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedPrefix, setSelectedPrefix] = useState("+56");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();
  const { login, registerAccount } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { handleNavigate } = useNavigateTo();

  const validateEmail = (email: string) => {
    // Lista extensa de dominios de nivel superior comunes
    const validTLDs =
      /\.(com|net|org|edu|gov|mil|io|dev|info|biz|xyz|app|online|site|web|cloud|me|tv|co|ai|com\.ar|com\.mx|com\.br|com\.co|com\.cl|com\.pe|com\.uy|com\.ec|com\.ve|ar|mx|br|co|cl|pe|uy|ec|ve|uk|es|fr|it|de|nl|pt|ru|jp|cn|kr|in|au|nz)$/i;

    // Validación completa del email
    const emailRegex = new RegExp(`^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+${validTLDs.source}`);

    return emailRegex.test(email);
  };

  const validatePhone = (phone: string) => {
    // Elimina el prefijo del país (comienza con +) y cualquier espacio
    const numberWithoutPrefix = phone.replace(/^\+\d{2,4}/, "");
    // Verifica que el número (sin prefijo) tenga al menos 8 dígitos
    return /^\d{6,}$/.test(numberWithoutPrefix);
  };

  const formatName = (name: string) =>
    name
      .trim()
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());

  // Función para manejar el registro
  const handleRegister = async () => {
    setIsLoading(true);
    const formattedName = formatName(name);
    const formattedEmail = email.trim().toLowerCase();
    const formattedPhone = `${selectedPrefix}${phoneNumber.trim()}`;

    const newErrors: { [key: string]: string } = {};

    if (formattedName.length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres";
    }

    if (!validateEmail(formattedEmail)) {
      newErrors.email = "Correo electrónico inválido";
    }

    if (!validatePhone(phoneNumber)) {
      newErrors.phone = "Número de teléfono inválido";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post("/api/landing/register", {
        name: formattedName,
        email: formattedEmail,
        phone: formattedPhone,
        accountId,
      });

      const clientId = response.data?.clientId ?? "";
      const token = response.data?.token ?? "";

      login(accountId, clientId, token, clientId);
      registerAccount(accountId, clientId);

      const existingAccounts = JSON.parse(localStorage.getItem("addedAccounts") || "[]");
      const updatedAccounts = [...new Set([...existingAccounts, { accountId, name: response.data?.account?.name ?? "Unknown" }])];
      localStorage.setItem("addedAccounts", JSON.stringify(updatedAccounts));

      const existingPromotions = JSON.parse(localStorage.getItem("addedPromotions") || "[]");
      const updatedPromotions = [...new Set([...existingPromotions, ...(response.data?.addedPromotions ?? [])])];
      localStorage.setItem("addedPromotions", JSON.stringify(updatedPromotions));

      toastify.success("¡Registro exitoso! Bienvenido/a.");
      //handleNavigate(`/landing/${slug}/fidelicard/${clientId}`);
      onAuthSuccess();
    } catch (error: any) {
      if (error.response?.data?.error === "El cliente ya está registrado en esta cuenta") {
        toastify.info("Ya te encuentras asociado a la cuenta.");
      } else {
        toastify.error("Error al registrar: " + (error.response?.data?.error || "Error desconocido"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Función para manejar el inicio de sesión
  const handleLogin = async () => {
    setIsLoading(true);
    const formattedEmail = email.trim().toLowerCase();

    const newErrors: { [key: string]: string } = {};

    if (!validateEmail(formattedEmail)) {
      newErrors.email = "Correo electrónico inválido";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await api.post("/api/landing/login", {
        email: formattedEmail,
        accountId: accountId,
      });

      const clientId = response.data?.clientId ?? "";
      const token = response.data?.token ?? "";

      login(accountId, accountId, token, clientId);
      toastify.success("¡Inicio de sesión exitoso!");
      //handleNavigate(`/landing/${slug}/fidelicard/${clientId}`);
      onAuthSuccess();
    } catch (error: any) {
      toastify.error("Error al iniciar sesión: " + (error.response?.data?.error || "Error desconocido"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (isRegistering) {
      handleRegister();
    } else {
      handleLogin();
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className={`${selectedPalette.cardBackground} w-full mx-auto flex flex-col justify-center`}>
        <CardContent className='p-6'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <h2 className={`${selectedPalette.textPrimary} text-xl font-semibold`}>{isRegistering ? "Regístrate" : "Inicia sesión"}</h2>
            {isRegistering && (
              <Input
                type='text'
                name='name'
                placeholder='Tu nombre completo'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoComplete='name'
                className={`${selectedPalette.cardBackground} border-gray-600 ${selectedPalette.textPrimary} placeholder-gray-400`}
              />
            )}
            {errors.name && <p className='text-red-400 text-sm'>{errors.name}</p>}
            <Input
              type='email'
              name='email'
              placeholder='Tu correo electrónico'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`${selectedPalette.cardBackground} border-gray-600 ${selectedPalette.textPrimary} placeholder-gray-400`}
            />
            {errors.email && <p className='text-red-400 text-sm'>{errors.email}</p>}
            {isRegistering && (
              <div className='space-y-2'>
                <div className='flex gap-2'>
                  <select
                    value={selectedPrefix}
                    onChange={(e) => setSelectedPrefix(e.target.value)}
                    className={`${selectedPalette.cardBackground} border-gray-600 ${selectedPalette.textPrimary} rounded-md p-2 w-1/3 `}
                  >
                    {countryPrefixes.map((country) => (
                      <option key={country.prefix} value={country.prefix} className={`${selectedPalette.cardBackground} ${selectedPalette.textPrimary}`}>
                        {country.code} {country.prefix}
                      </option>
                    ))}
                  </select>
                  <Input
                    type='tel'
                    placeholder='Número de teléfono'
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                    className={`${selectedPalette.cardBackground} border-gray-600 ${selectedPalette.textPrimary} w-2/3`}
                    required
                  />
                </div>
                {errors.phone && <p className='text-red-400 text-sm'>{errors.phone}</p>}
              </div>
            )}
            <Button
              type='submit'
              className={`${selectedPalette.buttonBackground} ${selectedPalette.textPrimary} hover:${selectedPalette.buttonHover} w-full text-white font-bold`}
              disabled={isLoading}
              style={{
                color: selectedPalette?.textPrimary.split("[")[1].split("]")[0],
              }}
            >
              {isLoading ? (
                <div className='flex items-center justify-center'>
                  <div className={`w-5 h-5 border-2 border-t-2 border-white rounded-full animate-spin mr-2 ${selectedPalette.textPrimary}`}></div>
                  {isRegistering ? "Registrando..." : "Iniciando sesión..."}
                </div>
              ) : isRegistering ? (
                "Regístrate"
              ) : (
                "Iniciar sesión"
              )}
            </Button>
            <p className={`${selectedPalette.textSecondary} text-sm text-center mt-2`}>
              {isRegistering ? "¿Ya estás registrado?" : "¿No tienes cuenta?"}{" "}
              <span onClick={() => setIsRegistering(!isRegistering)} className={`${selectedPalette.textPrimary} cursor-pointer hover:underline`}>
                {isRegistering ? "Iniciar sesión" : "Regístrate"}
              </span>
            </p>
          </form>
          <Toaster />
        </CardContent>
      </Card>
    </motion.div>
  );
}
