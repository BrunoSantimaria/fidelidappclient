import { Button, Input } from "@mui/material";
import { useState } from "react";
import { Billing } from "./views/Billing";
import { Customization } from "./views/Customization";
import { Subscript } from "@mui/icons-material";
import { Subscription } from "./views/Subscription";
import { AccountSettings } from "./views/AccountSettings";
import { useAuthSlice } from "../../../hooks/useAuthSlice";

export const Settings = () => {
  const [selectedSection, setSelectedSection] = useState("Ajustes de cuenta");
  const { user } = useAuthSlice();
  const sections = [
    { id: "1", label: "Ajustes de cuenta", icon: "⚙️" },
    { id: "2", label: "Personalización", icon: "🛠️" },
    // { id: "3", label: "Suscripción", icon: "💳" },
    // { id: "4", label: "Factura", icon: "🧾" },
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
      default:
        return null;
    }
  };

  return (
    <div className='flex flex-col md:flex-row  md:h-screen w-screen md:w-[80%] md:ml-24 m-auto md:mt-40'>
      <nav className='flex flex-col md:flex md:flex-col md:w-[20%] justify-start m-auto md:ml-0 h-screen md:h-[90%] rounded-md'>
        {/* Contenedor del logo y el nombre */}
        <div className='flex flex-col   text-center mb-4'>
          {user?.accounts.logo ? (
            <img src={user?.accounts.logo} alt='Avatar' className='rounded-md bg-gray-500/30  p-4 mx-auto w-20 md:w-36' />
          ) : (
            <div className='rounded-full mx-auto w-24 h-24 bg-main flex items-center text-left justify-center cursor-pointer'>
              <span className='text-slate-200 text-lg'>{user?.name[0]}</span>
            </div>
          )}
          <p className='mt-2 text-lg font-bold'>{user?.accounts.name}</p>
        </div>

        <ul className='p-2 md:space-y-4 flex flex-row flex-wrap md:w-[100%] md:flex-nowrap md:flex md:flex-col'>
          {sections.map((section) => (
            <li
              key={section.id}
              className={`cursor-pointer p-2 rounded hover:bg-blue-200 ${selectedSection === section.label ? "bg-blue-100" : ""}`}
              onClick={() => setSelectedSection(section.label)}
            >
              <span className='mr-2'>{section.icon}</span>
              {section.label}
            </li>
          ))}
        </ul>
      </nav>

      <div className='flex flex-col min-h-screen md:flex-grow p-6 md:p-10'>{renderSection()}</div>
    </div>
  );
};
