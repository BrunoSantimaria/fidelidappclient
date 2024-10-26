import React from "react";
import { useAuthSlice } from "./useAuthSlice";

export const useSettings = () => {
  const { user } = useAuthSlice();
  const accountId = user.accounts._id;
  const handleCustomization = (settings) => {
    console.log(settings);
    const socialMedia = {
      instagram: settings.instagram,
      facebook: settings.facebook,
      whatsapp: settings.whatsapp,
    };
    const logo = settings.logo;

    const formData = new FormData();
    formData.append("logo", logo);
    formData.append("socialMedia", JSON.stringify(socialMedia));
    formData.append("accountId", accountId);
    console.log(formData);
  };

  return { handleCustomization };
};
