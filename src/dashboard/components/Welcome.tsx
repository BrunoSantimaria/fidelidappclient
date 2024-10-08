import { Divider } from "@mui/material";
import { useAuthSlice } from "../../hooks/useAuthSlice";
import { useDashboard } from "../../hooks";

export const Welcome = () => {
  const { user } = useAuthSlice();
  const { plan } = useDashboard();

  return (
    <>
      <section className='flex flex-col   shadow-md shadow-neutral-200 bg-gradient-to-br from-gray-100 to-main/30 space-y-4 p-6 rounded-md m-0 text-left  w-full '>
        <div className='text-2xl font-bold'>¡Bienvenido a FidelidApp, {user.name}!</div>
        <div className='w-full text-left '>
          Aquí encontrarás herramientas diseñadas para mejorar la fidelidad de tus clientes y maximizar el rendimiento de tus programas de fidelización.
        </div>

        <div>
          En este dashboard, podrás:
          <ul className='list-disc ml-5'>
            <li>Monitorear métricas clave como clientes registrados, visitas totales y promociones canjeadas.</li>
            <li>Crear y gestionar programas de fidelización adaptados a tus necesidades.</li>
            <li>Acceder rápidamente a tus agendas y planificar eventos promocionales.</li>
          </ul>
        </div>
        <div className='bg-main w-fit p-2 rounded-md text-white'>
          Plan activo: <span className='text-green-500'>{`${plan.planStatus.charAt(0).toUpperCase()}${plan.planStatus.slice(1)}`}</span>
        </div>
      </section>
      <Divider />
    </>
  );
};
