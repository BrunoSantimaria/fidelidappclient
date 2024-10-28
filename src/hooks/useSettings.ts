import React, { useState } from "react";
import { useAuthSlice } from "./useAuthSlice";
import { log } from "console";
import api from "../utils/api";
import { toast } from "react-toastify";

export const useSettings = () => {
  const { user, refreshAccount } = useAuthSlice();
  const [loading, setLoading] = useState(false);
  const accountId = user.accounts._id;
  const base64ToBlob = (base64Data, contentType) => {
    const byteCharacters = atob(base64Data.split(",")[1]);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: contentType });
  };

  const handleCustomization = async (settings) => {
    const formData = new FormData();

    formData.append("accountId", accountId);
    if (settings.logo) {
      formData.append("logo", settings.logo); // Adjunta el archivo solo si existe
    }
    formData.append(
      "socialMedia",
      JSON.stringify({
        instagram: settings.instagram || "", // Asegúrate de que sean cadenas
        facebook: settings.facebook || "",
        whatsapp: settings.whatsapp || "",
      })
    );

    setLoading(true);
    try {
      const resp = await api.post(`/accounts/settings/customize`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      refreshAccount();
      toast.info("Configuración actualizada");
    } catch (error) {
      console.error("Error en la personalización:", error);
    } finally {
      setLoading(false);
    }
  };
  return { handleCustomization, loading };
};
