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

interface AuthProps {
  accountId: string;
  onAuthSuccess: () => void;
}

export function AuthDialog({ accountId, onAuthSuccess }: AuthProps) {
  const [isRegistering, setIsRegistering] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();
  const { login, registerAccount } = useAuth();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^\d{9,}$/.test(phone);
  };

  const formatName = (name: string) =>
    name
      .trim()
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());

  // Función para manejar el registro
  const handleRegister = async () => {
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
      console.log("🚀 ~ handleRegister ~ clientId:", clientId);
      const token = response.data?.token ?? "";

      login(accountId, clientId, token, clientId);
      registerAccount(accountId, clientId);

      const existingAccounts = JSON.parse(localStorage.getItem("addedAccounts") || "[]");
      const updatedAccounts = [...new Set([...existingAccounts, { accountId, name: response.data?.account?.name ?? "Unknown" }])];
      localStorage.setItem("addedAccounts", JSON.stringify(updatedAccounts));

      const existingPromotions = JSON.parse(localStorage.getItem("addedPromotions") || "[]");
      const updatedPromotions = [...new Set([...existingPromotions, ...(response.data?.addedPromotions ?? [])])];
      localStorage.setItem("addedPromotions", JSON.stringify(updatedPromotions));

      toastify.success(`Registro Exitoso.`);

      onAuthSuccess();
    } catch (error: any) {
      console.log(error);
      if (error.response.data.error === "El cliente ya está registrado en esta cuenta") return toastify.info("Ya te encuentras asociado a la cuenta.");
      toastify.error(error);
    }
  };

  // Función para manejar el inicio de sesión
  const handleLogin = async () => {
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

      // Obtener clientId, token y accountId de la respuesta de la API
      const clientId = response.data?.clientId ?? "";
      const token = response.data?.token ?? "";

      console.log(response.data);
      console.log("🚀 ~ handleLogin ~ clientId:", clientId);
      console.log("🚀 ~ handleLogin ~ token:", token);
      console.log("🚀 ~ handleLogin ~ accountId:", accountId); // Verifica el valor del accountId

      // Ahora utilizas el accountId dinámico obtenido
      login(accountId, accountId, token, clientId); // Llamas a login con el accountId correcto

      // Llamar al callback de éxito de autenticación
      onAuthSuccess();
    } catch (error: any) {
      toast({
        title: "Inicio de Sesión Fallido",
        description: error.response?.data?.error || "Ocurrió un error durante el inicio de sesión",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    console.log("isRegistering:", isRegistering);

    if (isRegistering) {
      handleRegister();
    } else {
      handleLogin();
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className='bg-[#28292d] w-full  mx-auto flex flex-col justify-center'>
        <CardContent className='p-6'>
          <form onSubmit={handleSubmit} className='space-y-4'>
            <h2 className='text-xl font-semibold text-white'>{isRegistering ? "Regístrate" : "Inicia sesión"}</h2>
            {isRegistering && (
              <Input
                type='text'
                placeholder='Tu nombre completo'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className='bg-[#3a3b40] border-gray-600 text-white placeholder-gray-400'
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
              className='bg-[#3a3b40] border-gray-600 text-white placeholder-gray-400'
            />
            {errors.email && <p className='text-red-400 text-sm'>{errors.email}</p>}
            {isRegistering && (
              <Input
                type='tel'
                placeholder='Tu número de teléfono'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required={isRegistering}
                className='bg-[#3a3b40] border-gray-600 text-white placeholder-gray-400'
              />
            )}
            {errors.phone && isRegistering && <p className='text-red-400 text-sm'>{errors.phone}</p>}
            <Button type='submit' className='w-full bg-[#4a4b50] hover:bg-[#5a5b60] text-white font-bold'>
              {isRegistering ? "Regístrate" : "Iniciar sesión"}
            </Button>
            <p className='text-sm text-gray-400 text-center mt-2'>
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
