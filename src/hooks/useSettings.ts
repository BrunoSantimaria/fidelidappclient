import React from "react";
import { useAuthSlice } from "./useAuthSlice";
import { log } from "console";
import api from "../utils/api";

export const useSettings = () => {
  const { user } = useAuthSlice();
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
    const data = {
      logo: settings.logo,
      socialMedia: {
        instagram: settings.instagram,
        facebook: settings.facebook,
        whatsapp: settings.whatsapp,
      },
    };

    try {
      const resp = await api.put("/accounts/settings/customize", data);
      console.log(resp);
    } catch (error) {
      console.log(error);
    }
  };
  return { handleCustomization };
};
