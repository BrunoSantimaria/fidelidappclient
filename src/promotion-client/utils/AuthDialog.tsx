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
}

export function AuthDialog({ accountId, onAuthSuccess, selectedPalette, slug }: AuthProps) {
  const [isRegistering, setIsRegistering] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
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
    return /^\+?\d{6,}$/.test(phone);
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
    const formattedPhone = phone.trim();

    const newErrors: { [key: string]: string } = {};

    if (formattedName.length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres";
    }

    if (!validateEmail(formattedEmail)) {
      newErrors.email = "Correo electrónico inválido";
    }

    if (!validatePhone(formattedPhone)) {
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
              <Input
                type='tel'
                name='phone'
                placeholder='Tu número de teléfono'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required={isRegistering}
                autoComplete='tel'
                className={`${selectedPalette.cardBackground} border-gray-600 ${selectedPalette.textPrimary} placeholder-gray-400`}
              />
            )}
            {errors.phone && isRegistering && <p className='text-red-400 text-sm'>{errors.phone}</p>}
            <Button
              type='submit'
              className={`${selectedPalette.buttonBackground} hover:${selectedPalette.buttonHover} w-full text-white font-bold`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className='flex items-center justify-center'>
                  <div className='w-5 h-5 border-2 border-t-2 border-white rounded-full animate-spin mr-2'></div>
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
              <span onClick={() => setIsRegistering(!isRegistering)} className='text-white cursor-pointer hover:underline'>
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
