import { Button, Input } from "@mui/material";
import { useState } from "react";
import { Billing } from "./views/Billing";
import { Customization } from "./views/Customization";
import { Subscript } from "@mui/icons-material";
import { Subscription } from "./views/Subscription";
import { AccountSettings } from "./views/AccountSettings";
import { useAuthSlice } from "../../../hooks/useAuthSlice";
import { LandingSettings } from "./views/LandingSettings";

export const Settings = () => {
  const [selectedSection, setSelectedSection] = useState("Personalización");
  const { user } = useAuthSlice();

  // Definición de las secciones simplificadas
  const sections = [
    { id: "1", label: "Personalización" },
    { id: "2", label: "Ajustes de cuenta" },
    { id: "3", label: "Suscripción" },
    { id: "4", label: "Landing Page" }, // New section
  ];

  const renderSection = () => {
    switch (selectedSection) {
      case "Ajustes de cuenta":
        return <AccountSettings />;
      case "Personalización":
        return <Customization />;
      case "Suscripción":
        return <Subscription />;
      case "Factura":
        return <Billing />;
      case "Landing Page":
        return <LandingSettings />;
      default:
        return null;
    }
  };

  return (
    <div className='flex justify-center items-start w-full h-full pt-10 px-4 sm:px-6 lg:px-8'>
      <div className='w-full max-w-7xl md:ml-0 bg-white rounded-lg shadow'>
        {/* Navegación con pestañas */}
        <div className='bg-gray-100 rounded-t-lg overflow-x-auto'>
          <nav className='flex flex-nowrap min-w-full'>
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setSelectedSection(section.label)}
                className={`px-4 sm:px-6 py-2 text-sm font-medium transition-colors whitespace-nowrap
                  ${selectedSection === section.label ? "bg-main text-white rounded-none" : " rounded-none text-gray-500 hover:text-gray-700 bg-white"}`}
              >
                {section.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Contenido */}
        <div className='p-4 sm:p-6'>{renderSection()}</div>
      </div>
    </div>
  );
};
