import { Button, Input } from "@mui/material";
import { useState } from "react";
import { Billing } from "./views/Billing";
import { Customization } from "./views/Customization";
import { Subscript } from "@mui/icons-material";
import { Subscription } from "./views/Subscription";

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
        return (
          <div className=''>
            <h2 className='text-2xl font-bold mb-4'>Ajustes de cuenta</h2>

            <div className='flex flex-col space-y-6 '>
              <div>
                <label className='block'>Nombre de usuario</label>
                <Input type='text' className='w-full border rounded p-2' value='FidelidApp' />
              </div>

              <div>
                <label className='block'>Email</label>
                <Input type='email' className='w-full border rounded p-2' value='contacto@fidelidapp.cl' />
              </div>
              <div>
                <label className='block'>Télefono</label>
                <Input type='text' className='w-full border rounded p-2' value='+380990760179' />
              </div>
            </div>
            <div className='flex gap-4 mt-4'>
              <Button variant='contained' className='bg-blue-500 text-white p-2 rounded'>
                Guardar cambios
              </Button>
              <Button className='text-gray-500 p-2 rounded'>Cancelar</Button>
            </div>
          </div>
        );
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
    <div className='flex h-screen ml-20 mt-12'>
      {/* Barra de navegación lateral */}
      <nav className='w-64 bg-gray-100 p-6 bg-gradient-to-br from-gray-50 to-main/20 h-fit ml-2 rounded-md'>
        <div className='mb-6 text-center'>
          <img src='https://res.cloudinary.com/di92lsbym/image/upload/v1727803250/mdrcrkxgoufdqb4aqfyb.png' alt='Avatar' className='rounded-full mx-auto' />
          <p className='mt-2 text-lg font-bold'>FidelidApp</p>
        </div>

        <ul className='space-y-4'>
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

      {/* Contenido de la sección seleccionada */}
      <div className='flex-grow p-10'>{renderSection()}</div>
    </div>
  );
};
