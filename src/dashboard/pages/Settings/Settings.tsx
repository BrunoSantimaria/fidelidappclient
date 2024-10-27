import { Button, Input } from "@mui/material";
import { useState } from "react";
import { Billing } from "./views/Billing";
import { Customization } from "./views/Customization";
import { Subscript } from "@mui/icons-material";
import { Subscription } from "./views/Subscription";
import { AccountSettings } from "./views/AccountSettings";
import tagManager from "react-gtm-module";
export const Settings = () => {
  const [selectedSection, setSelectedSection] = useState("Ajustes de cuenta");

  const sections = [
    { id: "account", label: "Ajustes de cuenta", icon: "⚙️" },
    { id: "personal", label: "Personalización", icon: "🛠️" },
    { id: "privacy", label: "Suscripción", icon: "💳" },
    { id: "notifications", label: "Factura", icon: "🧾" },
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
    <div className='flex h-screen w-screen md:w-[95%] m-auto  mt-0 flex-col '>
      <nav className='flex flex-col md:flex md:flex-row w-[95%]  justify-around m-auto md:ml-40  p-6 h-fit  rounded-md'>
        <div className=' text-center md:mr-20'>
          <img
            src='https://res.cloudinary.com/di92lsbym/image/upload/v1727803250/mdrcrkxgoufdqb4aqfyb.png'
            alt='Avatar'
            className='rounded-full mx-auto w-36 '
          />
          <p className='mt-2 text-lg font-bold mb-2'>FidelidApp</p>
        </div>

        <ul className='space-y-4 md:w-[50%]'>
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

      <div className='flex-grow p-6 md:p-10'>{renderSection()}</div>
    </div>
  );
};
