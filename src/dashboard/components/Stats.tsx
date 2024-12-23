import CollectionsBookmarkRoundedIcon from "@mui/icons-material/CollectionsBookmarkRounded";
import PeopleAltRoundedIcon from "@mui/icons-material/PeopleAltRounded";
import ViewListRoundedIcon from "@mui/icons-material/ViewListRounded";
import BeenhereRoundedIcon from "@mui/icons-material/BeenhereRounded";
import { useDashboard } from "../../hooks";
export const Stats = () => {
  const { plan, metrics } = useDashboard();

  return (
    <section className='flex flex-col md:flex md:flex-row lg:flex lg:flex-row justify-between xs:flex xs:flex-col w-full gap-6'>
      <div className='w-full md:min-w-[20%] lg:min-w-[20%] relative flex flex-col shadow-md shadow-neutral-200 bg-gradient-to-br from-gray-50 to-main/40 space-y-4 p-6 rounded-md m-0 text-left'>
        <CollectionsBookmarkRoundedIcon style={{ color: "#4caf50" }} />
        <span>Programas activos</span>
        <span>
          {metrics?.activePromotions} / {plan?.promotionLimit}
        </span>
      </div>
      <div className='w-full md:min-w-[20%] lg:min-w-[20%] flex flex-col border-gray-500/10 shadow-md shadow-neutral-200 bg-gradient-to-br from-gray-50 to-main/40 space-y-4 p-6 rounded-md m-0 text-left'>
        <PeopleAltRoundedIcon style={{ color: "#2196F3" }} />
        <span>Clientes Registrados</span>
        <span>
          {metrics?.registeredClients} / {plan?.clientLimit || "Ilimitado"}
        </span>
      </div>
      <div className='w-full md:min-w-[20%] lg:min-w-[20%] flex flex-col shadow-md shadow-neutral-200 bg-gradient-to-br from-gray-50 to-main/40 space-y-4 p-6 rounded-md m-0 text-left'>
        <ViewListRoundedIcon style={{ color: "#FFC107" }} />
        <span>Visitas Totales</span>
        <span>{metrics?.totalVisits}</span>
      </div>
      <div className='w-full md:min-w-[20%] lg:min-w-[20%] flex flex-col shadow-md shadow-neutral-200 bg-gradient-to-br from-gray-50 to-main/40 space-y-4 p-6 rounded-md m-0 text-left'>
        <BeenhereRoundedIcon style={{ color: "#FF5722" }} />
        <span>Promociones Canjeadas</span>
        <span>{metrics?.redeemedGifts}</span>
      </div>
    </section>
  );
};
